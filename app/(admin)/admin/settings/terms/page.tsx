import Link from "next/link";
import { redirect } from "next/navigation";

import { RichTextSettingsEditor } from "@/components/admin/rich-text-settings-editor";
import { SettingsEditor } from "@/components/admin/settings-editor";
import { SettingsTabs } from "@/components/admin/settings/settings-tabs";
import { requireRole } from "@/lib/auth/roles";
import {
  DEFAULT_TERMS_EFFECTIVE_DATE,
  DEFAULT_TERMS_MARKDOWN,
  TERMS_CONTENT_SETTING_KEY,
  TERMS_EFFECTIVE_DATE_SETTING_KEY,
  markdownToTermsHtml,
  sanitizeTermsHtml,
} from "@/lib/legal/terms";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function resolveEditorHtml(value?: string | null) {
  const content = value?.trim();
  if (!content) return sanitizeTermsHtml(markdownToTermsHtml(DEFAULT_TERMS_MARKDOWN));
  if (/<[a-z][\s\S]*>/i.test(content)) return sanitizeTermsHtml(content);
  return sanitizeTermsHtml(markdownToTermsHtml(content));
}

export default async function TermsSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");

  try {
    await requireRole(user.email, ["admin"]);
  } catch {
    redirect("/admin");
  }

  const serviceSupabase = await createServiceClient();
  const { data: settings } = await serviceSupabase
    .from("settings")
    .select("key, value, updated_by, updated_at")
    .in("key", [TERMS_EFFECTIVE_DATE_SETTING_KEY, TERMS_CONTENT_SETTING_KEY]);

  const settingsMap = Object.fromEntries(
    (settings ?? []).map((setting) => [setting.key, setting])
  );

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy tracking-tight">
        Settings
      </h1>
      <p className="text-sm text-foreground-muted mt-1 mb-6">
        Manage site configuration, team access, email templates, and legal
        content.
      </p>

      <SettingsTabs active="/admin/settings/terms" />

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-xl text-navy tracking-tight mb-1">
            Terms Page
          </h2>
          <p className="text-sm text-foreground-muted">
            Edit the public Terms & Conditions page. Use the toolbar to format
            headings, links, bold text, and bullet lists.
          </p>
        </div>
        <Link
          href="/terms"
          target="_blank"
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-white border border-warm-200 text-foreground hover:border-navy/30 transition-colors"
        >
          View live page
        </Link>
      </div>

      <div className="space-y-4 max-w-5xl">
        <SettingsEditor
          settingKey={TERMS_EFFECTIVE_DATE_SETTING_KEY}
          label="Effective date"
          rows={1}
          initialValue={
            settingsMap[TERMS_EFFECTIVE_DATE_SETTING_KEY]?.value ??
            DEFAULT_TERMS_EFFECTIVE_DATE
          }
          lastUpdatedBy={settingsMap[TERMS_EFFECTIVE_DATE_SETTING_KEY]?.updated_by}
          lastUpdatedAt={settingsMap[TERMS_EFFECTIVE_DATE_SETTING_KEY]?.updated_at}
        />

        <RichTextSettingsEditor
          settingKey={TERMS_CONTENT_SETTING_KEY}
          label="Terms content"
          initialValue={resolveEditorHtml(settingsMap[TERMS_CONTENT_SETTING_KEY]?.value)}
          lastUpdatedBy={settingsMap[TERMS_CONTENT_SETTING_KEY]?.updated_by}
          lastUpdatedAt={settingsMap[TERMS_CONTENT_SETTING_KEY]?.updated_at}
        />
      </div>
    </div>
  );
}
