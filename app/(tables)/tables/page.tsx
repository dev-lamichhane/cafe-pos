"use client";

import Link from "next/link";
import { tables } from "@/data/tables";
import { useOrderStore } from "@/store/orderStore";
import { menuItems } from "@/data/menu";
import { useState, useEffect } from "react";

export default function TablesPage() {
  const orders = useOrderStore((s) => s.orders);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update time every minute to refresh the timeSpent display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  function calculateTotal(tableId: string) {
    const order = orders[tableId];
    if (!order) return 0;

    return order.items.reduce((sum, i) => {
      const menu = menuItems.find((m) => m.id === i.itemId);
      const price = Number(menu?.price || 0);
      return sum + price * i.qty;
    }, 0);
  }

  function timeSpent(tableId: string) {
    const order = orders[tableId];
    if (!order) return null;

    const minutes = Math.floor((currentTime - order.createdAt) / 60000);

    if (minutes < 60) return `${minutes} min`;

    const hrs = Math.floor(minutes / 60);
    const remain = minutes % 60;

    return `${hrs}h ${remain}m`;
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">

      {/* To Dashboard */}
      <div className="flex justify-end mb-4">
        <Link
          href="/dashboard"
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-lg font-semibold"
        >
          Dashboard →
        </Link>
      </div>

      {/* Tables */}
      <h1 className="text-2xl font-bold mb-6">Tables</h1>

      {["Inside", "Outside", "Co-Working", "Pickup"].map((area) => {
        const areaTables = tables.filter((t) => t.area === area);

        return (
          <section key={area} className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{area}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {areaTables.map((table) => {
                const order = orders[table.id]
                const isActive = order && order.items && order.items.length > 0;
                const total = calculateTotal(table.id);
                const since = timeSpent(table.id);

                return (
                  <Link
                    key={table.id}
                    href={`/orders/${table.id}`}
                    className={`p-6 rounded-xl text-center text-lg font-semibold shadow-lg transition
                      ${isActive ? "bg-green-700" : "bg-slate-800 hover:bg-slate-700"}
                    `}
                  >
                    {table.name}

                    {isActive && (
                      <div className="mt-2 text-sm text-gray-200">
                        <div>Total: Rs {total}</div>
                        <div>Time: {since}</div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}

