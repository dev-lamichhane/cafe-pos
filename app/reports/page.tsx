"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import BestSellerChart from "./components/BestSellerChart";
import BusyHoursChart from "./components/BusyHoursChart";
import PaymentPieChart from "./components/PaymentPieChart";
import ReportCard from "./components/ReportCard";

export default function ReportsPage() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [data, setData] = useState<any>(null);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function fetchReports(range?: { from?: string; to?: string }) {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (range?.from) params.set("from", range.from);
      if (range?.to) params.set("to", range.to);

      const query = params.toString();
      const [reportsData, expensesData] = await Promise.all([
        fetch(`/api/reports${query ? `?${query}` : ""}`).then((res) =>
          res.json()
        ),
        fetch(`/api/expenses${query ? `?${query}` : ""}`).then((res) =>
          res.json()
        ),
      ]);

      if (reportsData.error) throw new Error(reportsData.error);
      if (expensesData.error) throw new Error(expensesData.error);

      setData(reportsData);
      setExpensesTotal(expensesData.total || 0);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    fetchReports({ from: today, to: today });
  }, [today]);

  function loadRange() {
    if (!from || !to) {
      alert("Please select both from and to dates");
      return;
    }
    fetchReports({ from, to });
  }

  if (!data)
    return (
      <main className="min-h-screen bg-slate-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Sales Reports</h1>
        {error ? <p className="text-red-400">{error}</p> : <p>Loading…</p>}
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
      <div className="flex flex-wrap gap-4 mb-6 items-end">
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

      {error && (
        <div className="mb-4 rounded-lg bg-red-600/20 border border-red-500 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {/* SUMMARY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <ReportCard
          title="Total Sales"
          value={`Rs ${Number(data.totalSales).toFixed(2)}`}
        />
        <ReportCard title="Total Items Sold" value={data.totalItems} />
        <ReportCard
          title="Cash Payments"
          value={`Rs ${Number(data.cash).toFixed(2)}`}
        />
        <ReportCard
          title="QR Payments"
          value={`Rs ${Number(data.qr).toFixed(2)}`}
        />
        <ReportCard
          title="Credit Payments"
          value={`Rs ${Number(data.credit).toFixed(2)}`}
        />
        <ReportCard title="Total Orders" value={data.todayCount} />
        <ReportCard
          title="Cash Expenses"
          value={`Rs ${expensesTotal.toFixed(2)}`}
        />
        <ReportCard
          title="Expected Till Cash"
          value={`Rs ${(Number(data.cash) - expensesTotal).toFixed(2)}`}
        />
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

