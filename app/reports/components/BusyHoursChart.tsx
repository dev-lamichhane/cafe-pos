"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BusyHoursChart({ data }: { data: any[] }) {
  const formatted = data.map((d) => ({
    hour: `${d.hour}:00`,
    count: d.count,
  }));

  return (
    <div className="bg-slate-800 p-4 rounded-xl mt-6">
      <h2 className="text-xl font-semibold mb-4">Busy Hours</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formatted}>
          <XAxis dataKey="hour" tick={{ fill: "#ccc", fontSize: 12 }} />
          <YAxis tick={{ fill: "#ccc", fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

