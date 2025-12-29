"use client";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "search", label: "Search", icon: "🔎" },
  { key: "companies", label: "Companies", icon: "🏢" },
  { key: "contacts", label: "Contacts", icon: "👥" },
  { key: "calendar", label: "Calendar", icon: "🗓️" },
  { key: "docs", label: "Docs", icon: "📄" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

export { navItems };

export default function Sidebar() {
  return (
    <aside className="hidden md:block bg-emerald-700 text-white w-16 min-h-screen sticky top-0">
      <div className="grid gap-3 py-4">
        <div className="grid place-items-center h-12">
          <div className="h-10 w-10 rounded bg-emerald-600 grid place-items-center text-lg font-bold">L</div>
        </div>
        {navItems.map((n) => (
          <div key={n.key} className="grid place-items-center h-12" title={n.label}>
            <span className="opacity-90 select-none" aria-hidden>{n.icon}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
