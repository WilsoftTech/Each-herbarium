import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import type { SiteSettings } from "../schema";
import { saveSettings } from "./actions";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  return (
    <ActionForm action={saveSettings} label="Site settings" className="max-w-3xl space-y-6">
      <AdminPanel
        title="Contact details"
        description="Shown on the contact page. Leave a field empty until EACH has confirmed it."
      >
        <TextField
          name="contactEmail"
          label="Email address"
          type="email"
          defaultValue={settings.contactEmail}
        />
        <TextField name="phone" label="Telephone" defaultValue={settings.phone} />
        <TextField
          name="postalAddress"
          label="Postal address"
          rows={3}
          defaultValue={settings.postalAddress}
        />
        <TextField name="officeHours" label="Office hours" defaultValue={settings.officeHours} />
      </AdminPanel>
      <AdminPanel title="Social accounts">
        <TextField
          name="socialLinks"
          label="Official accounts"
          rows={4}
          defaultValue={settings.socialLinks
            .map((link) => `${link.label} | ${link.url}`)
            .join("\n")}
          hint="One per line: Name | https://address"
        />
      </AdminPanel>
      <SubmitButton pendingLabel="Saving…">Save settings</SubmitButton>
    </ActionForm>
  );
}
