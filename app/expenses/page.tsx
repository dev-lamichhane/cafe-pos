"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Expense = {
  id: number;
  description: string;
  amount: number;
  timestamp: number;
};

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function ExpensesPage() {
  const today = useMemo(() => formatDateInput(new Date()), []);

  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchExpenses(range?: { from?: string; to?: string }) {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (range?.from) params.set("from", range.from);
      if (range?.to) params.set("to", range.to);

      const query = params.toString();
      const res = await fetch(`/api/expenses${query ? `?${query}` : ""}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load expenses");
      }

      setExpenses(data.expenses || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExpenses({ from: today, to: today });
  }, [today]);

  function openConfirmModal() {
    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      alert("Amount must be a positive number");
      return;
    }

    setConfirmOpen(true);
  }

  async function handleSaveExpense() {
    try {
      setLoading(true);
      setError(null);
      setConfirmOpen(false);

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save expense");
      }

      setAmount("");
      setDescription("");
      fetchExpenses({ from, to });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteExpense(id: number) {
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete expense");
      }

      fetchExpenses({ from, to });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleApplyRange() {
    if (!from || !to) {
      alert("Please select both from and to dates");
      return;
    }
    fetchExpenses({ from, to });
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Link
          href="/dashboard"
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-lg font-semibold"
        >
          Dashboard →
        </Link>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-600/20 border border-red-500 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Date filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">From</label>
          <input
            type="date"
            className="bg-slate-800 text-white p-2 rounded"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">To</label>
          <input
            type="date"
            className="bg-slate-800 text-white p-2 rounded"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <button
          onClick={handleApplyRange}
          className="self-end bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded font-semibold"
        >
          Apply
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-sm text-gray-400">Total Expenses</p>
          <p className="text-3xl font-bold mt-2">Rs {total.toFixed(2)}</p>
        </div>
      </div>

      {/* Add expense form */}
      <section className="bg-slate-800 rounded-xl p-5 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount (Rs)"
            className="flex-1 bg-slate-900 rounded-lg p-3 outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="flex-1 bg-slate-900 rounded-lg p-3 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={openConfirmModal}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-3 rounded-lg font-semibold"
          >
            Save
          </button>
        </div>
      </section>

      {/* Expenses list */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Entries</h2>
          {loading && <span className="text-sm text-gray-400">Loading…</span>}
        </div>
        {expenses.length === 0 ? (
          <p className="text-gray-400">No expenses for this range.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 uppercase tracking-wide text-xs bg-slate-800/70">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Amount (Rs)</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-t border-slate-700/60 text-sm"
                  >
                    <td className="px-4 py-3">{expense.description}</td>
                    <td className="px-4 py-3 font-semibold">
                      Rs {expense.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(expense.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-400 hover:text-red-300 text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Expense</h3>
            <p className="mb-2">
              <span className="text-gray-400">Amount:</span> Rs{" "}
              {Number(amount).toFixed(2)}
            </p>
            <p className="mb-4">
              <span className="text-gray-400">Description:</span>{" "}
              {description.trim()}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExpense}
                className="px-4 py-2 bg-emerald-600 rounded-lg font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

