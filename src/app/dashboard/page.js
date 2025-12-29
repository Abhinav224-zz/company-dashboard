"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatusBadge from "@/components/StatusBadge";
import NewLeadModal from "@/components/NewLeadModal";

const TABS = ["Company", "Activities", "Contacts", "Sales", "Requests"];

function CompanyCard() {
  return (
    <section className="bg-white rounded-xl border p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-emerald-100 grid place-items-center text-emerald-700 text-xl font-semibold">S</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">SuperCompany Ltd ASA</h2>
            <button className="text-amber-500" title="Favorite">★</button>
          </div>
          <p className="text-sm text-zinc-500">Department Stockholm</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border px-2.5 py-1.5 text-sm hover:bg-zinc-50">Edit</button>
          <button className="rounded-lg border px-2.5 py-1.5 text-sm hover:bg-zinc-50">More</button>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {TABS.map((t) => (
          <span key={t} className="rounded-full border px-3 py-1 text-sm text-zinc-700 bg-zinc-50">{t}</span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
        <div><span className="text-zinc-500">Postal:</span> Västgötagatan 5, 102 61 Stock..</div>
        <div><span className="text-zinc-500">Category:</span> Customer A</div>
        <div><span className="text-zinc-500">Country:</span> Sweden</div>
        <div><span className="text-zinc-500">Code:</span> SUPERCO</div>
        <div><span className="text-zinc-500">Phone:</span> +46 800 193 2820</div>
        <div><span className="text-zinc-500">Number:</span> 2002</div>
        <div><span className="text-zinc-500">Web:</span> www.sc.se</div>
        <div><span className="text-zinc-500">VAT No.:</span> SE123456789</div>
        <div><span className="text-zinc-500">E-mail:</span> info@sc.se</div>
        <div><span className="text-zinc-500">Business:</span> IT</div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
        <label className="inline-flex items-center gap-2"><input type="checkbox" className="rounded"/> Stop</label>
        <label className="inline-flex items-center gap-2"><input type="checkbox" className="rounded"/> No mailings</label>
        <span className="ml-auto">Updated: 18/09/2023 OG</span>
      </div>
    </section>
  );
}

function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-zinc-600">Page {page} of {totalPages} • {total} total</div>
      <div className="flex items-center gap-2">
        <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={page<=1} onClick={()=>onPageChange(page-1)}>Prev</button>
        <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={page>=totalPages} onClick={()=>onPageChange(page+1)}>Next</button>
      </div>
    </div>
  );
}

function LeadsTable({ items }) {
  return (
    <div className="overflow-auto border rounded-xl bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="text-left p-3 w-28">Status</th>
            <th className="text-left p-3 w-36">Sale date</th>
            <th className="text-right p-3 w-32">Amount</th>
            <th className="text-left p-3 w-48">Stage</th>
            <th className="text-left p-3 w-40">Next activity</th>
            <th className="text-left p-3">Sale name</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row) => (
            <tr key={row._id} className="border-t hover:bg-zinc-50">
              <td className="p-3"><StatusBadge status={row.status} /></td>
              <td className="p-3">{row.saleDate ? new Date(row.saleDate).toLocaleDateString() : "-"}</td>
              <td className="p-3 text-right">{row.amount?.toLocaleString(undefined,{maximumFractionDigits:0})}</td>
              <td className="p-3">{row.stage} {row.stagePercent ? `(${row.stagePercent}%)` : null}</td>
              <td className="p-3">{row.nextActivityDate ? new Date(row.nextActivityDate).toLocaleDateString() : "-"}</td>
              <td className="p-3">{row.name}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td className="p-6 text-center text-zinc-500" colSpan={6}>No records</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Sales");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  async function fetchRows({ signal } = {}) {
    setLoading(true);
    setListError("");
    try {
      const res = await fetch(`/api/leads?page=${page}&pageSize=${pageSize}`, { cache: "no-store", signal });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.details || json?.error || `Failed to load (status ${res.status})`);
      setRows(json.data || []);
      setTotal(json.total || 0);
    } catch (e) {
      if (e.name !== "AbortError") setListError(e?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    if (activeTab === "Sales") fetchRows({ signal: controller.signal });
    return () => controller.abort();
  }, [page, pageSize, activeTab]);

  // Modal opens directly via Topbar onNew callback

  const onCreated = (item) => {
    // Optimistic add
    setRows((prev) => [item, ...prev].slice(0, pageSize));
    setTotal((t) => t + 1);
    // Refetch to ensure server truth/order
    fetchRows();
  };

  return (
    <div className="min-h-screen bg-zinc-100 grid" style={{gridTemplateColumns:"auto 1fr"}}>
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Topbar onNew={() => setModalOpen(true)} />
        <main className="p-4 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            <CompanyCard />

            <section className="bg-white rounded-xl border shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  {TABS.map((t) => (
                    <button key={t} onClick={()=>setActiveTab(t)} className={`px-3 py-1.5 rounded-lg text-sm ${activeTab===t?"bg-emerald-600 text-white":"hover:bg-zinc-100"}`}>{t}</button>
                  ))}
                </div>
                {activeTab === "Sales" && (
                  <div className="flex items-center gap-2">
                    <button onClick={()=> setModalOpen(true)} className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-sm">Add</button>
                    <button className="rounded-lg border px-3 py-1.5 text-sm">Delete</button>
                    <button className="rounded-lg border px-3 py-1.5 text-sm">Filter</button>
                    <button className="rounded-lg border px-3 py-1.5 text-sm">Export</button>
                  </div>
                )}
              </div>

              <div className="p-4">
                {activeTab !== "Sales" ? (
                  <div className="text-zinc-500 text-sm">This is the {activeTab} tab.</div>
                ) : (
                  <>
                    {listError ? (
                      <div className="text-sm text-rose-600 p-6">{listError}</div>
                    ) : loading ? (
                      <div className="text-sm text-zinc-500 p-6">Loading...</div>
                    ) : (
                      <LeadsTable items={rows} />
                    )}
                    <div className="pt-3">
                      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>

          <aside className="hidden lg:block bg-white rounded-xl border shadow-sm p-4 h-fit">
            <div className="text-sm text-zinc-500">Preview</div>
            <div className="mt-2 font-medium">45 Components - RTS</div>
            <div className="text-sm text-zinc-600">17 344 EUR</div>
            <div className="mt-4 text-sm text-zinc-600 grid gap-1">
              <div>Company: SuperCompany Ltd ASA</div>
              <div>Owner: Eric Davies</div>
              <div>Status: Open (20%)</div>
            </div>
            <div className="mt-6 text-sm">
              <div className="font-medium mb-1">Activities</div>
              <ul className="list-disc ml-5 text-zinc-600">
                <li>Follow-up call</li>
                <li>Prospect meeting</li>
                <li>Introduction call</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>

      <NewLeadModal open={modalOpen} onClose={()=>setModalOpen(false)} onCreated={onCreated} />
    </div>
  );
}
