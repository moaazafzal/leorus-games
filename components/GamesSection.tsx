"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { accent } from "@/lib/accent";

export type Game = { title: string; genre: string; icon: string; gradient: string };
export type GamesSectionContent = {
  titleLines: string[];
  body: string;
  chips: string[] | string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function normalizeChips(chips: string[] | string): string[] {
  if (Array.isArray(chips)) return chips;
  return String(chips).split(",").map((s) => s.trim()).filter(Boolean);
}

function Tile({ src }: { src: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white/10 shrink-0">
      {!err && src && (
        <Image
          src={src}
          alt=""
          width={200}
          height={200}
          onError={() => setErr(true)}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

/* Slow, seamless vertical loop of icons */
function IconColumn({
  icons,
  duration,
  reverse,
}: {
  icons: string[];
  duration: number;
  reverse?: boolean;
}) {
  if (icons.length === 0) return null;
  const doubled = [...icons, ...icons];
  return (
    <div className="relative h-[26rem] overflow-hidden">
      <div
        className={reverse ? "animate-scroll-y-reverse" : "animate-scroll-y"}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex flex-col gap-3 pb-3">
          {doubled.map((src, i) => (
            <Tile key={i} src={src} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MarqueeSide({
  icons,
  mirror,
  className,
}: {
  icons: string[];
  mirror?: boolean;
  className?: string;
}) {
  const cols = [
    icons.filter((_, i) => i % 3 === 0),
    icons.filter((_, i) => i % 3 === 1),
    icons.filter((_, i) => i % 3 === 2),
  ];
  const durations = mirror ? [72, 55, 64] : [64, 55, 72];
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="grid grid-cols-3 gap-3 max-w-xs">
        {cols.map((col, i) => (
          <IconColumn
            key={i}
            icons={col.length ? col : icons}
            duration={durations[i]}
            reverse={i === 1}
          />
        ))}
      </div>
      {/* fade masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#222222] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#222222] to-transparent" />
    </div>
  );
}

export default function GamesSection({
  content,
  games,
}: {
  content: GamesSectionContent;
  games: Game[];
}) {
  const icons = games.map((g) => g.icon).filter(Boolean);
  const chips = normalizeChips(content.chips);
  const half = Math.ceil(chips.length / 2);

  return (
    <section className="px-4 md:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto max-w-[1400px] bg-[#222222] text-white rounded-[2.5rem] px-6 py-16 md:py-24 overflow-hidden"
      >
        <div className="grid lg:grid-cols-[1fr_auto_1fr] items-center gap-10">
          <MarqueeSide icons={icons} className="hidden lg:block justify-self-end" />

          <div className="text-center max-w-md mx-auto">
            <h2 className="display font-extrabold text-[clamp(2rem,4.5vw,3.4rem)]">
              {content.titleLines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                  <motion.span
                    className="inline-block will-change-transform"
                    initial={{ y: "115%" }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.75, ease: EASE }}
                  >
                    {accent(line)}
                  </motion.span>
                </span>
              ))}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
              className="mt-5 text-white/50"
            >
              {content.body}
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05, delayChildren: 0.45 } },
              }}
              className="mt-7 space-y-2.5"
            >
              {[chips.slice(0, half), chips.slice(half)].map((row, ri) => (
                <div key={ri} className="flex flex-wrap justify-center gap-2.5">
                  {row.map((t) => (
                    <motion.span
                      key={t}
                      variants={{
                        hidden: { opacity: 0, scale: 0.5, y: 10 },
                        show: {
                          opacity: 1, scale: 1, y: 0,
                          transition: { type: "spring", stiffness: 300, damping: 15 },
                        },
                      }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(0,153,255,0.25)" }}
                      className="px-4 py-1.5 rounded-full border border-white/25 text-white/80 text-xs font-semibold uppercase tracking-wider cursor-default"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <MarqueeSide icons={[...icons].reverse()} mirror className="hidden lg:block justify-self-start" />
        </div>

        {/* Mobile: slow horizontal marquee */}
        <div className="lg:hidden mt-10 relative overflow-hidden">
          <div className="animate-scroll-x w-max">
            <div className="flex gap-3 pr-3">
              {[...icons, ...icons].map((src, i) => (
                <div key={i} className="w-20">
                  <Tile src={src} />
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#222222] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#222222] to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
