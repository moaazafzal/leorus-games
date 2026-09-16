"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Game } from "@/components/GamesSection";

export type ShowcaseGame = Game & {
  downloads?: string;
  description?: string;
  playUrl?: string;
  appUrl?: string;
  screen?: string;
};

function hasUrl(url: string | undefined): boolean {
  return typeof url === "string" && url.trim() !== "";
}

const ITEM = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 140, damping: 16 },
  },
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M5 3.9v16.2c0 .6.7 1 1.2.7l13.4-8.1c.5-.3.5-1 0-1.3L6.2 3.2c-.5-.3-1.2.1-1.2.7z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M16.4 12.9c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.6 0-3.1 1-4 2.4-1.7 2.9-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.7-3.7zM14 5.6c.7-.8 1.1-1.9 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z" />
    </svg>
  );
}

/* CSS phone mockup showing the game art */
function Phone({ game, tilt }: { game: ShowcaseGame; tilt: number }) {
  const [err, setErr] = useState(false);
  const media = (game.screen ?? "").trim() || game.icon;
  const isGif = media.toLowerCase().endsWith(".gif");
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 70, damping: 16 }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      className="relative w-56 md:w-64 aspect-[9/19] rounded-[2.6rem] bg-[#1a1a1a] p-2.5 shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
    >
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#0e0e0e] animate-floaty-slow">
        {media && !err ? (
          <Image
            src={media}
            alt={game.title}
            fill
            sizes="256px"
            unoptimized={isGif}
            onError={() => setErr(true)}
            className="object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient}`} />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute bottom-4 left-4 right-4 text-white font-extrabold display text-xl drop-shadow">
          {game.title}
        </p>
      </div>
      {/* notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-b-2xl" />
    </motion.div>
  );
}

function StoreButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      href={href || "#"}
      target={href && href !== "#" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-ink hover:text-paper hover:border-ink transition-colors"
    >
      {icon}
      {label}
    </motion.a>
  );
}

function IconThumb({ game }: { game: ShowcaseGame }) {
  const [err, setErr] = useState(false);
  if (!game.icon || err) {
    return <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.gradient} shrink-0`} />;
  }
  return (
    <Image
      src={game.icon}
      alt=""
      width={112}
      height={112}
      onError={() => setErr(true)}
      className="w-14 h-14 rounded-xl object-cover shrink-0"
    />
  );
}

export default function GamesShowcase({ games }: { games: ShowcaseGame[] }) {
  return (
    <div className="space-y-6">
      {games.map((g, i) => {
        const reversed = i % 2 === 1;
        return (
          <motion.article
            key={`${g.title}-${i}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[2.5rem] bg-sunken px-8 md:px-16 py-14 md:py-20"
          >
            <div
              className={`flex flex-col ${
                reversed ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-12 lg:gap-20`}
            >
              {/* Phone */}
              <div className="shrink-0 lg:w-1/2 flex justify-center">
                <Phone game={g} tilt={reversed ? 6 : -6} />
              </div>

              {/* Details */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
                className="lg:w-1/2 max-w-md"
              >
                <motion.div variants={ITEM} className="flex items-center gap-4">
                  <IconThumb game={g} />
                  <div>
                    {g.downloads && (
                      <p className="text-sm text-ink/50">{g.downloads} Downloads</p>
                    )}
                    <h2 className="text-2xl md:text-3xl font-extrabold display">{g.title}</h2>
                  </div>
                </motion.div>

                <motion.div variants={ITEM} className="mt-4 flex flex-wrap gap-2">
                  {g.genre.split(",").map((t) => (
                    <span
                      key={t}
                      className="px-3.5 py-1 rounded-full border border-ink/15 text-[10px] font-semibold uppercase tracking-wider text-ink/50"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </motion.div>

                {g.description && (
                  <motion.p variants={ITEM} className="mt-5 text-sm leading-relaxed text-ink/60">{g.description}</motion.p>
                )}

                {(hasUrl(g.playUrl) || hasUrl(g.appUrl)) && (
                  <motion.div variants={ITEM} className="mt-7 flex flex-wrap gap-3">
                    {hasUrl(g.playUrl) && (
                      <StoreButton href={g.playUrl!} label="Android" icon={<PlayIcon />} />
                    )}
                    {hasUrl(g.appUrl) && (
                      <StoreButton href={g.appUrl!} label="iOS" icon={<AppleIcon />} />
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
