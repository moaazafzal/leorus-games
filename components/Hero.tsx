"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix: string; label: string };
export type HeroContent = {
  line1: string;
  line2: string;
  badgeNumber: string;
  badgeWord: string;
  badgeLabel: string;
  mascotBadge: string;
  mascotLeft: string;
  mascotRight: string;
  stats: Stat[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1.8, bounce: 0 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = Math.round(v).toString() + suffix;
      }
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function Img({ src, alt, ...rest }: React.ComponentProps<typeof Image>) {
  const [err, setErr] = useState(false);
  if (err || !src) return null;
  return <Image src={src} alt={alt} onError={() => setErr(true)} {...rest} />;
}

/* Word-by-word mask reveal */
function Words({
  text,
  className,
  baseDelay = 0,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
}) {
  return (
    <span className={`inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className ?? ""}`}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block mr-[0.24em] will-change-transform"
          initial={{ y: "115%", rotate: 4 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ delay: baseDelay + i * 0.07, duration: 0.8, ease: EASE }}
        >
          {w}
        </motion.span>
      ))}
    </span>
  );
}

// Literal class names so Tailwind keeps them in the build
const STAT_COLS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
};

function badgeSize(value: string): string {
  const n = (value ?? "").length;
  if (n <= 4) return "text-7xl md:text-8xl";
  if (n <= 6) return "text-6xl md:text-7xl";
  if (n <= 8) return "text-5xl md:text-6xl";
  return "text-4xl md:text-5xl";
}

export default function Hero({ content }: { content: HeroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yBadge = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pt-28 pb-10">
      {/* Side mascots: entrance + scroll parallax + idle float */}
      <motion.div
        style={{ y: yLeft }}
        className="pointer-events-none hidden lg:block absolute left-0 top-40 w-72 xl:w-80"
      >
        <motion.div
          initial={{ opacity: 0, x: -80, rotate: -8 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.55, type: "spring", stiffness: 70, damping: 16 }}
        >
          <div className="animate-floaty-slow">
            <Img src={content.mascotLeft} alt="" width={960} height={1137} className="w-full h-auto" />
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        style={{ y: yRight }}
        className="pointer-events-none hidden lg:block absolute right-4 xl:right-10 top-40 w-40 xl:w-44"
      >
        <motion.div
          initial={{ opacity: 0, x: 80, rotate: 8 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.65, type: "spring", stiffness: 70, damping: 16 }}
        >
          <div className="animate-floaty" style={{ animationDelay: "1.2s" }}>
            <Img src={content.mascotRight} alt="" width={560} height={1385} className="w-full h-auto" />
          </div>
        </motion.div>
      </motion.div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h1 className="display font-extrabold text-[clamp(2.2rem,5.5vw,4.2rem)]">
          <Words text={content.line1} />
          <br />
          <Words text={content.line2} baseDelay={0.28} />
        </h1>

        {/* Downloads badge: spring pop + parallax + bobbing mascot */}
        <motion.div style={{ y: yBadge }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 120, damping: 15 }}
            whileHover={{ scale: 1.04 }}
            className="relative mx-auto mt-12 w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-b from-[#faf0e4] via-white to-[#f1d9bf] dark:bg-none dark:shadow-none shadow-[0_20px_60px_rgba(184,84,26,0.18)] flex flex-col items-center justify-start pt-12 md:pt-16 overflow-hidden"
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5, ease: EASE }}
              className={`${badgeSize(content.badgeNumber)} font-extrabold display text-accent-ink tabular-nums`}
            >
              {content.badgeNumber.split("").map((ch, i) => (
                <span
                  key={i}
                  className="animate-digit"
                  style={{ animationDelay: `${i * 0.09}s` }}
                >
                  {ch}
                </span>
              ))}
            </motion.p>
            {content.badgeWord && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5, ease: EASE }}
                className="mt-1 text-2xl font-extrabold tracking-wide text-accent-ink uppercase"
              >
                {content.badgeWord}
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95, duration: 0.5 }}
              className="text-sm text-ink/50 font-medium"
            >
              {content.badgeLabel}
            </motion.p>
            <motion.div
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 110, damping: 14 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 md:w-36"
            >
              <div className="animate-floaty" style={{ animationDelay: "0.6s" }}>
                <Img src={content.mascotBadge} alt="Leorus mascot" width={520} height={606} priority className="w-full h-auto" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats: stagger + hover lift */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09, delayChildren: 0.85 } },
          }}
          className={`mt-14 grid grid-cols-2 ${STAT_COLS[content.stats.length] ?? "md:grid-cols-4"} gap-4`}
        >
          {content.stats.map((s) => (
            <motion.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.92 },
                show: {
                  opacity: 1, y: 0, scale: 1,
                  transition: { type: "spring", stiffness: 150, damping: 16 },
                },
              }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="rounded-2xl bg-sunken px-4 py-6 cursor-default hover:shadow-lg transition-shadow"
            >
              <p className="text-2xl md:text-3xl font-extrabold display">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-ink/50">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
