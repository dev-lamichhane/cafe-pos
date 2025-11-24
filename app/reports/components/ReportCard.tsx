import { ReactNode } from "react";

export default function ReportCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl transition">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{title}</p>
        {icon && <div className="text-emerald-400">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

