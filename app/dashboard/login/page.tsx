"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl bg-white border border-black/10 shadow-xl p-8"
      >
        <p className="text-2xl font-extrabold tracking-tight">
          LEORUS<span className="text-accent">.</span>{" "}
          <span className="font-semibold text-black/40 text-lg">Dashboard</span>
        </p>
        <label className="block mt-6">
          <span className="text-sm font-semibold text-black/60">Email</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-2.5 outline-none focus:border-accent"
          />
        </label>
        <label className="block mt-4">
          <span className="text-sm font-semibold text-black/60">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/15 px-4 py-2.5 outline-none focus:border-accent"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-black text-white font-bold py-3 hover:bg-accent transition-colors disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
