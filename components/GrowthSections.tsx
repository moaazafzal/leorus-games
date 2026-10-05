"use client";

import { motion } from "framer-motion";
import { accent } from "@/lib/accent";
import { Heading, list } from "./ServicesSections";
import AuditForm, { type AuditFormContent } from "./AuditForm";
import type { HeroContent } from "./Hero";
import type { PartnerContent } from "./PartnerSection";
import type { GamesSectionContent } from "./GamesSection";

// The landing page is built from the site's own sections (Hero, Partner,
// Games, Reviews); only the three below are new, and each copies the look of
// a section the site already has.

const EASE = [0.22, 1, 0.36, 1] as const;

export type GrowthContent = {
  seoTitle: string;
  seoDescription: string;
  hero: HeroContent & { ctaLabel: string };
  problem: PartnerContent;
  servicesTitle: string;
  servicesBody: string;
  services: { title: string; body: string }[];
  loop: GamesSectionContent;
  reviewsTitle: string;
  reviewsBody: string;
  pricing: {
    name: string;
    from: string;
    price: string;
    period: string;
    body: string;
    includesTitle: string;
    includes: string[] | string;
    adSpendNote: string;
    customNote: string;
  };
  audit: { title: string; intro: string; form: AuditFormContent };
};

/** Every button on the page lands on the audit form. */
export const AUDIT = "#audit";

/** Numbered cards, the same as the values on the About page. */
export function GrowthServices({ content }: { content: GrowthContent }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 text-center">
        <Heading text={content.servicesTitle} />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          className="mt-4 mx-auto max-w-xl text-sm text-ink/50"
        >
          {content.servicesBody}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid md:grid-cols-2 gap-6 text-left"
        >
          {(content.services ?? []).map((s, i) => (
            <motion.div
              key={s.title}
              variants={{
                hidden: { opacity: 0, y: 50 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="rounded-3xl border border-ink/10 bg-surface p-8"
            >
              <span className="text-4xl font-extrabold display text-accent-ink">0{i + 1}</span>
              <h3 className="mt-5 text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 text-ink/60">{s.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** One grey panel, the same ground as the intro block of the Partner section. */
export function GrowthPricing({ content }: { content: GrowthContent }) {
  const p = content.pricing;
  if (!p) return null;
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-3xl bg-sunken p-8 md:p-12 grid lg:grid-cols-2 gap-10 lg:gap-16"
        >
          <div>
            <h2 className="display font-extrabold text-[clamp(1.8rem,3.5vw,2.8rem)]">{p.name}</h2>
            <p className="mt-6 flex items-baseline gap-3 flex-wrap">
              <span className="text-ink/50 font-medium">{p.from}</span>
              <span className="display font-extrabold text-6xl md:text-7xl text-accent-ink">{p.price}</span>
              <span className="text-ink/50 font-medium">{p.period}</span>
            </p>
            <p className="mt-6 max-w-md text-ink/60">{p.body}</p>
            <p className="mt-4 max-w-md font-semibold">{p.adSpendNote}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink/50">{p.includesTitle}</p>
            <ul className="mt-3 border-t border-ink/10">
              {list(p.includes).map((item) => (
                <li key={item} className="border-b border-ink/10 py-3.5 text-ink/80">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink/50">{p.customNote}</p>
          </div>
        </motion.div>
      </div>
    </section>
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
