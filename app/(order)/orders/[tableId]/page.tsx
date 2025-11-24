"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useOrderStore } from "@/store/orderStore";
import { menuItems } from "@/data/menu";

export default function OrderPage() {
  const params = useParams();
  const tableId = params.tableId as string;
  const router = useRouter();

  const orders = useOrderStore((s) => s.orders);
  const startOrder = useOrderStore((s) => s.startOrder);
  const addItem = useOrderStore((s) => s.addItem);
  const removeItem = useOrderStore((s) => s.removeItem);
  const clearTable = useOrderStore((s) => s.clearTable);

  const order = orders[tableId];
  const tableOrder = orders[tableId];

  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentType, setPaymentType] = useState("cash");
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

  const [creditName, setCreditName] = useState("");
  const [creditPhone, setCreditPhone] = useState("");

  async function handleConfirmPayment() {
    if (!tableOrder || !tableOrder.items || tableOrder.items.length === 0) {
      alert("No items to checkout.");
      return;
    }

    const total = getTotal();
    const finalTotal = getFinalTotal();

    // Validation for credit customer
    if (paymentType === "credit") {
      if (!creditName.trim() || !creditPhone.trim()) {
        alert("Please enter customer name and phone number.");
        return;
      }
    }

    // Prepare payload
    const payload = {
      tableId,
      items: tableOrder.items,
      total,
      discount: {
        amount: Number(discountAmount) || 0,
        percent: Number(discountPercent) || 0,
      },
      finalTotal,
      paymentType,
      creditInfo:
        paymentType === "credit"
          ? {
            name: creditName.trim(),
            phone: creditPhone.trim(),
          }
          : null,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Checkout failed. Please try again.");
        return;
      }

      // Clear the table from Zustand
      console.log("clearing table: ", tableId)
      clearTable(tableId);
      console.log("Orders after clear:", useOrderStore.getState().orders);

      // Reset modal fields
      setPaymentType("cash");
      setDiscountAmount("");
      setDiscountPercent("");
      setCreditName("");
      setCreditPhone("");

      setShowCheckout(false);

      // Redirect to tables
      router.push("/tables");
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An error occurred during checkout.");
    }
  }
  // Start order on first visit
  useEffect(() => {
    if (!orders[tableId]) {
      startOrder(tableId);
    }
  }, [tableId, orders, startOrder]);

  // Categories
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");

  // Total calculation
  function getTotal() {
    if (!tableOrder) return 0;

    return tableOrder.items.reduce((sum, item) => {
      const menu = menuItems.find((m) => m.id === item.itemId);
      const price = Number(menu?.price || 0);
      return sum + price * item.qty;
    }, 0);
  }

  function getFinalTotal() {
    const total = getTotal();
    const amt = Number(discountAmount) || 0;
    const pct = Number(discountPercent) || 0;

    let final = total;

    // If percent discount
    if (pct > 0) {
      final = final - (final * pct) / 100;
    }

    // If amount discount
    if (amt > 0) {
      final = final - amt;
    }

    if (final < 0) final = 0;

    return Math.round(final);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Table: {tableId}</h1>

      {/* MENU */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Menu</h2>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-4 pb-2 sticky top-0 bg-slate-900 py-2 z-20 shadow-md">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition 
    ${activeCategory === cat
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-slate-700 text-gray-300"
                }
  `}
            >
              {cat}
            </button>

          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {menuItems
            .filter((i) => i.category === activeCategory)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(tableId, item.id)}
                className="bg-slate-800 hover:bg-slate-700 p-4 rounded-xl text-left shadow-md active:scale-95 transition-transform"
              >
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-400 mt-1">Rs {item.price}</div>
              </button>

            ))}
        </div>
      </section>

      {/* ORDER SUMMARY */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Current Order</h2>

        {!tableOrder || tableOrder.items.length === 0 ? (
          <p className="text-gray-400">No items yet.</p>
        ) : (
          <div className="space-y-3">
            {tableOrder.items.map((i) => {
              const menu = menuItems.find((m) => m.id === i.itemId);

              return (
                <div
                  key={i.itemId}
                  className="flex justify-between items-center bg-slate-800 p-4 rounded-xl shadow-md"

                >
                  <span>
                    {menu?.name} x {i.qty}
                  </span>

                  <span className="flex gap-2">
                    <button
                      onClick={() => removeItem(tableId, i.itemId)}
                      className="w-9 h-9 flex items-center justify-center bg-red-600 hover:bg-red-500 rounded-full text-lg font-bold"
                    >
                      -
                    </button>

                    <button
                      onClick={() => addItem(tableId, i.itemId)}
                      className="w-9 h-9 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 rounded-full text-lg font-bold"
                    >
                      +
                    </button>

                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* TOTAL */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Total</h2>
        <div className="text-4xl font-extrabold tracking-wide">
          Rs {getTotal()}
        </div>
      </section>

      {/* FOOTER BUTTONS */}
      <div className="flex gap-4 mt-8 pb-4">
        <button
          onClick={() => router.push("/tables")}
          className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-lg font-semibold"
        >
          Back to Tables
        </button>

        <button
          onClick={() => setShowCheckout(true)}
          className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-lg font-semibold"
        >
          Checkout
        </button>
      </div>
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 w-full max-w-md rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>

            {/* Payment Type */}
            <div className="mb-4">
              <p className="text-lg mb-2 font-semibold">Payment Method</p>
              <div className="flex gap-3">
                {["cash", "qr", "credit"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPaymentType(p)}
                    className={`flex-1 px-4 py-3 rounded-lg text-lg font-semibold ${paymentType === p
                      ? "bg-emerald-600"
                      : "bg-slate-700 text-gray-300"
                      }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div className="mb-4">
              <p className="text-lg mb-2 font-semibold">Discount</p>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Amount (Rs)"
                  value={discountAmount}
                  onChange={(e) => {
                    setDiscountAmount(e.target.value);
                    if (e.target.value !== "") setDiscountPercent(""); // clear % if Rs is filled
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-700 outline-none"
                />
                <input
                  type="number"
                  placeholder="%"
                  value={discountPercent}
                  onChange={(e) => {
                    setDiscountPercent(e.target.value);
                    if (e.target.value !== "") setDiscountAmount(""); // clear Rs if % is filled
                  }}
                  className="w-20 px-3 py-2 rounded-lg bg-slate-700 outline-none"
                />
              </div>
            </div>

            {/* Credit info if needed */}
            {paymentType === "credit" && (
              <div className="mb-4">
                <p className="text-lg mb-2 font-semibold">Credit Customer Info</p>
                <input
                  type="text"
                  placeholder="Name"
                  value={creditName}
                  onChange={(e) => setCreditName(e.target.value)}
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-slate-700 outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={creditPhone}
                  onChange={(e) => setCreditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 outline-none"
                />
              </div>
            )}

            <div className="mb-4">
              <p className="text-lg font-semibold">Final Total:</p>
              <p className="text-3xl font-bold">Rs {getFinalTotal()}</p>
            </div>
            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button

                onClick={() => {
                  setShowCheckout(false);
                  setPaymentType("cash");
                  setDiscountAmount("");
                  setDiscountPercent("");
                  setCreditName("");
                  setCreditPhone("");
                }}
                className="flex-1 px-4 py-3 bg-slate-700 rounded-lg text-lg font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmPayment}
                className="flex-1 px-4 py-3 bg-emerald-600 rounded-lg text-lg font-semibold"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

