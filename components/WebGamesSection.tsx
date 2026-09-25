"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { accent } from "@/lib/accent";

export type WebGame = {
  title: string;
  genre: string;
  cover: string;
  url: string;
};

export type WebGamesContent = {
  title: string;
  body: string;
  items: WebGame[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Cover({ src, alt, featured }: { src: string; alt: string; featured?: boolean }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div className="absolute inset-0 bg-sunken" />;
  return (
    <Image
      src={src}
      alt={alt}
      width={960}
      height={540}
      onError={() => setErr(true)}
      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105${featured ? " object-[50%_15%]" : ""}`}
    />
  );
}

export default function WebGamesSection({ content }: { content: WebGamesContent }) {
  const items = (content.items ?? []).filter((g) => g && g.title);
  if (items.length === 0) return null;
  // With an odd number of games, the first one spans both columns so the grid stays even.
  const featured = (i: number) => i === 0 && items.length % 2 === 1;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
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
                {accent(content.title)}
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

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-12 grid sm:grid-cols-2 gap-5"
        >
          {items.map((g, i) => (
            <motion.a
              key={`${g.title}-${i}`}
              href={g.url || "#"}
              target={g.url ? "_blank" : undefined}
              rel={g.url ? "noreferrer noopener" : undefined}
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 110, damping: 17 },
                },
              }}
              whileHover={{ y: -6 }}
              className={`${featured(i) ? "sm:col-span-2 " : ""}group block rounded-3xl overflow-hidden bg-surface border border-ink/[0.06] shadow-[0_2px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_44px_rgba(184,84,26,0.12)] transition-shadow duration-300`}
            >
              <div className={`relative aspect-video overflow-hidden bg-sunken${featured(i) ? " sm:aspect-[21/9]" : ""}`}>
                <Cover src={g.cover} alt={g.title} featured={featured(i)} />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink/45">
                    {g.genre}
                  </p>
                  <h3 className="mt-1 text-lg font-bold truncate">{g.title}</h3>
                </div>
                <span className="shrink-0 rounded-full border border-ink/20 px-5 py-2 text-xs font-bold uppercase tracking-wider group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-colors">
                  Play
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
