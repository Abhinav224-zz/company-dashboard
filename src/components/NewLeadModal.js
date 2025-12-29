"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export default function NewLeadModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    status: "Open",
    amount: "",
    stage: "Proposal",
    stagePercent: 60,
    nextActivityDate: "",
    saleDate: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!form.name?.trim()) throw new Error("Sale name is required");
      if (form.amount === "" || isNaN(Number(form.amount))) throw new Error("Amount must be a number");
      if (!form.stage?.trim()) throw new Error("Stage is required");
      if (!form.saleDate) throw new Error("Sale date is required");
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          saleDate: new Date(form.saleDate).toISOString(),
          nextActivityDate: form.nextActivityDate ? new Date(form.nextActivityDate).toISOString() : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.details || json.error || "Failed to create");
      if (typeof onCreated === "function") onCreated(json.data);
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Create lead error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return typeof window !== "undefined"
    ? createPortal(
        <div className="fixed inset-0 z-[1000] bg-black/30 grid place-items-center p-4">
          <form noValidate onSubmit={submit} className="w-full max-w-lg bg-white rounded-xl border shadow-lg p-4 grid gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add New Lead / Sale</h3>
              <button type="button" onClick={onClose} className="rounded p-2 hover:bg-zinc-100">✕</button>
            </div>
            {error && <div className="text-sm text-rose-600">{error}</div>}
            <label className="grid gap-1">
              <span className="text-sm text-zinc-600">Sale Name</span>
              <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="rounded border px-3 py-2" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-zinc-600">Status</span>
                <select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})} className="rounded border px-3 py-2">
                  <option>Open</option>
                  <option>Lost</option>
                  <option>Sold</option>
                  <option>Stalled</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-zinc-600">Amount</span>
                <input type="number" min="0" value={form.amount} onChange={(e)=>setForm({...form,amount:e.target.value})} className="rounded border px-3 py-2" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-zinc-600">Stage</span>
                <input value={form.stage} onChange={(e)=>setForm({...form,stage:e.target.value})} className="rounded border px-3 py-2" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-zinc-600">Stage %</span>
                <input type="number" min="0" max="100" value={form.stagePercent} onChange={(e)=>setForm({...form,stagePercent:Number(e.target.value)})} className="rounded border px-3 py-2" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-zinc-600">Sale Date</span>
                <input type="date" value={form.saleDate} onChange={(e)=>setForm({...form,saleDate:e.target.value})} className="rounded border px-3 py-2" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-zinc-600">Next Activity Date</span>
                <input type="date" value={form.nextActivityDate} onChange={(e)=>setForm({...form,nextActivityDate:e.target.value})} className="rounded border px-3 py-2" />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="rounded border px-3 py-2">Cancel</button>
              <button type="submit" disabled={loading} className="rounded bg-emerald-600 text-white px-3 py-2 disabled:opacity-50">{loading?"Saving...":"Save"}</button>
            </div>
          </form>
        </div>,
        document.body
      )
    : null;
}
