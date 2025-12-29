"use client";

import { useState } from "react";
import { navItems } from "@/components/Sidebar";

export default function Topbar({ onNew }) {
  const [open, setOpen] = useState(false);

  const handleNewClick = () => {
    if (typeof onNew === "function") onNew();
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center gap-3 px-4 h-14">
          <button className="md:hidden rounded p-2 hover:bg-emerald-50" aria-label="Open navigation" onClick={() => setOpen(true)}>☰</button>
          <div className="flex-1">
            <input type="text" placeholder="Search for anything" className="w-full max-w-xl rounded-lg border bg-zinc-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button type="button" onClick={handleNewClick} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700">New / Add</button>
          <div className="w-8 h-8 rounded-full bg-zinc-200" />
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 md:hidden" aria-modal="true" role="dialog">
          <button aria-label="Close navigation" className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl border-r p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded bg-emerald-600 text-white grid place-items-center text-lg font-bold">L</div>
              <button className="rounded p-2 hover:bg-zinc-100" onClick={() => setOpen(false)}>✕</button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((n) => (
                <button key={n.key} className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700" onClick={() => setOpen(false)}>
                  <span className="text-xl" aria-hidden>{n.icon}</span>
                  <span className="text-sm font-medium">{n.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-auto grid gap-2">
              <button type="button" onClick={() => { setOpen(false); handleNewClick(); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700">New / Add</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
