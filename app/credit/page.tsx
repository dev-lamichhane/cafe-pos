"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { menuItems } from "@/data/menu";

function getItemName(id: number) {
  const item = menuItems.find((m) => m.id === id);
  return item ? item.name : `Item ${id}`;
}

export default function CreditCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentType, setPaymentType] = useState<string | null>(null);

  const router = useRouter();

  async function load() {
    const res = await fetch("/api/credit");
    const data = await res.json();
    setCustomers(data);
  }

  async function openModal(customer: any) {
    setSelectedCustomer(customer);
    setPaymentType(null);
    setModalOpen(true);
  }

  async function confirmPayment() {
    if (!paymentType || !selectedCustomer) {
      alert("Choose a payment type");
      return;
    }

    const items = JSON.parse(selectedCustomer.items_json);
    const payload = {
      id: selectedCustomer.id,
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
      itemsJson: JSON.stringify(items),
      amount: selectedCustomer.amount,
      paymentType,
    };

    console.log("Sending: ", payload);

    const res = await fetch("/api/credit/pay", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Pay result:", data);

    if (data.success) {
      setModalOpen(false);
      load();
    } else {
      alert("Payment failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 relative">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Credit Customers</h1>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-lg font-semibold"
        >
          ← Dashboard
        </button>
      </div>

      {/* LIST OF CUSTOMERS */}
      {customers.length === 0 ? (
        <p className="text-slate-400">No outstanding credit customers.</p>
      ) : (
        <div className="space-y-4">
          {customers.map((c: any) => {
            const items = JSON.parse(c.items_json);

            return (
              <div
                key={c.id}
                className="bg-slate-800 p-4 rounded-xl shadow-md flex justify-between"
              >
                <div>
                  <p className="text-lg font-semibold">{c.name}</p>
                  <p className="text-sm text-slate-400">{c.phone}</p>
                  <p className="mt-2 text-slate-300">
                    Owes: <span className="font-bold">Rs {c.amount}</span>
                  </p>

                  <details className="mt-2 text-sm text-slate-400">
                    <summary className="cursor-pointer">Items</summary>
                    <ul className="ml-4 mt-1 list-disc">
                      {items.map((it: any, idx: number) => (
                        <li key={idx}>
                          {getItemName(it.itemId)} × {it.qty}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>

                <button
                  onClick={() => openModal(c)}
                  className="bg-emerald-600 hover:bg-emerald-500 px-4 h-fit py-2 rounded-lg font-semibold"
                >
                  Mark Paid
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== MODAL ==================== */}
      {modalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>

            <p className="mb-2">
              <span className="text-slate-400">Customer:</span>{" "}
              {selectedCustomer.name}
            </p>
            <p className="mb-4">
              <span className="text-slate-400">Amount:</span>{" "}
              Rs {selectedCustomer.amount}
            </p>

            {/* ITEMS */}
            <div className="bg-slate-700/40 p-3 rounded-lg mb-4 max-h-40 overflow-y-auto">
              <p className="text-sm font-semibold mb-2 text-slate-300">
                Ordered Items:
              </p>

              <ul className="space-y-1 text-sm text-slate-300">
                {JSON.parse(selectedCustomer.items_json).map(
                  (it: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{getItemName(it.itemId)}</span>
                      <span>× {it.qty}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* PAYMENT TYPE */}
            <div className="flex gap-2 mb-4">
              {["cash", "qr"].map((type) => (
                <button
                  key={type}
                  onClick={() => setPaymentType(type)}
                  className={`px-4 py-2 rounded-lg font-semibold capitalize ${paymentType === type
                    ? "bg-emerald-600"
                    : "bg-slate-700 hover:bg-slate-600"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmPayment}
                className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==================== END MODAL ==================== */}
    </main>
  );
}

