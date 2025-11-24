"use client";

import { useRouter } from "next/navigation";
import { useOrderStore } from "@/store/orderStore";
import { useState } from "react";
import EndDayModal from "./components/EndDayModal";
import { logoutAction } from "@/actions/logoutAction";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const [endDayOpen, setEndDayOpen] = useState(false);

  const orders = useOrderStore((s) => s.orders);
  const openTables = Object.entries(orders)
    .filter(([_, o]) => o.items.length > 0)
    .map(([id]) => id);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">

      {/* LOGO + HEADER */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/KundCoffeeLogo.png"
          alt="Kund Coffee Logo"
          width={120}
          height={120}
          className="mb-4 opacity-100"
        />
        <h1 className="text-4xl font-bold">Kund Coffee POS</h1>
        <p className="text-slate-400 mt-2 text-center">
          Manage orders, credit customers, and daily reports.
        </p>
      </div>

      {/* MAIN ACTION GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">

        {/* TABLES */}
        <button
          onClick={() => router.push("/tables")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-left shadow-lg transition flex flex-col"
        >
          <span className="text-2xl font-semibold mb-2">Tables</span>
          <span className="text-slate-400 text-sm">
            Open table list & take orders.
          </span>
        </button>

        {/* REPORTS */}
        <button
          onClick={() => router.push("/reports")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-left shadow-lg transition flex flex-col"
        >
          <span className="text-2xl font-semibold mb-2">Reports</span>
          <span className="text-slate-400 text-sm">
            View sales charts & daily analytics.
          </span>
        </button>

        {/* CREDIT CUSTOMERS */}
        <button
          onClick={() => router.push("/credit")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-left shadow-lg transition flex flex-col"
        >
          <span className="text-2xl font-semibold mb-2">Credit Customers</span>
          <span className="text-slate-400 text-sm">
            Manage unpaid customer bills.
          </span>
        </button>

        {/* EXPENSES */}
        <button
          onClick={() => router.push("/expenses")}
          className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 text-left shadow-lg transition flex flex-col"
        >
          <span className="text-2xl font-semibold mb-2">Expenses</span>
          <span className="text-slate-400 text-sm">
            Log daily purchases & corrections.
          </span>
        </button>

        {/* END DAY */}
        <button
          onClick={() => setEndDayOpen(true)}
          className="bg-red-600 hover:bg-red-500 rounded-xl p-6 text-left shadow-lg transition flex flex-col"
        >
          <span className="text-2xl font-semibold mb-2">End Day / Logout</span>
          <span className="text-red-200 text-sm">
            Generate PDF, email manager, close session.
          </span>
        </button>

      </div>

      {/* END DAY MODAL */}
      <EndDayModal
        open={endDayOpen}
        openTables={openTables}
        onCancel={() => setEndDayOpen(false)}
        onConfirm={async () => {
          const freshOrders = useOrderStore.getState().orders;
          const stillOpen = Object.entries(freshOrders)
            .filter(([_, o]) => o.items.length > 0)
            .map(([id]) => id);

          if (stillOpen.length > 0) {
            alert(
              `Cannot close store. These tables are open: ${stillOpen.join(", ")}`
            );
            return;
          }

          // Open PDF in new tab (auto-email as well)
          window.open("/api/end-day-report", "_blank");

          await logoutAction();
          document.cookie = "pos_session=; path=/; max-age=0; SameSite=Strict";

          setEndDayOpen(false);
          router.push("/");
        }}
      />
    </main>
  );
}

