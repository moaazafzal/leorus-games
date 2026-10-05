"use client";

import { motion } from "framer-motion";
import { accent, lines } from "@/lib/accent";
import { Heading, list } from "./ServicesSections";
import AuditForm, { type AuditFormContent } from "./AuditForm";
import type { HeroContent } from "./Hero";

// The landing page is built from the site's own sections (Hero, Reviews,
// Careers); the ones below are new, and each copies the look of a section the
// site already has: the About values cards, the grey Partner panels, the hero
// stat tiles and the tags on the Services page.

const EASE = [0.22, 1, 0.36, 1] as const;

type Items = string[] | string;

/** A block of copy with an optional tagged list, used by services, platforms and steps. */
type Block = {
  title: string;
  body?: string[];
  listTitle?: string;
  items?: Items;
  after?: string[];
  note?: string;
};

export type GrowthContent = {
  seoTitle: string;
  seoDescription: string;
  hero: HeroContent & { ctaLabel: string };
  intro: { title: string; titleMuted: string; paragraphs: string[]; objective: string };
  servicesTitle: string;
  servicesBody: string;
  services: Block[];
  platformsTitle: string;
  platformsBody: string;
  platforms: Block[];
  loop: {
    title: string;
    body: string;
    steps: Items;
    principleTitle: string;
    principle: string[];
    note: string;
  };
  metricsTitle: string;
  metricsBody: string;
  metrics: { abbr: string; label: string }[];
  metricsNote: string;
  deadGame: { title: string; body: string[]; note: string; listTitle: string; items: Items };
  revival: { title: string; body: string; funnel: Items; items: Items; note: string };
  stepsTitle: string;
  steps: Block[];
  equationTitle: string;
  equationLeft: string;
  equationRight: string;
  equationNote: string;
  reviewsTitle: string;
  reviewsBody: string;
  pricing: {
    title: string;
    name: string;
    from?: string;
    price: string;
    period: string;
    body: string;
    includesTitle: string;
    includes: Items;
    adSpendNote: string;
    customNote: string;
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

/** Centred title and grey line, as above Reviews and Studios on the home page. */
function SectionHead({ title, body }: { title: string; body?: string }) {
  return (
    <div className="text-center">
      <Heading text={title} />
      {body && <p className="mt-4 mx-auto max-w-xl text-sm text-ink/50">{body}</p>}
    </div>
  );
}

/** The rounded tags from the Services page; `ground` is the surface they sit on. */
function Tags({ items, ground }: { items: Items | undefined; ground: "surface" | "sunken" }) {
  const tone = ground === "surface" ? "bg-sunken" : "bg-surface border border-ink/[0.06]";
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {list(items).map((item) => (
        <span key={item} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${tone}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

/** Tags joined by arrows, for a sequence such as the growth loop. */
function Sequence({ items, ground }: { items: Items; ground: "surface" | "sunken" }) {
  const tone = ground === "surface" ? "bg-sunken" : "bg-surface border border-ink/[0.06]";
  const all = list(items);
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2.5">
      {all.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tone}`}>{step}</span>
          {i < all.length - 1 && <span className="text-ink/30" aria-hidden="true">→</span>}
        </span>
      ))}
    </div>
  );
}

/** Plain ruled list, the same as the pricing list. */
function Ruled({ items, columns = 1 }: { items: Items; columns?: 1 | 2 }) {
  const all = list(items);
  return (
    <ul className={`mt-3 grid gap-x-8 ${columns === 2 ? "sm:grid-cols-2 border-t border-ink/10 sm:border-t-0" : "border-t border-ink/10"}`}>
      {all.map((item, i) => (
        <li
          key={item}
          className={`border-b border-ink/10 py-3 text-ink/80 ${columns === 2 && i < 2 ? "sm:border-t" : ""}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Paragraphs({ items, className = "" }: { items?: string[]; className?: string }) {
  if (!items?.length) return null;
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">{children}</div>
    </section>
  );
}

/** Big two-tone statement, the same as the top of the About page. */
export function GrowthIntro({ content }: { content: GrowthContent }) {
  const c = content.intro;
  const paras = c.paragraphs ?? [];
  return (
    <Section>
      <Rise>
        <h2 className="display font-extrabold text-[clamp(2.4rem,6vw,5.2rem)]">
          {c.title}
          <br />
          <span className="text-ink/40">{c.titleMuted}</span>
        </h2>
      </Rise>
      <div className="mt-12 grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <Rise>
          <Paragraphs items={paras.slice(0, -1)} className="text-lg text-ink/60 !space-y-5" />
        </Rise>
        <Rise className="rounded-3xl bg-sunken p-8 md:p-10">
          <p className="text-lg text-ink/60">{paras[paras.length - 1]}</p>
          <p className="mt-4 display font-extrabold text-[clamp(1.8rem,3.4vw,2.8rem)] text-accent-ink">
            {c.objective}
          </p>
        </Rise>
      </div>
    </Section>
  );
}

/** One wide card per service: the About page's numbered card, with its list beside it. */
export function GrowthServices({ content }: { content: GrowthContent }) {
  return (
    <Section>
      <SectionHead title={content.servicesTitle} body={content.servicesBody} />
      <div className="mt-12 space-y-6">
        {(content.services ?? []).map((s, i) => {
          const side = Boolean(s.items || s.after || s.note);
          return (
            <Rise key={s.title}>
              <article
                className={`rounded-3xl border border-ink/10 bg-surface p-8 md:p-10 ${
                  side ? "grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14" : ""
                }`}
              >
                <div>
                  <span className="text-4xl font-extrabold display text-accent-ink">0{i + 1}</span>
                  <h3 className="mt-5 text-2xl md:text-3xl font-bold">{s.title}</h3>
                  <Paragraphs items={s.body} className={`mt-4 text-ink/60 ${side ? "" : "max-w-3xl"}`} />
                </div>
                {side && (
                  <div className="lg:pt-2">
                    {s.listTitle && <p className="text-sm font-semibold text-ink/50">{s.listTitle}</p>}
                    {s.items && <Tags items={s.items} ground="surface" />}
                    <Paragraphs items={s.after} className="mt-6 text-ink/60" />
                    {s.note && <p className="mt-4 font-semibold">{s.note}</p>}
                  </div>
                )}
              </article>
            </Rise>
          );
        })}
      </div>
    </Section>
  );
}

/** Two grey panels, the ground of the Partner section. */
export function GrowthPlatforms({ content }: { content: GrowthContent }) {
  return (
    <Section>
      <SectionHead title={content.platformsTitle} body={content.platformsBody} />
      <div className="mt-12 grid lg:grid-cols-2 gap-6">
        {(content.platforms ?? []).map((p) => (
          <Rise key={p.title} className="rounded-3xl bg-sunken p-8 md:p-10">
            <h3 className="display font-extrabold text-[clamp(1.8rem,3vw,2.4rem)]">{p.title}</h3>
            <Paragraphs items={p.body} className="mt-5 text-ink/60" />
            {p.listTitle && <p className="mt-6 text-sm font-semibold text-ink/50">{p.listTitle}</p>}
            <Tags items={p.items} ground="sunken" />
            <Paragraphs items={p.after} className="mt-6 font-semibold" />
          </Rise>
        ))}
      </div>
    </Section>
  );
}

/** The growth loop in one grey panel: the steps on the left, the principle on the right. */
export function GrowthLoop({ content }: { content: GrowthContent }) {
  const c = content.loop;
  return (
    <Section>
      <Rise className="rounded-3xl bg-sunken p-8 md:p-12 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h2 className="display font-extrabold text-[clamp(1.8rem,3.5vw,2.8rem)]">{accent(c.title)}</h2>
          <p className="mt-6 text-ink/60">{c.body}</p>
          <Sequence items={c.steps} ground="sunken" />
          <p className="mt-8 font-semibold">{c.note}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink/50">{c.principleTitle}</p>
          <Ruled items={c.principle} />
        </div>
      </Rise>
    </Section>
  );
}

/** Metric tiles, the same grey tiles as the stats under the home hero. */
export function GrowthMetrics({ content }: { content: GrowthContent }) {
  return (
    <Section>
      <SectionHead title={content.metricsTitle} body={content.metricsBody} />
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="mt-12 flex flex-wrap justify-center gap-4"
      >
        {(content.metrics ?? []).map((m) => (
          <motion.div
            key={m.abbr}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
            className="w-[calc(50%-0.5rem)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] rounded-2xl bg-sunken px-4 py-6 text-center"
          >
            <p className="text-2xl md:text-3xl font-extrabold display">{m.abbr}</p>
            <p className="mt-1 text-sm text-ink/50">{m.label}</p>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-10 mx-auto max-w-2xl text-center text-ink/60">{content.metricsNote}</p>
    </Section>
  );
}

/** Grey statement panel beside a plain checklist, then the revival funnel below. */
export function GrowthDeadGame({ content }: { content: GrowthContent }) {
  const c = content.deadGame;
  const r = content.revival;
  return (
    <Section>
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <Rise className="rounded-3xl bg-sunken p-8 md:p-10">
          <h2 className="display font-extrabold text-[clamp(1.8rem,3.5vw,2.8rem)]">{lines(c.title)}</h2>
          <Paragraphs items={c.body} className="mt-8 text-ink/60" />
          <p className="mt-6 font-semibold">{c.note}</p>
        </Rise>
        <Rise className="rounded-3xl border border-ink/10 bg-surface p-8 md:p-10">
          <p className="text-sm font-semibold text-ink/50">{c.listTitle}</p>
          <Ruled items={c.items} columns={2} />
        </Rise>
      </div>
      <Rise className="mt-6 rounded-3xl border border-ink/10 bg-surface p-8 md:p-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14">
        <div>
          <h3 className="display font-extrabold text-[clamp(1.6rem,3vw,2.4rem)]">{r.title}</h3>
          <p className="mt-5 text-ink/60">{r.body}</p>
          <Sequence items={r.funnel} ground="surface" />
          <p className="mt-8 font-semibold">{r.note}</p>
        </div>
        <Ruled items={r.items} />
      </Rise>
    </Section>
  );
}

/** Six numbered About-style cards, then the equation the whole page rests on. */
export function GrowthSteps({ content }: { content: GrowthContent }) {
  return (
    <Section>
      <SectionHead title={content.stepsTitle} />
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(content.steps ?? []).map((s, i) => (
          <Rise key={s.title} className="rounded-3xl border border-ink/10 bg-surface p-8">
            <span className="text-4xl font-extrabold display text-accent-ink">0{i + 1}</span>
            <h3 className="mt-5 text-2xl font-bold">{s.title}</h3>
            <Paragraphs items={s.body} className="mt-3 text-ink/60" />
            {s.items && <Tags items={s.items} ground="surface" />}
          </Rise>
        ))}
      </div>
      <Rise className="mt-6 rounded-3xl bg-sunken p-8 md:p-12 text-center">
        <p className="text-sm font-semibold text-ink/50">{content.equationTitle}</p>
        <p className="mt-4 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5 display font-extrabold text-[clamp(1.6rem,3.4vw,2.8rem)]">
          <span>{content.equationLeft}</span>
          <span className="text-accent-ink" aria-label="greater than">&gt;</span>
          <span>{content.equationRight}</span>
        </p>
        <p className="mt-5 mx-auto max-w-xl text-ink/60">{content.equationNote}</p>
      </Rise>
    </Section>
  );
}

/** One grey panel, the same ground as the intro block of the Partner section. */
export function GrowthPricing({ content }: { content: GrowthContent }) {
  const p = content.pricing;
  if (!p) return null;
  return (
    <Section>
      <SectionHead title={p.title} />
      <Rise className="mt-12 rounded-3xl bg-sunken p-8 md:p-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
        <div>
          <h3 className="display font-extrabold text-[clamp(1.8rem,3.5vw,2.8rem)]">{p.name}</h3>
          <p className="mt-6 flex items-baseline gap-3 flex-wrap">
            {p.from && <span className="text-ink/50 font-medium">{p.from}</span>}
            <span className="display font-extrabold text-6xl md:text-7xl text-accent-ink">{p.price}</span>
            <span className="text-ink/50 font-medium">{p.period}</span>
          </p>
          <p className="mt-6 max-w-md text-ink/60">{p.body}</p>
          <p className="mt-4 max-w-md font-semibold">{p.adSpendNote}</p>
          <p className="mt-6 text-sm text-ink/50">{p.customNote}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink/50">{p.includesTitle}</p>
          <Ruled items={p.includes} columns={2} />
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
