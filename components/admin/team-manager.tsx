"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface TeamMember {
  id: string;
  email: string;
  role: string;
  display_name: string | null;
  created_at: string;
}

export function TeamManager({ members }: { members: TeamMember[] }) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("curator");
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");

  const handleAdd = useCallback(async () => {
    if (!newEmail.trim()) return;
    setSaving(true);
    await fetch("/api/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newEmail.trim(),
        role: newRole,
        display_name: newName.trim() || null,
      }),
    });
    setNewEmail("");
    setNewName("");
    setSaving(false);
    router.refresh();
  }, [newEmail, newRole, newName, router]);

  const handleUpdateRole = useCallback(
    async (id: string, role: string) => {
      await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      setEditingId(null);
      router.refresh();
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Remove this team member?")) return;
      await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      router.refresh();
    },
    [router]
  );

  return (
    <div className="space-y-6">
      {/* Add member */}
      <div className="bg-white rounded-xl p-5 border border-warm-200">
        <h2 className="text-xs tracking-widest uppercase text-foreground-muted mb-4">
          Invite Team Member
        </h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Email address..."
            className="flex-1 min-w-[200px] px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
          />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Display name..."
            className="w-40 px-3 py-2 text-sm bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-navy/30"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="px-3 py-2 text-sm border border-warm-200 rounded-lg bg-white"
          >
            <option value="admin">Admin</option>
            <option value="curator">Curator</option>
            <option value="analyst">Analyst</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={saving || !newEmail.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-navy text-white hover:bg-navy-light transition-colors disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {/* Members list */}
      <div className="bg-white rounded-xl border border-warm-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-warm-100 text-left">
              <th className="px-5 py-3 text-xs tracking-widest uppercase text-foreground-muted font-medium">
                Name
              </th>
              <th className="px-5 py-3 text-xs tracking-widest uppercase text-foreground-muted font-medium">
                Email
              </th>
              <th className="px-5 py-3 text-xs tracking-widest uppercase text-foreground-muted font-medium">
                Role
              </th>
              <th className="px-5 py-3 text-xs tracking-widest uppercase text-foreground-muted font-medium">
                Added
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-warm-50 last:border-0">
                <td className="px-5 py-3 text-foreground">
                  {m.display_name || "—"}
                </td>
                <td className="px-5 py-3 text-foreground-muted">{m.email}</td>
                <td className="px-5 py-3">
                  {editingId === m.id ? (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      onBlur={() => handleUpdateRole(m.id, editRole)}
                      autoFocus
                      className="text-xs px-2 py-1 border border-warm-200 rounded bg-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="curator">Curator</option>
                      <option value="analyst">Analyst</option>
                    </select>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(m.id);
                        setEditRole(m.role);
                      }}
                      className="text-xs px-2.5 py-1 rounded-full bg-warm-100 text-foreground hover:bg-warm-200 transition-colors"
                    >
                      {m.role}
                    </button>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-foreground-muted">
                  {new Date(m.created_at).toLocaleDateString("en-NZ", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
