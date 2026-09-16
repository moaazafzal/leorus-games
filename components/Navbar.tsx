"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

export type NavLabels = { home?: string; about?: string; services?: string; games?: string; arcade?: string; contact?: string };

export default function Navbar({
  brand = "LEORUS",
  labels = {},
  logo = "",
}: {
  brand?: string;
  labels?: NavLabels;
  logo?: string;
}) {
  const links = [
    { href: "/", label: labels.home ?? "Home" },
    { href: "/about", label: labels.about ?? "About" },
    { href: "/services", label: labels.services ?? "Services" },
    { href: "/games", label: labels.games ?? "Games" },
    { href: "/arcade", label: labels.arcade ?? "Arcade" },
    { href: "/contact", label: labels.contact ?? "Contact" },
  ];
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y > prev && y > 160 && !open) setHidden(true);
    else setHidden(false);
  });

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-accent"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <div className="w-full max-w-3xl bg-[#2f2f2f] rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white">
            {logo && (
              <Image
                src={logo}
                alt={brand}
                width={72}
                height={72}
                priority
                className="w-8 h-8 md:w-9 md:h-9 object-contain"
              />
            )}
            <span>
              {brand}<span className="text-accent">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname === l.href ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {l.label}
                {pathname === l.href && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(!open)}
              className="md:hidden p-2"
            >
              <div className="w-5 space-y-1">
                <span className={`block h-0.5 bg-white transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
                <span className={`block h-0.5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 bg-white transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="md:hidden absolute top-20 left-4 right-4 rounded-2xl bg-[#2f2f2f] shadow-xl p-4 flex flex-col gap-1"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-base font-medium text-white/80 hover:bg-white/10"
                >
                  {l.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
