"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Game } from "@/components/GamesSection";

function CardArt({ game }: { game: Game }) {
  const [err, setErr] = useState(false);
  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
      {game.icon && !err ? (
        <Image
          src={game.icon}
          alt={game.title}
          fill
          sizes="220px"
          onError={() => setErr(true)}
          className="object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient}`} />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
      <p className="absolute bottom-4 left-4 right-4 text-white font-extrabold display text-lg drop-shadow">
        {game.title}
      </p>
    </div>
  );
}

export default function GamesTicker({ games, seconds = 60 }: { games: Game[]; seconds?: number }) {
  const items = games.filter((g) => g.icon || g.gradient);
  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-14 select-none"
      aria-hidden
    >
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-x-0 top-8 mx-auto w-[40rem] max-w-full h-56 rounded-full bg-accent/10 blur-3xl" />

      <div className="ticker-group relative overflow-hidden py-8 -my-4">
        {/* moving track: left to right, slow */}
        <div className="animate-scroll-x-reverse w-max" style={{ animationDuration: `${Math.max(10, seconds)}s` }}>
          <div className="flex items-center gap-6 pr-6">
            {doubled.map((g, i) => (
              <div
                key={`${g.title}-${i}`}
                className="relative shrink-0 w-36 sm:w-44 md:w-52 aspect-[3/4] transition-transform duration-500 hover:scale-105 hover:!rotate-0 hover:z-20"
                style={{ transform: `rotate(${i % 2 ? 3 : -3}deg)` }}
              >
                <div
                  className="w-full h-full animate-floaty-slow"
                  style={{ animationDelay: `${(i % 5) * 0.8}s` }}
                >
                  <CardArt game={g} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent z-10" />
      </div>
    </motion.div>
  );
}
