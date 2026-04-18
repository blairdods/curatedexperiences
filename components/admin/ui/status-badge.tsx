const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  nurturing: "bg-amber-50 text-amber-700",
  proposal_sent: "bg-purple-50 text-purple-700",
  deposit: "bg-emerald-50 text-emerald-700",
  confirmed: "bg-green-50 text-green-700",
  closed_won: "bg-green-100 text-green-800",
  closed_lost: "bg-gray-100 text-gray-500",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-green-100 text-green-800",
  active: "bg-green-50 text-green-700",
  pending_approval: "bg-amber-50 text-amber-700",
  archived: "bg-gray-100 text-gray-500",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full ${
        STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
