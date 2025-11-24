"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyAdminPasswordAction } from "@/actions/loginAction";

export default function SplashScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const result = await verifyAdminPasswordAction(formData);

    if (result.success) {
      // 24-hour persistent session cookie
      document.cookie = "pos_session=active; path=/; SameSite=Strict; Max-Age=86400";


      // Store login time (we will use this later to detect next day)
      document.cookie = `pos_login_ts=${Date.now()}; path=/; SameSite:Strict: Max-Age=86400`

      // if alredy logged, go to the dashboard
      router.replace("/dashboard");
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setPassword("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center text-white px-4">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-slate-700/50">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/KundCoffeeLogo.png"
            alt="Logo why no work. Me so stupid"
            className="w-20 h-20 mb-3 opacity-90"
          />
          <h1 className="text-3xl font-extrabold tracking-wide">Kund Coffee</h1>
          <p className="text-slate-400 mt-1">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full bg-slate-700 px-4 py-3 rounded-xl text-lg outline-none
              focus:ring-2 focus:ring-emerald-500
              ${shake ? "animate-shake border border-red-500" : ""}
            `}
          />

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl text-lg font-semibold transition"
          >
            Enter Store
          </button>
        </form>
      </div>
    </main>
  );
}

