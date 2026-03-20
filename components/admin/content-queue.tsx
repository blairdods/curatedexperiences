"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ContentItem {
  id: string;
  type: string | null;
  title: string | null;
  body: string | null;
  status: string;
  created_at: string;
}

export function ContentQueue({ items }: { items: ContentItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const supabase = createClient();

    if (action === "approve") {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from("content")
        .update({ status: "active", approved_by: user?.email })
        .eq("id", id);
    } else {
      await supabase
        .from("content")
        .update({ status: "archived" })
        .eq("id", id);
    }

    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-foreground-muted bg-warm-50/50 rounded-xl border border-dashed border-warm-200">
        No content pending approval. All clear!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-warm-200 overflow-hidden"
        >
          <div
            className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-warm-50/50"
            onClick={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {item.title ?? "Untitled"}
              </p>
              <p className="text-xs text-foreground-muted">
                {item.type} —{" "}
                {new Date(item.created_at).toLocaleDateString("en-NZ")}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              Pending
            </span>
          </div>

          {expandedId === item.id && (
            <div className="px-5 pb-5 border-t border-warm-100 pt-4">
              <div className="bg-warm-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {item.body?.slice(0, 2000) ?? "No content"}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => handleAction(item.id, "approve")}
                  className="px-4 py-2 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve & Publish
                </button>
                <button
                  onClick={() => handleAction(item.id, "reject")}
                  className="px-4 py-2 text-xs font-medium bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
