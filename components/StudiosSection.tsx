"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export type StudiosContent = {
  title: string;
  body: string;
  items: { name: string; focus: string; gradient: string; image?: string; logo?: boolean }[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

function CardMedia({ item }: { item: StudiosContent["items"][number] }) {
  const [err, setErr] = useState(false);
  if (!item.image || err) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,255,255,0.3),transparent_50%)] group-hover:scale-125 transition-transform duration-700" />
    );
  }
  const fit = item.logo
    ? "object-contain p-10 md:p-16 group-hover:scale-105 transition-transform duration-700"
    : "object-cover group-hover:scale-105 transition-transform duration-700";

  // SVG is served as-is: the image optimiser only accepts it behind a flag that
  // would also let an uploaded SVG run scripts on this origin.
  if (item.image.toLowerCase().endsWith(".svg")) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`${base}${item.image}`}
        alt={item.name}
        onError={() => setErr(true)}
        className={`absolute inset-0 w-full h-full ${fit}`}
      />
    );
  }

  return (
    <Image
      src={item.image}
      alt={item.name}
      fill
      sizes="(max-width: 1024px) 100vw, 1400px"
      onError={() => setErr(true)}
      className={fit}
    />
  );
}

export default function StudiosSection({ content }: { content: StudiosContent }) {
  const single = content.items.length === 1;

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
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className={
            single
              ? "mt-12"
              : "mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left"
          }
        >
          {content.items.map((s, i) => (
            <motion.div
              key={`${s.name}-${i}`}
              variants={{
                hidden: { opacity: 0, y: 70, rotate: single ? 0 : i % 2 ? 2 : -2 },
                show: {
                  opacity: 1, y: 0, rotate: 0,
                  transition: { type: "spring", stiffness: 100, damping: 16 },
                },
              }}
              whileHover={single ? { scale: 1.01 } : { y: -10, scale: 1.02 }}
              className={`${
                single ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] w-full" : "aspect-[4/5]"
              } rounded-3xl ${s.logo ? "bg-white border border-ink/[0.06]" : `bg-gradient-to-br ${s.gradient}`} relative overflow-hidden group cursor-pointer shine text-left`}
            >
              <CardMedia item={s} />
              {!s.logo && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              )}
              <div className={`absolute ${single ? "bottom-8 left-8 right-8 md:bottom-10 md:left-12" : "bottom-6 left-6 right-6"} ${s.logo ? "text-[#111111]" : "text-white"}`}>
                <p className={`${single ? "text-2xl sm:text-3xl md:text-5xl" : "text-2xl"} font-extrabold display drop-shadow`}>
                  {s.name}
                </p>
                <p className={`mt-1 ${s.logo ? "text-[#111111]/60" : "text-white/75"} ${single ? "text-sm md:text-base" : "text-sm"}`}>
                  {s.focus}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
