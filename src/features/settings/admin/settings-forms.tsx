import type { ReactNode } from "react";
import { ActionForm } from "@/components/admin/action-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { CheckboxField, SelectField, TextField } from "@/components/admin/form-fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { hasMenu, primaryNavigation, type NavItem } from "@/config/navigation";
import type { MediaOption } from "@/features/media";
import type { SiteSettings } from "../schema";
import { saveSettings } from "./actions";

function SettingsSection({
  section,
  label,
  children,
}: {
  section: "contact" | "branding" | "footer" | "seo" | "navigation";
  label: string;
  children: ReactNode;
}) {
  return (
    <ActionForm action={saveSettings} label={label} className="max-w-3xl space-y-6">
      <input type="hidden" name="section" value={section} />
      {children}
      <SubmitButton pendingLabel="Saving…">Save {label.toLowerCase()}</SubmitButton>
    </ActionForm>
  );
}

export function ContactSettingsForm({ settings }: { settings: SiteSettings }) {
  return (
    <SettingsSection section="contact" label="Contact details">
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
        <TextField
          name="locationText"
          label="Location"
          defaultValue={settings.locationText}
          hint="Where EACH works, in words, for example a town and country."
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
    </SettingsSection>
  );
}

export function BrandingSettingsForm({ settings }: { settings: SiteSettings }) {
  return (
    <SettingsSection section="branding" label="Branding text">
      <AdminPanel
        title="Tagline"
        description="One sentence about EACH. Shown in the footer and used as the default search description and in structured data."
      >
        <TextField
          name="tagline"
          label="Tagline"
          required
          rows={2}
          maxLength={300}
          defaultValue={settings.tagline}
        />
      </AdminPanel>
    </SettingsSection>
  );
}

export function FooterSettingsForm({ settings }: { settings: SiteSettings }) {
  return (
    <SettingsSection section="footer" label="Footer">
      <AdminPanel
        title="Footer"
        description="The footer's links come from the navigation; its calls to action stay in the design."
      >
        <TextField
          name="footerStatement"
          label="Closing statement"
          required
          maxLength={160}
          defaultValue={settings.footerStatement}
        />
        <TextField
          name="footerNote"
          label="Small print"
          rows={2}
          maxLength={400}
          defaultValue={settings.footerNote}
        />
        <TextField
          name="copyrightText"
          label="Copyright line"
          maxLength={160}
          defaultValue={settings.copyrightText}
          hint="Optional. Leave empty to hide. Use the wording EACH has approved."
        />
      </AdminPanel>
    </SettingsSection>
  );
}

export function SeoSettingsForm({
  settings,
  images,
}: {
  settings: SiteSettings & { socialImageId: string | null };
  images: readonly MediaOption[];
}) {
  return (
    <SettingsSection section="seo" label="Search defaults">
      <AdminPanel
        title="Default sharing image"
        description="Used when a page without its own image is shared. Every page's own title, description and indexing are edited with that page."
      >
        <SelectField
          name="socialImageId"
          label="Image"
          options={[
            { value: "", label: "Built-in default (homepage hero photograph)" },
            ...images.map((image) => ({ value: image.id, label: image.label })),
          ]}
          defaultValue={settings.socialImageId ?? ""}
        />
      </AdminPanel>
    </SettingsSection>
  );
}

/**
 * Labels, descriptions, order and visibility of the approved navigation.
 * Destinations are fixed in code (src/config/navigation.ts): menus can only
 * point at real pages, and the mega-menu structure stays intact.
 */
export function NavigationSettingsForm({ settings }: { settings: SiteSettings }) {
  const { items, links } = settings.navigation;
  const base = primaryNavigation as readonly NavItem[];

  return (
    <SettingsSection section="navigation" label="Navigation">
      {base.map((item, index) => {
        const override = items[item.id] ?? {};
        return (
          <AdminPanel key={item.id} title={item.label} description={`Opens ${item.href}`}>
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_8rem]">
              <TextField
                name={`nav.item.${item.id}.label`}
                label="Menu label"
                required
                maxLength={40}
                defaultValue={override.label ?? item.label}
              />
              <TextField
                name={`nav.item.${item.id}.order`}
                label="Position"
                type="number"
                required
                defaultValue={override.order ?? index + 1}
              />
            </div>
            {hasMenu(item) ? (
              <>
                <TextField
                  name={`nav.item.${item.id}.summary`}
                  label="Menu introduction"
                  rows={2}
                  maxLength={300}
                  defaultValue={override.summary ?? item.summary}
                />
                {item.groups.map((group) => (
                  <fieldset
                    key={group.heading}
                    className="space-y-4 rounded-sm border border-border p-4"
                  >
                    <legend className="px-1 text-sm font-medium">{group.heading}</legend>
                    {group.links.map((link, linkIndex) => {
                      const linkOverride = links[link.href] ?? {};
                      return (
                        <div
                          key={link.href}
                          className="space-y-4 border-t border-border pt-4 first:border-0 first:pt-0"
                        >
                          <p className="text-sm text-muted-foreground">{link.href}</p>
                          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_8rem]">
                            <TextField
                              name={`nav.link.${link.href}.label`}
                              label="Label"
                              required
                              maxLength={40}
                              defaultValue={linkOverride.label ?? link.label}
                            />
                            <TextField
                              name={`nav.link.${link.href}.order`}
                              label="Position"
                              type="number"
                              required
                              defaultValue={linkOverride.order ?? linkIndex + 1}
                            />
                          </div>
                          <TextField
                            name={`nav.link.${link.href}.description`}
                            label="Description"
                            maxLength={160}
                            defaultValue={linkOverride.description ?? link.description}
                          />
                          <CheckboxField
                            name={`nav.link.${link.href}.hidden`}
                            label="Hide this link"
                            defaultChecked={linkOverride.hidden ?? false}
                          />
                        </div>
                      );
                    })}
                  </fieldset>
                ))}
              </>
            ) : null}
          </AdminPanel>
        );
      })}
    </SettingsSection>
  );
}
