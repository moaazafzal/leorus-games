"use client";

import { motion } from "framer-motion";
import { accent } from "@/lib/accent";
import { CHANNEL_ICONS } from "@/lib/channelIcons";
import { Heading, list } from "./ServicesSections";
import AuditForm, { type AuditFormContent } from "./AuditForm";
import type { HeroContent } from "./Hero";

// The landing page is built from the site's own sections (Hero, Reviews,
// Careers); the ones below are new, and each copies the look of a section the
// site already has: the About values cards, the grey Partner panels and the
// hero stat tiles. Copy is kept to a line or two per item on purpose.

const EASE = [0.22, 1, 0.36, 1] as const;

type Items = string[] | string;

export type GrowthContent = {
  seoTitle: string;
  seoDescription: string;
  hero: HeroContent & { ctaLabel: string };
  channelsTitle: string;
  channelsBody: string;
  channels: { name: string; icon?: string; iconOnly?: boolean }[];
  servicesTitle: string;
  services: { title: string; body: string }[];
  stepsTitle: string;
  steps: { title: string; body: string }[];
  equationLeft: string;
  equationRight: string;
  reviewsTitle: string;
  reviewsBody: string;
  pricing: {
    title: string;
    name: string;
    price: string;
    period: string;
    body: string;
    includesTitle: string;
    includes: Items;
    adSpendNote: string;
  };
  closing: { title: string; body: string; cta: string };
  audit: { title: string; intro: string; form: AuditFormContent };
};

/** Every button on the page lands on the audit form. */
export const AUDIT = "#audit";

function Rise({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">{children}</div>
    </section>
  );
}

/** Centred title and grey line, as above Reviews and Studios on the home page. */
function SectionHead({ title, body }: { title: string; body?: string }) {
  return (
    <div className="text-center">
      <Heading text={title} />
      {body && <p className="mt-4 mx-auto max-w-xl text-sm text-ink/50">{body}</p>}
    </div>
  );
}

/** A grid of grey channel marks with hairline rules between the tiles. */
export function GrowthChannels({ content }: { content: GrowthContent }) {
  return (
    <Section>
      <SectionHead title={content.channelsTitle} body={content.channelsBody} />
      <Rise className="mt-12 grid grid-cols-3 lg:grid-cols-6 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10">
        {(content.channels ?? []).map((c) => {
          const path = c.icon ? CHANNEL_ICONS[c.icon] : undefined;
          return (
            <div
              key={c.name}
              className="flex h-20 sm:h-24 md:h-28 flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 bg-surface px-2 sm:px-3 text-ink/50 hover:text-ink transition-colors"
            >
              {path && (
                <svg viewBox="0 0 24 24" className={`${c.iconOnly ? "w-7 h-7 md:w-9 md:h-9" : "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"} shrink-0`} fill="currentColor" aria-hidden="true">
                  <path d={path} />
                </svg>
              )}
              {/* A mark that is the name itself (X) shows alone; the name stays for screen readers. */}
              <span
                className={
                  c.iconOnly && path
                    ? "sr-only"
                    : "whitespace-nowrap text-xs sm:text-base md:text-xl font-bold tracking-tight"
                }
              >
                {c.name}
              </span>
            </div>
          );
        })}
      </Rise>
    </Section>
  );
}

/** Six short numbered cards, the About page's values at a smaller size. */
export function GrowthServices({ content }: { content: GrowthContent }) {
  return (
    <Section>
      <SectionHead title={content.servicesTitle} />
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(content.services ?? []).map((s, i) => (
          <Rise key={s.title} className="rounded-3xl border border-ink/10 bg-surface p-7">
            <span className="text-3xl font-extrabold display text-accent-ink">0{i + 1}</span>
            <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-ink/60">{s.body}</p>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

/** The six steps in one grey panel, closed by the equation they all serve. */
export function GrowthSteps({ content }: { content: GrowthContent }) {
  return (
    <Section>
      <SectionHead title={content.stepsTitle} />
      <Rise className="mt-12 rounded-3xl bg-sunken p-7 md:p-10">
        <ol className="grid sm:grid-cols-2 lg:grid-cols-6 gap-7 lg:gap-5">
          {(content.steps ?? []).map((s, i) => (
            <li key={s.title}>
              <span className="text-sm font-bold text-accent-ink">0{i + 1}</span>
              <p className="mt-1 text-lg font-bold">{s.title}</p>
              <p className="mt-1 text-sm text-ink/60">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 border-t border-ink/10 pt-8 text-center display font-extrabold text-[clamp(1.4rem,2.6vw,2.1rem)]">
          {content.equationLeft} <span className="text-accent-ink" aria-label="greater than">&gt;</span>{" "}
          {content.equationRight}
        </p>
      </Rise>
    </Section>
  );
}

/** One grey panel, the same ground as the intro block of the Partner section. */
export function GrowthPricing({ content }: { content: GrowthContent }) {
  const p = content.pricing;
  if (!p) return null;
  const items = list(p.includes);
  return (
    <Section>
      <SectionHead title={p.title} />
      <Rise className="mt-12 rounded-3xl bg-sunken p-8 md:p-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
        <div>
          <h3 className="display font-extrabold text-[clamp(1.8rem,3.5vw,2.8rem)]">{p.name}</h3>
          <p className="mt-6 flex items-baseline gap-3 flex-wrap">
            <span className="display font-extrabold text-6xl md:text-7xl text-accent-ink">{p.price}</span>
            <span className="text-ink/50 font-medium">{p.period}</span>
          </p>
          <p className="mt-6 max-w-md text-ink/60">{p.body}</p>
          <p className="mt-4 font-semibold">{p.adSpendNote}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink/50">{p.includesTitle}</p>
          <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 border-t border-ink/10 sm:border-t-0">
            {items.map((item, i) => (
              <li key={item} className={`border-b border-ink/10 py-3 text-ink/80 ${i < 2 ? "sm:border-t" : ""}`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Rise>
    </Section>
  );
}

/** Laid out like the Contact page: big title and address on the left, form on the right. */
export function GrowthAudit({
  content,
  email,
  source,
}: {
  content: GrowthContent;
  email: string;
  source: string;
}) {
  const a = content.audit;
  return (
    <section id="audit" className="scroll-mt-28 mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-24 grid lg:grid-cols-2 gap-16">
      <div>
        <h2 className="display font-extrabold text-[clamp(2.8rem,8vw,6.5rem)]">{accent(a.title)}</h2>
        <p className="mt-8 max-w-md text-lg text-ink/60">{a.intro}</p>
        <a href={`mailto:${email}`} className="mt-10 block text-2xl font-bold hover:text-accent-ink transition-colors">
          {email}
        </a>
      </div>
      <AuditForm content={{ ...a.form, email, source }} />
    </section>
  );
}
