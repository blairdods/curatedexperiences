"use client";

interface Activity {
  id: string;
  type: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
}

const TYPE_ICONS: Record<string, { bg: string; label: string }> = {
  status_change: { bg: "bg-blue-500", label: "Status" },
  note: { bg: "bg-amber-500", label: "Note" },
  email_sent: { bg: "bg-purple-500", label: "Email" },
  assignment: { bg: "bg-green-500", label: "Assigned" },
  score_change: { bg: "bg-red-500", label: "Score" },
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-foreground-muted text-center py-6">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-warm-200" />
      <div className="space-y-4">
        {activities.map((activity) => {
          const typeInfo = TYPE_ICONS[activity.type] ?? {
            bg: "bg-gray-400",
            label: activity.type,
          };
          return (
            <div key={activity.id} className="flex gap-3 relative">
              <div
                className={`w-6 h-6 rounded-full ${typeInfo.bg} flex items-center justify-center flex-shrink-0 z-10`}
              >
                <span className="text-white text-[8px] font-bold">
                  {typeInfo.label.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <p className="text-sm text-foreground">{activity.description}</p>
                <p className="text-[11px] text-foreground-muted mt-0.5">
                  {activity.created_by ?? "System"} &middot;{" "}
                  {new Date(activity.created_at).toLocaleDateString("en-NZ", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
