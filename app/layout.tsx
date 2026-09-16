import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1014" },
  ],
};

// Runs before first paint so the stored theme is applied without a flash of
// the wrong one. Kept inline and tiny for that reason.
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    title: c.seo?.title ?? "Leorus",
    description:
      c.seo?.description ??
      "Leorus is a mobile games company crafting player-first experiences.",
  };
}

export const revalidate = 3600;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
        style={{ ["--color-accent" as string]: content.accentColor || "#0099ff" } as React.CSSProperties}
      >
        <Navbar brand={content.brand} labels={content.nav} logo={content.logo} />
        {children}
        <Footer content={content.footer} brand={content.brand} labels={content.nav} logo={content.logo} />
      </body>
    </html>
  );
}
