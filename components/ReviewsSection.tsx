"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export type ReviewsContent = {
  title: string;
  body: string;
  perPage?: number;
  items: { quote: string; name: string; role: string; rating: number }[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

const AVATAR_COLORS = [
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function initials(name: string): string {
  const words = name.split(" ").filter(Boolean);
  // Single-word handles (a Fiverr username) have no second word to take a
  // letter from, so fall back to the first two characters of the handle.
  const letters =
    words.length > 1
      ? words.map((w) => w[0]).slice(0, 2)
      : [...(words[0] ?? "").slice(0, 2)];
  return letters.join("").toUpperCase();
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-4 h-4 ${i < count ? "fill-current" : "fill-ink/10"}`}
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.8l-5.3 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Arrow({ left }: { left?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-5 h-5 ${left ? "rotate-180" : ""}`} fill="none">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ReviewsSection({ content }: { content: ReviewsContent }) {
  const PER_PAGE = Math.min(6, Math.max(1, content.perPage ?? 3));
  const pageCount = Math.max(1, Math.ceil(content.items.length / PER_PAGE));
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (delta: number) => {
    setDir(delta);
    setPage((p) => (p + delta + pageCount) % pageCount);
  };

  const shown = content.items.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="text-center">
          <h2 className="display font-extrabold text-[clamp(2rem,4.5vw,3.4rem)]">
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: "115%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, ease: EASE }}
              >
                {content.title}
              </motion.span>
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="mt-4 mx-auto max-w-xl text-sm text-ink/50"
          >
            {content.body}
          </motion.p>
        </div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-12"
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={page}
              custom={dir}
              initial={{ opacity: 0, x: dir * 90 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -90 }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
              className="grid md:grid-cols-3 gap-5 auto-rows-fr"
            >
              {shown.map((r, i) => (
                <figure
                  key={`${page}-${i}`}
                  className="h-full flex flex-col rounded-3xl bg-surface border border-ink/[0.06] p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,153,255,0.10)] hover:-translate-y-1 transition-[box-shadow,transform] duration-300"
                >
                  <Stars count={Math.max(0, Math.min(5, r.rating))} />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/75">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-ink/[0.06] flex items-center gap-3">
                    <span
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        AVATAR_COLORS[(page * PER_PAGE + i) % AVATAR_COLORS.length]
                      }`}
                    >
                      {initials(r.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold truncate">{r.name}</span>
                      <span className="block text-xs text-ink/45 truncate">{r.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {pageCount > 1 && (
            <div className="mt-10 flex items-center justify-center gap-5">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => go(-1)}
                aria-label="Previous reviews"
                className="w-12 h-12 rounded-full border border-ink/15 flex items-center justify-center text-ink/60 hover:bg-ink hover:text-paper hover:border-ink transition-colors"
              >
                <Arrow left />
              </motion.button>
              <p className="text-sm font-semibold text-ink/50 tabular-nums min-w-14 text-center">
                {page + 1} / {pageCount}
              </p>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => go(1)}
                aria-label="Next reviews"
                className="w-12 h-12 rounded-full border border-ink/15 flex items-center justify-center text-ink/60 hover:bg-ink hover:text-paper hover:border-ink transition-colors"
              >
                <Arrow />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
