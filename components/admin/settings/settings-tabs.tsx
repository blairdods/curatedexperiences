import Link from "next/link";

const SETTINGS_TABS = [
  { href: "/admin/settings/concierge", label: "AI Concierge" },
  { href: "/admin/settings/team", label: "Team Management" },
  { href: "/admin/settings/emails", label: "Email Templates" },
  { href: "/admin/settings/terms", label: "Terms Page" },
  { href: "/admin/settings/privacy", label: "Privacy Page" },
];

export function SettingsTabs({ active }: { active: string }) {
  return (
    <div className="mb-6 border-b border-warm-200">
      <div className="flex gap-0 overflow-x-auto -mx-1">
        {SETTINGS_TABS.map((tab) => {
          const isActive = active === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? "border-navy text-navy font-medium"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
