"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CareersCTA({
  title = "Ready to Level Up Your Career?",
  body = "Bring your spark. Join the crew redefining what mobile play can be.",
  cta = "Join the Team",
  link = "/contact",
}: {
  title?: string;
  body?: string;
  cta?: string;
  link?: string;
}) {
  return (
    <section className="py-24 md:py-32 bg-accent text-white overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-floaty-slow" />
        <div className="absolute -bottom-32 -right-24 w-[30rem] h-[30rem] rounded-full bg-ink/20 blur-3xl animate-floaty" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <h2 className="display font-extrabold text-[clamp(2.4rem,6vw,5.5rem)]">
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "115%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {title}
            </motion.span>
          </span>
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
