"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export type TeamContent = {
  title: string;
  body: string;
  members: { name: string; role: string; photo: string }[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

const RING_COLORS = [
  // Champagne into copper and cognac: one warm family, varied in depth.
  "from-[#f6dcb3] to-[#b8541a]",
  "from-[#efc998] to-[#8f3f12]",
  "from-[#f9e6c7] to-[#c8702e]",
  "from-[#eab98a] to-[#a64b17]",
  "from-[#f4d3a4] to-[#b5652b]",
  "from-[#e9c08f] to-[#7a3510]",
];

const TEAM_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

function Photo({ src, name, ring }: { src: string; name: string; ring: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`relative w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-br ${ring}`}>
      <div className="w-full h-full rounded-full overflow-hidden bg-sunken flex items-center justify-center">
        {src && !err ? (
          <Image
            src={src}
            alt={name}
            width={288}
            height={288}
            onError={() => setErr(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-extrabold text-ink/30">
            {name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("")}
          </span>
        )}
      </div>
    </div>
  );
}

export default function TeamSection({ content }: { content: TeamContent }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 text-center">
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

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className={`mt-14 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 ${
            TEAM_COLS[content.members.length] ?? "lg:grid-cols-6"
          }`}
        >
          {content.members.map((m, i) => (
            <motion.figure
              key={`${m.name}-${i}`}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.85 },
                show: {
                  opacity: 1, y: 0, scale: 1,
                  transition: { type: "spring", stiffness: 130, damping: 15 },
                },
              }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center cursor-default"
            >
              <motion.div
                whileHover={{ rotate: [0, -4, 4, 0], transition: { duration: 0.45 } }}
              >
                <Photo src={m.photo} name={m.name} ring={RING_COLORS[i % RING_COLORS.length]} />
              </motion.div>
              <figcaption className="mt-4">
                {m.name ? (
                  <>
                    <p className="text-base font-bold">{m.name}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-widest text-ink/45">{m.role}</p>
                  </>
                ) : (
                  <p className="text-xs uppercase tracking-widest font-bold text-ink/70">{m.role}</p>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
