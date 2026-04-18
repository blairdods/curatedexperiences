"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ContentVersion {
  id: string;
  version: number;
  title: string | null;
  body: string | null;
  type: string | null;
  status: string | null;
  created_by: string | null;
  change_note: string | null;
  created_at: string;
}

export function ContentVersionHistory({
  contentId,
  versions,
}: {
  contentId: string;
  versions: ContentVersion[];
}) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async (versionId: string) => {
    if (!confirm("Restore this version? Current content will be saved as a new version.")) return;
    setRestoring(true);
    await fetch(`/api/admin/content/${contentId}/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ versionId }),
    });
    setRestoring(false);
    router.refresh();
  };

  if (versions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-5 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-3">
          Version History
        </h2>
        <p className="text-sm text-foreground-muted">
          No versions yet. Versions are created each time you save changes.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-warm-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-warm-100">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted">
          Version History ({versions.length})
        </h2>
      </div>
      <div className="divide-y divide-warm-50">
        {versions.map((v) => (
          <div key={v.id}>
            <button
              onClick={() =>
                setExpandedId(expandedId === v.id ? null : v.id)
              }
              className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-warm-50/50 transition-colors"
            >
              <span className="text-xs font-medium text-navy w-10">
                v{v.version}
              </span>
              <span className="text-xs text-foreground truncate flex-1">
                {v.change_note || v.title || "No note"}
              </span>
              <span className="text-[10px] text-foreground-muted">
                {v.created_by}
              </span>
              <span className="text-[10px] text-foreground-muted">
                {new Date(v.created_at).toLocaleString("en-NZ", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </button>
            {expandedId === v.id && (
              <div className="px-5 pb-4 space-y-3">
                <div className="bg-warm-50 rounded-lg p-3 text-xs">
                  <p className="text-foreground-muted mb-1">Title: {v.title}</p>
                  <p className="text-foreground-muted mb-1">Type: {v.type} | Status: {v.status}</p>
                  <p className="text-foreground/70 whitespace-pre-wrap max-h-40 overflow-auto">
                    {v.body?.substring(0, 500)}
                    {(v.body?.length ?? 0) > 500 ? "..." : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleRestore(v.id)}
                  disabled={restoring}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  {restoring ? "Restoring..." : "Restore this version"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
