"use server";

import { clientIp, fingerprint } from "@/features/auth";
import { ActionError, formData, parseInput, runAction, type ActionState } from "@/features/cms";
import { getDb } from "@/services/db";
import { checkRateLimit, rateLimits } from "@/services/rate-limit";
import { deliverEnquiry } from "./delivery";
import {
  enquiryInputSchema,
  HONEYPOT_FIELD,
  labelOf,
  partnershipTypes,
  type EnquiryInput,
} from "./schema";

const { text, optionalText, checkbox, values } = formData;

const received: ActionState = {
  ok: true,
  message: "Thank you. Your message has been received and will be read by the EACH team.",
};

function readInput(form: FormData): unknown {
  const kind = text(form, "kind");
  const shared = {
    kind,
    name: text(form, "name"),
    email: text(form, "email"),
    message: text(form, "message"),
    consent: checkbox(form, "consent"),
  };
  switch (kind) {
    case "CONTACT":
      return { ...shared, topic: text(form, "topic") };
    case "VOLUNTEER":
      return {
        ...shared,
        areas: values(form, "areas"),
        availability: optionalText(form, "availability"),
      };
    case "PARTNERSHIP":
      return {
        ...shared,
        organisation: text(form, "organisation"),
        partnershipType: text(form, "partnershipType"),
      };
    default:
      return shared;
  }
}

function toRecord(input: EnquiryInput, consentedAt: string) {
  const shared = { kind: input.kind, name: input.name, email: input.email, message: input.message };
  switch (input.kind) {
    case "CONTACT":
      return { ...shared, topic: input.topic, details: { consentedAt } };
    case "VOLUNTEER":
      return {
        ...shared,
        topic: "Volunteer interest",
        details: { consentedAt, areas: input.areas, availability: input.availability },
      };
    case "PARTNERSHIP":
      return {
        ...shared,
        topic: labelOf(partnershipTypes, input.partnershipType),
        organisation: input.organisation,
        details: { consentedAt, partnershipType: input.partnershipType },
      };
  }
}

/**
 * Public form submission. Validated on the server whatever the browser sent,
 * rate limited per client and per email address, and stored before any email
 * is attempted so an email failure never loses an enquiry.
 */
export async function submitEnquiry(_state: ActionState, form: FormData): Promise<ActionState> {
  return runAction(async () => {
    const db = getDb();
    const settings = await db.siteSettings.findUnique({
      where: { id: 1 },
      select: { acceptEnquiries: true },
    });
    if (!settings?.acceptEnquiries) {
      throw new ActionError("Online forms are not available at the moment.");
    }

    // Filled only by automated submitters: report success, store nothing.
    if (text(form, HONEYPOT_FIELD)) return received;

    const byIp = await checkRateLimit(rateLimits.enquiryByIp, fingerprint(await clientIp()));
    if (!byIp.allowed) {
      throw new ActionError(
        `Too many messages were sent from this connection. Try again in ${Math.ceil(byIp.retryAfterSeconds / 60)} minutes.`,
      );
    }

    const input = parseInput(enquiryInputSchema, readInput(form));

    const byEmail = await checkRateLimit(
      rateLimits.enquiryByEmail,
      fingerprint(input.email.toLowerCase()),
    );
    if (!byEmail.allowed) {
      throw new ActionError(
        `Several messages were already sent from this email address. Try again in ${Math.ceil(byEmail.retryAfterSeconds / 60)} minutes.`,
      );
    }

    const enquiry = await db.inquiry.create({
      data: toRecord(input, new Date().toISOString()),
      select: { id: true },
    });

    try {
      await deliverEnquiry(enquiry.id);
    } catch (error) {
      // The enquiry is stored; staff see the pending email status in the admin.
      console.error("[enquiry delivery]", enquiry.id, error);
    }
    return received;
  });
}
