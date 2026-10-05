"use client";

import { useState } from "react";
import { FALLBACK_INBOX, FALLBACK_SOURCE, relay } from "@/lib/relay";

export type AuditFormContent = {
  email?: string;
  source?: string;
  button?: string;
  successTitle?: string;
  successBody?: string;
};

// The ranges are coarse on purpose: enough to tell a live game with a budget
// from a weekend project, without asking anyone to open their dashboards.
const PLATFORMS = ["Android", "iOS", "Both"];
const DAU = ["Under 100", "100 to 1,000", "1,000 to 10,000", "Over 10,000", "Not sure"];
const REVENUE = ["Nothing yet", "Under $1,000", "$1,000 to $10,000", "Over $10,000", "Prefer not to say"];
const BUDGET = ["No budget yet", "Under $1,000", "$1,000 to $5,000", "Over $5,000", "Not sure"];

const FIELD =
  "mt-2 w-full rounded-xl border border-ink/15 bg-surface px-4 py-3 outline-none focus:border-accent";

function Choice({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink/70">{label}</span>
      {/* Starts blank, so a skipped question arrives empty rather than as
          the first answer, which would make every lead look like a tiny game. */}
      <select name={name} defaultValue="" className={FIELD}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function AuditForm({ content = {} }: { content?: AuditFormContent }) {
  const inbox = (content.email || "").trim() || FALLBACK_INBOX;
  const source = (content.source || "").trim() || FALLBACK_SOURCE;
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    const fields = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      // "UA lead" in the subject keeps audit requests apart from general mail.
      await relay({ inbox, source, subject: "UA lead: free game audit request", fields });
      setSent(true);
    } catch {
      setError(`Could not send just now. Please email ${inbox} directly.`);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-inverse text-on-inverse p-10 min-h-[420px] flex flex-col items-center justify-center text-center">
        <p className="text-3xl font-extrabold display">{content.successTitle ?? "Audit request received."}</p>
        <p className="mt-4 text-white/60">
          {content.successBody ?? "We'll look at your game and reply soon."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-ink/10 bg-surface p-6 md:p-8 space-y-5">
      {/* Honeypot: people leave it empty, bots fill it in and get dropped. */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Name</span>
          <input required name="name" type="text" placeholder="Your name" className={FIELD} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Email</span>
          <input required name="email" type="email" placeholder="you@studio.com" className={FIELD} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-ink/70">Game link</span>
        <input
          required
          name="game link"
          type="url"
          placeholder="https://play.google.com/store/apps/details?id=..."
          className={FIELD}
        />
      </label>
      <div className="grid sm:grid-cols-2 gap-5">
        <Choice label="Platform" name="platform" options={PLATFORMS} />
        <Choice label="Daily active users" name="daily active users" options={DAU} />
        <Choice label="Monthly revenue" name="monthly revenue" options={REVENUE} />
        <Choice label="Monthly ad budget" name="monthly ad budget" options={BUDGET} />
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-ink/70">
          What's happening with the game? <span className="font-normal text-ink/40">(optional)</span>
        </span>
        <textarea
          name="message"
          rows={3}
          placeholder="Downloads dropped after launch, never ran ads, revenue is flat..."
          className={`${FIELD} resize-none`}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm font-medium text-rose-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-ink text-paper font-bold py-4 rounded-xl hover:bg-accent hover:text-white transition-colors disabled:opacity-60 disabled:hover:bg-ink"
      >
        {sending ? "Sending..." : content.button ?? "Request my free audit"}
      </button>
    </form>
  );
}
