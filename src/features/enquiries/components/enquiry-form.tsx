import { ActionForm } from "@/components/admin/action-form";
import {
  CheckboxField,
  CheckboxGroup,
  SelectField,
  TextField,
} from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  contactTopics,
  enquiryKindLabel,
  HONEYPOT_FIELD,
  partnershipTypes,
  volunteerAreas,
  type EnquiryKind,
} from "../schema";
import { submitEnquiry } from "../submit";

const choose = { value: "", label: "Choose…" };

const submitLabel: Record<EnquiryKind, string> = {
  CONTACT: "Send message",
  VOLUNTEER: "Register interest",
  PARTNERSHIP: "Send enquiry",
};

/**
 * A public enquiry form. Works without JavaScript (native form post); with
 * it, errors appear beside their fields and the result is announced. All
 * validation is repeated on the server.
 */
export function EnquiryForm({ kind }: { kind: EnquiryKind }) {
  return (
    <ActionForm
      action={submitEnquiry}
      label={`${enquiryKindLabel[kind]} form`}
      resetOnSuccess
      className="relative space-y-6"
    >
      <input type="hidden" name="kind" value={kind} />
      {/* Hidden from people and assistive technology; automated submitters fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField name="name" label="Your name" required autoComplete="name" maxLength={120} />
        <TextField
          name="email"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
        />
      </div>

      {kind === "CONTACT" ? (
        <SelectField
          name="topic"
          label="Topic"
          required
          defaultValue=""
          options={[choose, ...contactTopics]}
        />
      ) : null}

      {kind === "VOLUNTEER" ? (
        <>
          <CheckboxGroup
            name="areas"
            legend="Areas you are interested in"
            hint="These are planned contribution areas, not open vacancies. Choose at least one."
            options={volunteerAreas}
            defaultValues={[]}
          />
          <TextField
            name="availability"
            label="Availability"
            hint="Optional. For example: weekends, or a few hours a month."
            maxLength={300}
          />
        </>
      ) : null}

      {kind === "PARTNERSHIP" ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            name="organisation"
            label="Organisation"
            required
            autoComplete="organization"
            maxLength={200}
          />
          <SelectField
            name="partnershipType"
            label="Type of partnership"
            required
            defaultValue=""
            options={[choose, ...partnershipTypes]}
          />
        </div>
      ) : null}

      <TextField
        name="message"
        label={kind === "VOLUNTEER" ? "About you" : "Message"}
        hint={
          kind === "VOLUNTEER"
            ? "Your experience and what you would like to contribute."
            : "Please do not include health or other sensitive personal information."
        }
        required
        rows={6}
        maxLength={5000}
      />

      <CheckboxField
        name="consent"
        required
        label="EACH may store these details to read and reply to my message."
        hint={
          <>
            Your message is kept in the EACH website database and read only by authorised staff. See
            the{" "}
            <a href="/privacy" className="text-primary underline underline-offset-4">
              privacy notice
            </a>
            .
          </>
        }
      />

      <SubmitButton pendingLabel="Sending…">{submitLabel[kind]}</SubmitButton>
    </ActionForm>
  );
}
