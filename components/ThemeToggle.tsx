"use client";

import { useEffect, useState } from "react";

/**
 * The inline script in the root layout sets the class before paint, so there
 * is no flash. React can drop that class again while hydrating <html>, so the
 * effect below re-reads the stored preference and reapplies it rather than
 * trusting whatever survived.
 */
function preferred(): boolean {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem("theme");
  } catch {
    // Blocked storage: fall through to the OS preference.
  }
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function isDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const want = preferred();
    document.documentElement.classList.toggle("dark", want);
    setDark(want);
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Private mode or blocked storage: the choice just won't outlive the tab.
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      title={dark ? "Light mode" : "Dark mode"}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors ${className}`}
    >
      {/* Until the effect runs we don't know the theme, so show neither icon
          rather than guess and swap it a frame later. */}
      <svg
        viewBox="0 0 24 24"
        className={`w-[18px] h-[18px] transition-opacity ${ready && !dark ? "opacity-100" : "opacity-0"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className={`absolute w-[18px] h-[18px] transition-opacity ${ready && dark ? "opacity-100" : "opacity-0"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M6.1 6.1 4.6 4.6M19.4 19.4l-1.5-1.5M17.9 6.1l1.5-1.5M4.6 19.4l1.5-1.5" />
      </svg>
    </button>
  );
}
