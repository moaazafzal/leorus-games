"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CareersCTA({
  title = "Ready to Level Up Your Career?",
  body = "Bring your spark. Join the crew redefining what mobile play can be.",
  cta = "Join the Team",
  link = "/contact",
  offer,
  first = false,
}: {
  title?: string;
  body?: string;
  cta?: string;
  link?: string;
  /** Optional price tag: a label above the title and the price above the button. */
  offer?: { label: string; price: string; was: string; period: string };
  /** Opening the page, so the floating navbar needs room above the title. */
  first?: boolean;
}) {
  return (
    <section
      className={`${first ? "pt-36 md:pt-44 pb-24 md:pb-32" : "py-24 md:py-32"} bg-accent text-white overflow-hidden relative`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-floaty-slow" />
        <div className="absolute -bottom-32 -right-24 w-[30rem] h-[30rem] rounded-full bg-ink/20 blur-3xl animate-floaty" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {offer && (
          <motion.p
            initial={{ opacity: 0, y: -10, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
            className="mb-6 inline-block rounded-full bg-white px-5 py-2 text-sm font-extrabold uppercase tracking-widest text-inverse shadow-lg"
          >
            {offer.label}
          </motion.p>
        )}
        <h2 className="display font-extrabold text-[clamp(2.4rem,6vw,5.5rem)]">
          <motion.span
            className="block overflow-hidden pb-[0.08em] -mb-[0.08em]"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={{ hidden: { y: "115%" }, shown: { y: 0 } }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {title}
            </motion.span>
          </motion.span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          className="mt-6 text-xl text-white/80 max-w-2xl mx-auto"
        >
          {body}
        </motion.p>
        {offer && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
            className="mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1"
          >
            <span className="text-2xl font-bold text-white/60 line-through">{offer.was}</span>
            <span className="display font-extrabold text-5xl md:text-6xl">{offer.price}</span>
            <span className="text-lg text-white/80">{offer.period}</span>
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 15 }}
          className="mt-10"
        >
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href={link}
              className="inline-block bg-white text-inverse font-bold px-10 py-4 rounded-full text-lg hover:bg-inverse hover:text-on-inverse transition-colors"
            >
              {cta}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
