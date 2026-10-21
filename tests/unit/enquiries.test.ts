import { afterEach, describe, expect, it, vi } from "vitest";
import type { Inquiry } from "@/generated/prisma/client";
import { acknowledgementEmail, notificationEmail } from "@/features/enquiries/delivery";
import { enquiryInputSchema } from "@/features/enquiries/schema";
import { sendEmail } from "@/services/email";
import { parseEmailEnv } from "@/validation/env";

const contact = {
  kind: "CONTACT",
  name: "Amina Nakato",
  email: "amina@example.org",
  topic: "general",
  message: "I would like to learn more about the herbarium.",
  consent: true,
};

function issues(input: unknown) {
  const result = enquiryInputSchema.safeParse(input);
  return result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((i) => [i.path[0], i.message]));
}

describe("enquiry validation", () => {
  it("accepts a complete form of each kind", () => {
    expect(enquiryInputSchema.safeParse(contact).success).toBe(true);
    expect(
      enquiryInputSchema.safeParse({
        ...contact,
        kind: "VOLUNTEER",
        topic: undefined,
        areas: ["documentation", "education"],
        availability: null,
      }).success,
    ).toBe(true);
    expect(
      enquiryInputSchema.safeParse({
        ...contact,
        kind: "PARTNERSHIP",
        organisation: "Example Field Station",
        partnershipType: "research",
      }).success,
    ).toBe(true);
  });

  it("reports each invalid field with a readable message", () => {
    expect(issues({ ...contact, name: "", email: "not-an-email", message: "short" })).toEqual({
      name: "Enter your name.",
      email: "Enter an email address in the format name@example.com.",
      message: "Write at least 10 characters.",
    });
  });

  it("requires consent", () => {
    expect(issues({ ...contact, consent: false })).toHaveProperty("consent");
  });

  it("rejects values outside the offered choices, whatever the browser sent", () => {
    expect(issues({ ...contact, topic: "<script>" })).toHaveProperty("topic");
    expect(
      issues({ ...contact, kind: "VOLUNTEER", areas: ["director"], availability: null }),
    ).toHaveProperty("areas");
    expect(issues({ ...contact, kind: "VOLUNTEER", areas: [], availability: null })).toEqual({
      areas: "Choose at least one area.",
    });
    expect(issues({ ...contact, kind: "NEWSLETTER" })).toHaveProperty("kind");
  });

  it("limits lengths", () => {
    expect(issues({ ...contact, message: "x".repeat(5001) })).toHaveProperty("message");
    expect(issues({ ...contact, name: "x".repeat(121) })).toHaveProperty("name");
  });

  it("drops fields the form does not define", () => {
    const parsed = enquiryInputSchema.parse({ ...contact, status: "CLOSED", id: "x" });
    expect(parsed).not.toHaveProperty("status");
    expect(parsed).not.toHaveProperty("id");
  });
});

describe("email settings", () => {
  it("is null unless all three variables are set", () => {
    expect(parseEmailEnv({})).toBeNull();
    expect(parseEmailEnv({ RESEND_API_KEY: "re_x", EMAIL_FROM: "EACH <a@b.org>" })).toBeNull();
    expect(
      parseEmailEnv({
        RESEND_API_KEY: "re_x",
        EMAIL_FROM: "EACH <a@b.org>",
        ENQUIRY_NOTIFICATION_EMAIL: "staff@b.org",
      }),
    ).toEqual({ apiKey: "re_x", from: "EACH <a@b.org>", notificationEmail: "staff@b.org" });
  });

  it("rejects an invalid notification address", () => {
    expect(() =>
      parseEmailEnv({
        RESEND_API_KEY: "re_x",
        EMAIL_FROM: "x@y.z",
        ENQUIRY_NOTIFICATION_EMAIL: "nope",
      }),
    ).toThrow(/ENQUIRY_NOTIFICATION_EMAIL/);
  });
});

const enquiry = {
  id: "enq_1",
  kind: "PARTNERSHIP",
  status: "NEW",
  topic: "Research or herbarium collaboration",
  name: "Amina Nakato",
  email: "amina@example.org",
  organisation: "Example Field Station",
  message: "A secret proposal text.",
  details: { partnershipType: "research" },
  notificationStatus: "PENDING",
  acknowledgementStatus: "PENDING",
  deliveryError: null,
  deliveryAttempts: 0,
  createdAt: new Date("2026-10-21T10:00:00Z"),
  updatedAt: new Date("2026-10-21T10:00:00Z"),
} as Inquiry;

describe("enquiry emails", () => {
  it("sends staff the full enquiry with reply-to set to the submitter", () => {
    const message = notificationEmail(enquiry, "staff@each.test");
    expect(message.to).toBe("staff@each.test");
    expect(message.replyTo).toBe("amina@example.org");
    expect(message.text).toContain("A secret proposal text.");
    expect(message.text).toContain("Organisation: Example Field Station");
    expect(message.text).toContain("/admin/enquiries/enq_1");
  });

  it("acknowledges without repeating any submitted text", () => {
    const message = acknowledgementEmail(enquiry);
    expect(message.to).toBe("amina@example.org");
    expect(message.text).not.toContain("secret");
    expect(message.text).not.toContain("Amina");
    expect(message.subject).not.toContain("Amina");
  });
});

describe("sendEmail", () => {
  const config = { apiKey: "re_test", from: "EACH <a@b.org>", notificationEmail: "s@b.org" };
  afterEach(() => vi.unstubAllGlobals());

  it("posts plain text to Resend with the API key", async () => {
    const fetch = vi.fn(async () => Response.json({ id: "email_1" }));
    vi.stubGlobal("fetch", fetch);
    const result = await sendEmail(config, {
      to: "x@y.org",
      subject: "Hi",
      text: "Body",
      replyTo: "r@y.org",
    });
    expect(result).toEqual({ ok: true, id: "email_1" });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer re_test");
    expect(JSON.parse(String(init.body))).toEqual({
      from: "EACH <a@b.org>",
      to: ["x@y.org"],
      subject: "Hi",
      text: "Body",
      reply_to: "r@y.org",
    });
  });

  it("reports a rejected request without throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ message: "Domain not verified" }, { status: 403 })),
    );
    expect(await sendEmail(config, { to: "x@y.org", subject: "s", text: "t" })).toEqual({
      ok: false,
      error: "Email service returned 403: Domain not verified",
    });
  });

  it("reports a network failure without throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new TypeError("fetch failed"))),
    );
    expect(await sendEmail(config, { to: "x@y.org", subject: "s", text: "t" })).toEqual({
      ok: false,
      error: "Email service unreachable (TypeError)",
    });
  });
});
