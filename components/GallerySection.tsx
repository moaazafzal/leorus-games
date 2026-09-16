"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export type GalleryContent = {
  title: string;
  body: string;
  interval?: number;
  images: string[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GallerySection({ content }: { content: GalleryContent }) {
  const images = (content.images ?? []).filter(Boolean);
  const interval = Math.max(2, content.interval ?? 4) * 1000;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [paused, images.length, interval]);

  if (images.length === 0) return null;

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
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mt-12 mx-auto max-w-5xl aspect-[3/2] md:aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-sunken shadow-[0_24px_70px_rgba(0,0,0,0.14)]"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={images[index]}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={images[index]}
                alt={`${content.title} photo ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority={index === 0}
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === index ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
