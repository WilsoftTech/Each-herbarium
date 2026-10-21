import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import EnquiriesPage from "@/app/(admin)/admin/(console)/enquiries/page";
import { retryEnquiryDelivery, submitEnquiry, updateEnquiryStatus } from "@/features/enquiries";
import { getDb } from "@/services/db";
import { createUser, expectNotFound, form, idle, signInAs } from "./helpers";

const emailVariables = ["RESEND_API_KEY", "EMAIL_FROM", "ENQUIRY_NOTIFICATION_EMAIL"] as const;

function configureEmail() {
  process.env.RESEND_API_KEY = "re_test";
  process.env.EMAIL_FROM = "EACH <enquiries@each.test>";
  process.env.ENQUIRY_NOTIFICATION_EMAIL = "staff@each.test";
}

/** Each test sends from its own address, so per-client limits do not interfere. */
function fromAddress(ip = `203.0.113.${Math.floor(Math.random() * 250)}-${randomUUID()}`) {
  vi.mocked(headers).mockResolvedValue(new Headers({ "x-forwarded-for": ip }));
  return ip;
}

function contact(overrides: Record<string, string | boolean | string[]> = {}) {
  return form({
    kind: "CONTACT",
    name: "Test Submitter",
    email: `submitter-${randomUUID().slice(0, 8)}@example.org`,
    topic: "general",
    message: "A question about the herbarium reference specimens.",
    consent: true,
    ...overrides,
  });
}

async function setForms(acceptEnquiries: boolean) {
  await getDb().siteSettings.upsert({
    where: { id: 1 },
    update: { acceptEnquiries },
    create: { id: 1, acceptEnquiries },
  });
}

async function latestFor(email: string) {
  return getDb().inquiry.findFirst({ where: { email }, orderBy: { createdAt: "desc" } });
}

const ok = Response.json({ id: "email_ok" });

beforeAll(() => setForms(true));
afterAll(async () => {
  await setForms(false);
  await getDb().inquiry.deleteMany({ where: { email: { endsWith: "@example.org" } } });
});
beforeEach(() => {
  fromAddress();
  for (const name of emailVariables) delete process.env[name];
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.mocked(headers).mockResolvedValue(new Headers());
});

describe("public enquiry submission", () => {
  it("stores the enquiry and marks email not configured when Resend is not set up", async () => {
    const data = contact();
    const result = await submitEnquiry(idle, data);
    expect(result).toMatchObject({ ok: true });

    const stored = await latestFor(String(data.get("email")));
    expect(stored).toMatchObject({
      kind: "CONTACT",
      status: "NEW",
      topic: "general",
      notificationStatus: "NOT_CONFIGURED",
      acknowledgementStatus: "NOT_CONFIGURED",
    });
    expect(stored?.details).toHaveProperty("consentedAt");
  });

  it("sends the staff notification and the acknowledgement", async () => {
    configureEmail();
    const fetch = vi.fn(async () => ok.clone());
    vi.stubGlobal("fetch", fetch);
    const data = contact();
    expect(await submitEnquiry(idle, data)).toMatchObject({ ok: true });

    expect(fetch).toHaveBeenCalledTimes(2);
    const stored = await latestFor(String(data.get("email")));
    expect(stored).toMatchObject({
      notificationStatus: "SENT",
      acknowledgementStatus: "SENT",
      deliveryError: null,
      deliveryAttempts: 1,
    });
  });

  it("keeps the enquiry when email fails, records the error and still thanks the submitter", async () => {
    configureEmail();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ message: "Domain not verified" }, { status: 403 })),
    );
    const data = contact();
    expect(await submitEnquiry(idle, data)).toMatchObject({ ok: true });

    const stored = await latestFor(String(data.get("email")));
    expect(stored).toMatchObject({ notificationStatus: "FAILED", acknowledgementStatus: "FAILED" });
    expect(stored?.deliveryError).toContain("403: Domain not verified");
    expect(error).toHaveBeenCalledWith("[enquiry delivery]", stored?.id, expect.any(String));
    error.mockRestore();
  });

  it("rejects invalid input on the server and stores nothing", async () => {
    const email = `invalid-${randomUUID().slice(0, 8)}@example.org`;
    const result = await submitEnquiry(
      idle,
      contact({ email, topic: "not-a-topic", message: "short", consent: false }),
    );
    expect(result.ok).toBe(false);
    expect(result.fieldErrors).toMatchObject({
      topic: expect.any(String),
      message: "Write at least 10 characters.",
      consent: expect.any(String),
    });
    expect(await latestFor(email)).toBeNull();
  });

  it("stores volunteer and partnership answers in their own fields", async () => {
    const volunteer = form({
      kind: "VOLUNTEER",
      name: "Volunteer",
      email: `volunteer-${randomUUID().slice(0, 8)}@example.org`,
      areas: ["documentation", "editorial"],
      availability: "Weekends",
      message: "I have experience pressing plant specimens.",
      consent: true,
    });
    expect(await submitEnquiry(idle, volunteer)).toMatchObject({ ok: true });
    expect(await latestFor(String(volunteer.get("email")))).toMatchObject({
      kind: "VOLUNTEER",
      topic: "Volunteer interest",
      details: expect.objectContaining({
        areas: ["documentation", "editorial"],
        availability: "Weekends",
      }),
    });

    fromAddress();
    const partnership = form({
      kind: "PARTNERSHIP",
      name: "Partner",
      email: `partner-${randomUUID().slice(0, 8)}@example.org`,
      organisation: "Example Field Station",
      partnershipType: "conservation",
      message: "We would like to discuss a conservation project.",
      consent: true,
    });
    expect(await submitEnquiry(idle, partnership)).toMatchObject({ ok: true });
    expect(await latestFor(String(partnership.get("email")))).toMatchObject({
      kind: "PARTNERSHIP",
      organisation: "Example Field Station",
      topic: "Conservation project",
    });
  });

  it("pretends to accept a filled honeypot but stores nothing", async () => {
    const data = contact({ website: "https://spam.example" });
    expect(await submitEnquiry(idle, data)).toMatchObject({ ok: true });
    expect(await latestFor(String(data.get("email")))).toBeNull();
  });

  it("limits submissions per client address", async () => {
    fromAddress(`198.51.100.7-${randomUUID()}`);
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(await submitEnquiry(idle, contact())).toMatchObject({ ok: true });
    }
    const blocked = contact();
    const result = await submitEnquiry(idle, blocked);
    expect(result).toMatchObject({
      ok: false,
      message: expect.stringMatching(/Too many messages/),
    });
    expect(await latestFor(String(blocked.get("email")))).toBeNull();
  });

  it("limits submissions per email address across client addresses", async () => {
    const email = `repeat-${randomUUID().slice(0, 8)}@example.org`;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      fromAddress();
      expect(await submitEnquiry(idle, contact({ email }))).toMatchObject({ ok: true });
    }
    fromAddress();
    expect(await submitEnquiry(idle, contact({ email: email.toUpperCase() }))).toMatchObject({
      ok: false,
      message: expect.stringMatching(/this email address/),
    });
    expect(await getDb().inquiry.count({ where: { email } })).toBe(3);
  });

  it("refuses submissions while the forms are switched off", async () => {
    await setForms(false);
    try {
      const data = contact();
      expect(await submitEnquiry(idle, data)).toEqual({
        ok: false,
        message: "Online forms are not available at the moment.",
      });
      expect(await latestFor(String(data.get("email")))).toBeNull();
    } finally {
      await setForms(true);
    }
  });
});

describe("enquiries in the admin", () => {
  async function storedEnquiry() {
    const data = contact();
    await submitEnquiry(idle, data);
    return (await latestFor(String(data.get("email"))))!;
  }

  it("is hidden from editors and signed-out visitors", async () => {
    const enquiry = await storedEnquiry();
    await signInAs(await createUser("editor"));
    await expectNotFound(EnquiriesPage({ searchParams: Promise.resolve({}) } as never));
    expect(await updateEnquiryStatus(idle, form({ id: enquiry.id, status: "CLOSED" }))).toEqual({
      ok: false,
      message: "You do not have permission to do that.",
    });
    expect(await retryEnquiryDelivery(idle, form({ id: enquiry.id }))).toMatchObject({ ok: false });
    expect((await getDb().inquiry.findUniqueOrThrow({ where: { id: enquiry.id } })).status).toBe(
      "NEW",
    );
    await signInAs(null);
  });

  it("lets a reviewer change the status, with an audit event", async () => {
    const enquiry = await storedEnquiry();
    const reviewer = await createUser("reviewer");
    await signInAs(reviewer);
    expect(await updateEnquiryStatus(idle, form({ id: enquiry.id, status: "CLOSED" }))).toEqual({
      ok: true,
      message: "Status saved.",
    });
    expect((await getDb().inquiry.findUniqueOrThrow({ where: { id: enquiry.id } })).status).toBe(
      "CLOSED",
    );
    const event = await getDb().auditEvent.findFirstOrThrow({
      where: { action: "enquiry.status", entityId: enquiry.id },
    });
    expect(event.actorId).toBe(reviewer.id);
    expect(JSON.stringify(event)).not.toContain(enquiry.email);
    await signInAs(null);
  });

  it("retries unsent email once Resend is configured", async () => {
    const enquiry = await storedEnquiry();
    expect(enquiry.notificationStatus).toBe("NOT_CONFIGURED");
    await signInAs(await createUser("admin"));

    configureEmail();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ok.clone()),
    );
    expect(await retryEnquiryDelivery(idle, form({ id: enquiry.id }))).toEqual({
      ok: true,
      message: "Emails sent.",
    });
    expect(await getDb().inquiry.findUniqueOrThrow({ where: { id: enquiry.id } })).toMatchObject({
      notificationStatus: "SENT",
      acknowledgementStatus: "SENT",
    });
    await signInAs(null);
  });
});
