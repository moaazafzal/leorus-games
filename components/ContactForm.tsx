"use client";

import { useState } from "react";

export type ContactFormContent = {
  topics?: string[] | string;
  /** Where the relay delivers. Comes from contact.email in the content file. */
  email?: string;
  /** Which studio's site the message came from. Comes from the site's brand. */
  source?: string;
  button?: string;
  successTitle?: string;
  successBody?: string;
};

function normalizeTopics(topics: string[] | string | undefined): string[] {
  if (Array.isArray(topics)) return topics;
  const list = String(topics ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return list.length ? list : ["Publish my game", "Partner on an IP", "Careers", "Something else"];
}

// The site is a static export with no server of its own, so the form posts to
// FormSubmit, which relays the message on. The first submission to a given
// address triggers a one-off confirmation mail there; until that link is
// clicked, FormSubmit delivers nothing.
const FALLBACK_INBOX = "leorusgames@gmail.com";
const FALLBACK_SOURCE = "Leorus Games";

// Everyone who receives every enquiry. The Aqua Games and Leorus Games sites
// carry the same list. FormSubmit relays to the single address in its
// endpoint, so the rest are copied in; the endpoint address is dropped from
// the copies so nobody receives a message twice. Only the endpoint address
// needs the one-off confirmation click; the copied ones just receive.
const TEAM_INBOXES = [
  "io.aquagames@gmail.com",
  "leorusgames@gmail.com",
  "moaazafzal@gmail.com",
  "husainisadiq@gmail.com",
  "hamzaayoubofficial@gmail.com",
];

export default function ContactForm({ content = {} }: { content?: ContactFormContent }) {
  const inbox = (content.email || "").trim() || FALLBACK_INBOX;
  const source = (content.source || "").trim() || FALLBACK_SOURCE;
  const endpoint = `https://formsubmit.co/ajax/${inbox}`;
  const copies = TEAM_INBOXES.filter((a) => a.toLowerCase() !== inbox.toLowerCase());
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const topics = normalizeTopics(content.topics);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    const fields = Object.fromEntries(new FormData(e.currentTarget).entries());
    // The same five inboxes get messages from both studio sites, so every
    // message says where it came from: first row of the email, and the exact
    // page it was sent from as the last.
    const data = {
      "Received from": `${source} website`,
      ...fields,
      "Sent from page": window.location.href,
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Relay answered ${res.status}`);
      setSent(true);
    } catch {
      // Never show the success panel for a message that did not get through;
      // point the visitor at the plain address instead.
      setError(`Could not send just now. Please email ${inbox} directly.`);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-inverse text-on-inverse p-10 flex flex-col items-center justify-center text-center">
        <p className="text-3xl font-extrabold display">{content.successTitle ?? "Message received."}</p>
        <p className="mt-4 text-white/60">
          {content.successBody ?? "Thanks for reaching out. We'll reply soon."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-ink/10 bg-surface p-8 space-y-5">
      <input type="hidden" name="_subject" value={`[${source} website] New contact message`} />
      <input type="hidden" name="_cc" value={copies.join(",")} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      {/* Honeypot: people leave it empty, bots fill it in and get dropped. */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Name</span>
          <input
            required
            name="name"
            type="text"
            placeholder="Your name"
            className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink/70">Email</span>
          <input
            required
            name="email"
            type="email"
            placeholder="you@company.com"
            className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-semibold text-ink/70">Topic</span>
        <select
          name="topic"
          className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 outline-none focus:border-accent bg-surface"
        >
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-ink/70">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Tell us about your project..."
          className="mt-2 w-full rounded-xl border border-ink/15 px-4 py-3 outline-none focus:border-accent resize-none"
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
        className="w-full bg-ink text-paper font-bold py-4 rounded-xl hover:bg-accent transition-colors disabled:opacity-60 disabled:hover:bg-ink"
      >
        {sending ? "Sending..." : content.button ?? "Send Message"}
      </button>
    </form>
  );
}
