"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { accent } from "@/lib/accent";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Comma separated strings are how the dashboard edits short lists. */
function list(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export type ServicesContent = {
  title: string;
  intro: string;
  pillars: { name: string; body: string; points: string[] | string }[];
  stackTitle: string;
  stack: { group: string; items: string[] | string }[];
  whyTitle: string;
  why: { name: string; body: string }[];
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
};

function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.65, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Heading({ text }: { text: string }) {
  return (
    <h2 className="display font-extrabold text-[clamp(2rem,4.5vw,3.4rem)] text-center">
      <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
        <motion.span
          className="inline-block will-change-transform"
          initial={{ y: "115%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {accent(text)}
        </motion.span>
      </span>
    </h2>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4 mt-0.5 shrink-0 text-accent" aria-hidden="true">
      <path
        d="M4 10.5l4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ServicePillars({ content }: { content: ServicesContent }) {
  return (
    <section className="py-4 md:py-8">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {(content.pillars ?? []).map((p, i) => (
            <Rise key={p.name} delay={i * 0.08}>
              <article className="h-full rounded-3xl bg-surface border border-ink/[0.06] p-7 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_44px_rgba(0,153,255,0.12)] hover:-translate-y-1 transition-[box-shadow,transform] duration-300">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-accent/10 text-accent font-extrabold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl md:text-2xl font-extrabold">{p.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{p.body}</p>
                <ul className="mt-6 space-y-2.5 border-t border-ink/[0.06] pt-5">
                  {list(p.points).map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm text-ink/70">
                      <Tick />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceStack({ content }: { content: ServicesContent }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <Heading text={content.stackTitle} />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {(content.stack ?? []).map((s, i) => (
            <Rise key={s.group} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-sunken p-7">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/45">
                  {s.group}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {list(s.items).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-surface border border-ink/[0.06] px-3.5 py-1.5 text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceWhy({ content }: { content: ServicesContent }) {
  return (
    <section className="py-4 md:py-8">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <Heading text={content.whyTitle} />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {(content.why ?? []).map((w, i) => (
            <Rise key={w.name} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-ink/10 p-7">
                <h3 className="text-lg font-extrabold">{w.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{w.body}</p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceCta({ content }: { content: ServicesContent }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
        <Rise>
          <div className="rounded-[2.5rem] bg-accent text-white px-7 py-12 md:px-14 md:py-16 text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <h2 className="display font-extrabold text-[clamp(1.8rem,4vw,3rem)]">
                {content.ctaTitle}
              </h2>
              <p className="mt-4 mx-auto max-w-xl text-sm md:text-base text-white/80">
                {content.ctaBody}
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-full bg-white text-inverse font-bold px-9 py-4 hover:bg-inverse hover:text-on-inverse transition-colors"
              >
                {content.ctaLabel}
              </Link>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
