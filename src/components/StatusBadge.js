const colors = {
  Open: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Lost: "bg-rose-50 text-rose-700 ring-rose-200",
  Sold: "bg-blue-50 text-blue-700 ring-blue-200",
  Stalled: "bg-amber-50 text-amber-800 ring-amber-200",
};

export default function StatusBadge({ status }) {
  const cls = colors[status] || "bg-zinc-100 text-zinc-700 ring-zinc-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ${cls}`}>
      {status}
    </span>
  );
}
