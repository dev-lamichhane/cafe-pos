"use client";

export default function EndDayModal({
  open,
  onCancel,
  onConfirm,
  openTables,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  openTables: string[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md text-white shadow-xl">
        <h2 className="text-xl font-bold mb-4">Close Store?</h2>

        {openTables.length > 0 ? (
          <div className="mb-4 text-red-400">
            <p className="font-semibold mb-2">You still have open tables:</p>
            <ul className="list-disc list-inside">
              {openTables.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="mt-2">
              Please checkout or credit these tables before closing.
            </p>
          </div>
        ) : (
          <p className="mb-4 text-slate-300">
            All tables are settled. Are you sure you want to close the store for
            today?
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"
          >
            Cancel
          </button>

          <button
            disabled={openTables.length > 0}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-semibold ${openTables.length > 0
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500"
              }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

