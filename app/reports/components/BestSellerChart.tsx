"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { menuItems } from "@/data/menu";

export default function BestSellerChart({ data }: { data: any[] }) {
  const formatted = data.map((b) => ({
    name: menuItems.find((m) => m.id === b.itemId)?.name || `Item ${b.itemId}`,
    qty: b.qty,
  }));

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mt-10">
      <h2 className="text-xl font-semibold mb-4">Best Selling Items</h2>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <BarChart data={formatted}>
            <XAxis dataKey="name" tick={{ fill: "#ccc", fontSize: 12 }} />
            <YAxis tick={{ fill: "#ccc", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="qty" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

