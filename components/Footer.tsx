"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type FooterContent = {
  email: string;
  copyright: string;
  socials: { label: string; url: string }[];
};

import type { NavLabels } from "@/components/Navbar";

export default function Footer({
  content,
  brand,
  labels = {},
  logo = "",
}: {
  content: FooterContent;
  brand: string;
  labels?: NavLabels;
  logo?: string;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="px-4 md:px-6 pb-6">
      <div className="mx-auto max-w-[1400px] bg-[#2f2f2f] text-white rounded-[2rem] px-8 md:px-12 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <p className="flex items-center gap-3 text-3xl font-extrabold display">
              {logo && (
                <Image
                  src={logo}
                  alt={brand}
                  width={96}
                  height={96}
                  className="w-11 h-11 object-contain"
                />
              )}
              <span>
                {brand}<span className="text-accent">.</span>
              </span>
            </p>
            <div className="mt-6 flex gap-4 text-white/40 text-sm">
              {content.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url || "#"}
                  // Social links leave the site, so open them in their own tab.
                  target={s.url && s.url !== "#" ? "_blank" : undefined}
                  rel={s.url && s.url !== "#" ? "noreferrer noopener" : undefined}
                  className="hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <p className="mt-8 text-sm text-white/40">{content.copyright}</p>
          </div>

          <nav className="flex flex-col gap-2.5 text-sm">
            <Link href="/" className="text-white font-medium hover:text-accent transition-colors">{labels.home ?? "Home"}</Link>
            <Link href="/about" className="text-white/50 hover:text-white transition-colors">{labels.about ?? "About"}</Link>
            <Link href="/services" className="text-white/50 hover:text-white transition-colors">{labels.services ?? "Services"}</Link>
            <Link href="/games" className="text-white/50 hover:text-white transition-colors">{labels.games ?? "Games"}</Link>
            <Link href="/arcade" className="text-white/50 hover:text-white transition-colors">{labels.arcade ?? "Arcade"}</Link>
            <Link href="/contact" className="text-white/50 hover:text-white transition-colors">{labels.contact ?? "Contact Us"}</Link>
          </nav>

          <div className="text-sm">
            <a href={`mailto:${content.email}`} className="text-white/70 hover:text-accent transition-colors">
              {content.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
