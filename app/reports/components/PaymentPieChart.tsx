"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#fbbf24"]; // cash, qr, credit

export default function PaymentPieChart({ data }: { data: any }) {
  const pieData = [
    { name: "Cash", value: data.cash },
    { name: "QR", value: data.qr },
    { name: "Credit", value: data.credit },
  ];

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mt-10">
      <h2 className="text-xl font-semibold mb-4">Payment Breakdown</h2>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

