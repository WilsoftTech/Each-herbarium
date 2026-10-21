import "server-only";
import { env, getEmailEnv } from "@/config/env";
import type { Inquiry } from "@/generated/prisma/client";
import { getDb } from "@/services/db";
import { sendEmail, type EmailMessage } from "@/services/email";
import {
  contactTopics,
  enquiryKindLabel,
  labelOf,
  partnershipTypes,
  volunteerAreas,
} from "./schema";

type Details = { areas?: string[]; availability?: string | null; partnershipType?: string };

function detailLines(enquiry: Inquiry): string[] {
  const details = (enquiry.details ?? {}) as Details;
  const lines: string[] = [];
  if (enquiry.kind === "CONTACT") lines.push(`Topic: ${labelOf(contactTopics, enquiry.topic)}`);
  if (enquiry.organisation) lines.push(`Organisation: ${enquiry.organisation}`);
  if (details.partnershipType) {
    lines.push(`Partnership: ${labelOf(partnershipTypes, details.partnershipType)}`);
  }
  if (details.areas?.length) {
    lines.push(`Areas: ${details.areas.map((area) => labelOf(volunteerAreas, area)).join(", ")}`);
  }
  if (details.availability) lines.push(`Availability: ${details.availability}`);
  return lines;
}

/** Staff notification with the full submission. Reply-to is the submitter. */
export function notificationEmail(enquiry: Inquiry, to: string): EmailMessage {
  const kind = enquiryKindLabel[enquiry.kind];
  return {
    to,
    replyTo: enquiry.email,
    subject: `New ${kind.toLowerCase()} from the EACH website`,
    text: [
      `${kind} received ${enquiry.createdAt.toISOString()}`,
      "",
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      ...detailLines(enquiry),
      "",
      enquiry.message,
      "",
      `Open in the admin: ${env.siteUrl}/admin/enquiries/${enquiry.id}`,
    ].join("\n"),
  };
}

/**
 * Acknowledgement to the submitter. It deliberately repeats none of the
 * submitted text, so the form cannot be used to send chosen content to
 * someone else's address.
 */
export function acknowledgementEmail(enquiry: Inquiry): EmailMessage {
  return {
    to: enquiry.email,
    subject: "We have received your message — EACH",
    text: [
      "Thank you for contacting East African Community Herbariums (EACH).",
      "",
      "Your message has been received and will be read by our team. If you did not send it, you can ignore this email.",
      "",
      "This is an automatic message; replies to it are not monitored.",
    ].join("\n"),
  };
}

/**
 * Sends the emails for a stored enquiry that have not been sent yet and
 * records each outcome. Never throws for email failures: the enquiry is
 * already safe in the database, and staff see the status in the admin.
 */
export async function deliverEnquiry(id: string): Promise<void> {
  const db = getDb();
  const enquiry = await db.inquiry.findUnique({ where: { id } });
  if (!enquiry) return;

  const config = getEmailEnv();
  if (!config) {
    await db.inquiry.update({
      where: { id },
      data: {
        notificationStatus: enquiry.notificationStatus === "SENT" ? "SENT" : "NOT_CONFIGURED",
        acknowledgementStatus: enquiry.acknowledgementStatus === "SENT" ? "SENT" : "NOT_CONFIGURED",
      },
    });
    return;
  }

  const errors: string[] = [];
  // An arrow function (not a hoisted declaration) keeps `config` narrowed to non-null.
  const attempt = async (current: Inquiry["notificationStatus"], message: EmailMessage) => {
    if (current === "SENT") return "SENT" as const;
    const result = await sendEmail(config, message);
    if (result.ok) return "SENT" as const;
    errors.push(result.error);
    return "FAILED" as const;
  };

  const notificationStatus = await attempt(
    enquiry.notificationStatus,
    notificationEmail(enquiry, config.notificationEmail),
  );
  const acknowledgementStatus = await attempt(
    enquiry.acknowledgementStatus,
    acknowledgementEmail(enquiry),
  );

  if (errors.length) console.error("[enquiry delivery]", id, errors.join("; "));
  await db.inquiry.update({
    where: { id },
    data: {
      notificationStatus,
      acknowledgementStatus,
      deliveryError: errors.length ? errors.join("; ").slice(0, 1000) : null,
      deliveryAttempts: { increment: 1 },
    },
  });
}
