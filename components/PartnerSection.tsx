"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { lines } from "@/lib/accent";

export type PartnerContent = {
  title: string;
  body: string;
  mascot: string;
  cards: { icon: string; title: string; body: string }[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PartnerSection({ content }: { content: PartnerContent }) {
  const [birdErr, setBirdErr] = useState(false);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="max-w-xl rounded-3xl bg-sunken p-8 md:p-10"
          >
            <h2 className="display font-extrabold text-[clamp(1.8rem,3.5vw,2.8rem)]">
              {lines(content.title)}
            </h2>
            <p className="mt-8 text-ink/60">{content.body}</p>
          </motion.div>

          {!birdErr && content.mascot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 13 }}
              className="pointer-events-none hidden md:block absolute right-8 lg:right-20 -bottom-6 w-40 lg:w-60"
            >
              <div className="animate-floaty-slow">
                <Image
                  src={content.mascot}
                  alt=""
                  width={620}
                  height={681}
                  onError={() => setBirdErr(true)}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="mt-10 grid md:grid-cols-3 gap-5"
        >
          {content.cards.map((c, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 60, scale: 0.95 },
                show: {
                  opacity: 1, y: 0, scale: 1,
                  transition: { type: "spring", stiffness: 110, damping: 16 },
                },
              }}
              whileHover={{ y: -8 }}
              className="group rounded-3xl bg-sunken p-8 hover:bg-surface hover:shadow-2xl transition-[background-color,box-shadow] duration-300"
            >
              <div className="flex justify-end">
                <motion.span
                  whileHover={{ rotate: [0, -12, 12, -6, 0], transition: { duration: 0.5 } }}
                  className="w-14 h-14 rounded-full bg-surface border border-ink/5 flex items-center justify-center text-2xl group-hover:shadow-md transition-shadow"
                >
                  {c.icon}
                </motion.span>
              </div>
              <h3 className="mt-10 text-xl font-bold">{c.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/55">{c.body}</p>
              <div className="mt-6 h-0.5 w-0 bg-accent group-hover:w-12 transition-all duration-500 ease-out" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
