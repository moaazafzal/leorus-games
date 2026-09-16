import type { Metadata } from "next";
import GamesShowcase from "@/components/GamesShowcase";
import WebGamesSection from "@/components/WebGamesSection";
import GamesTicker from "@/components/GamesTicker";
import { getContent } from "@/lib/content";
import { accent } from "@/lib/accent";

export const metadata: Metadata = {
  title: "Games | Leorus",
  description: "Browse the Leorus catalogue of mobile games across every genre.",
};

export const revalidate = 3600;

export default async function GamesPage() {
  const c = await getContent();
  return (
    <main className="pt-32">
      <div className="text-center px-4 md:px-6">
        <h1 className="display font-extrabold text-[clamp(2.8rem,7vw,6rem)]">
          {accent(c.gamesPage.title)}
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-lg text-ink/60">{c.gamesPage.intro}</p>
      </div>
      {/* full-bleed ticker */}
      <GamesTicker games={c.games} seconds={c.gamesPage.tickerSeconds} />
      <section className="mx-auto max-w-[1200px] px-4 md:px-6 pb-8 pt-12">
        <GamesShowcase games={c.games} />
      </section>
      {c.webGames && <WebGamesSection content={c.webGames} />}
    </main>
  );
}
