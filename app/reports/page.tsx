"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import BestSellerChart from "./components/BestSellerChart";
import BusyHoursChart from "./components/BusyHoursChart";
import PaymentPieChart from "./components/PaymentPieChart";
import ReportCard from "./components/ReportCard";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  async function loadRange() {
    if (!from || !to) return

    const res = await fetch(`/api/reports?from=${from}&to=${to}`)
    const d = await res.json()
    setData(d)
  }

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d) => {
        console.log("Report Data: ", d);
        setData(d);
      });
  }, []);

  if (!data)
    return (
      <main className="min-h-screen bg-slate-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Sales Reports</h1>
        <p>Loading…</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 max-w-6xl mx-auto">
      {/* To Dashboard */}
      <div className="flex justify-end mb-4">
        <Link
          href="/dashboard"
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-lg font-semibold"
        >
          Dashboard →
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Sales Reports</h1>

      {/* DATE PICKER */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">From</label>
          <input
            type="date"
            className="bg-slate-800 text-white p-2 rounded"
            onChange={(e) => setFrom(e.target.value)}
            value={from}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">To</label>
          <input
            type="date"
            className="bg-slate-800 text-white p-2 rounded"
            onChange={(e) => setTo(e.target.value)}
            value={to}
          />
        </div>

        <button
          onClick={loadRange}
          className="bg-emerald-600 hover:bg-emerald-500 px-4 rounded text-white font-semibold"
        >
          Apply
        </button>
      </div>
      {/* SUMMARY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <ReportCard title="Total Sales Today" value={`Rs ${data.totalSales}`} />
        <ReportCard title="Total Items Sold" value={data.totalItems} />
        <ReportCard title="Cash Payments" value={`Rs ${data.cash}`} />
        <ReportCard title="QR Payments" value={`Rs ${data.qr}`} />
        <ReportCard title="Credit Payments" value={`Rs ${data.credit}`} />
        <ReportCard title="Total Orders" value={data.todayCount} />
      </div>

      {/* ANALYTICS */}
      <h2 className="text-2xl font-semibold mt-12 mb-4 bg-gradient-to-r from-emerald-500/40 to-transparent py-1 pl-2 rounded">
        Analytics
      </h2>

      {/* TWO-COLUMN CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentPieChart data={data} />
        <BestSellerChart data={data.bestSellers} />
      </div>

      {/* FULL-WIDTH CHART */}
      <BusyHoursChart data={data.hourly} />

    </main>
  );
}

