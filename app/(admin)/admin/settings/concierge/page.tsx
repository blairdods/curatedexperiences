import { redirect } from "next/navigation";

import { SettingsEditor } from "@/components/admin/settings-editor";
import { SettingsTabs } from "@/components/admin/settings/settings-tabs";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const SETTING_GROUPS = [
  {
    title: "Brand Persona",
    description: "Who we are — injected into all AI system prompts",
    keys: [
      {
        key: "brand_voice_persona",
        label: "Our CE Curators — Persona",
        rows: 8,
      },
    ],
  },
  {
    title: "Voice & Tone",
    description: "How we speak — tone principles for all AI outputs",
    keys: [
      {
        key: "brand_voice_tone",
        label: "Tone Principles",
        rows: 8,
      },
    ],
  },
  {
    title: "Vocabulary",
    description: "Words we use and words we avoid",
    keys: [
      {
        key: "brand_voice_vocabulary_use",
        label: "Words & Phrases We Use",
        rows: 6,
      },
      {
        key: "brand_voice_vocabulary_avoid",
        label: "Words & Phrases We Avoid",
        rows: 6,
      },
    ],
  },
  {
    title: "Rules",
    description: "Hard rules — what CE will and won't say",
    keys: [
      {
        key: "brand_voice_rules",
        label: "Will / Won't Rules",
        rows: 10,
      },
    ],
  },
  {
    title: "Concierge",
    description: "Concierge widget settings",
    keys: [
      {
        key: "concierge_greeting",
        label: "Welcome Message",
        rows: 2,
      },
    ],
  },
];

export default async function ConciergeSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const allKeys = SETTING_GROUPS.flatMap((group) =>
    group.keys.map((field) => field.key)
  );

  const serviceSupabase = await createServiceClient();
  const { data: settings } = await serviceSupabase
    .from("settings")
    .select("key, value, updated_by, updated_at")
    .in("key", allKeys);

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

      <SettingsTabs active="/admin/settings/concierge" />

      <div>
        <h2 className="font-serif text-xl text-navy tracking-tight">
          AI Concierge
        </h2>
        <p className="text-sm text-foreground-muted mt-1">
          Edit brand voice and concierge configuration. Changes take effect
          immediately on the next concierge conversation.
        </p>
      </div>

      <div className="mt-8 space-y-10">
        {SETTING_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="font-serif text-lg text-navy tracking-tight">
              {group.title}
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5 mb-4">
              {group.description}
            </p>
            <div className="space-y-4">
              {group.keys.map((field) => (
                <SettingsEditor
                  key={field.key}
                  settingKey={field.key}
                  label={field.label}
                  rows={field.rows}
                  initialValue={settingsMap[field.key]?.value ?? ""}
                  lastUpdatedBy={settingsMap[field.key]?.updated_by}
                  lastUpdatedAt={settingsMap[field.key]?.updated_at}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
