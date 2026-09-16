import type { Metadata } from "next";
import { MiniGamesGrid } from "@/components/MiniGames";
import { getContent } from "@/lib/content";
import { accent } from "@/lib/accent";

export const metadata: Metadata = {
  title: "Arcade | Leorus",
  description: "Tiny playable games from the Leorus team. Beat your best score.",
};

export const revalidate = 3600;

export default async function ArcadePage() {
  const c = await getContent();
  return (
    <main className="pt-32">
      <section className="mx-auto max-w-[1400px] px-4 md:px-6 pb-24 text-center">
        <h1 className="display font-extrabold text-[clamp(2.8rem,7vw,6rem)]">
          {accent(c.minigames?.title ?? "The |Arcade|")}
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-lg text-ink/60">
          {c.minigames?.body ?? ""}
        </p>
        <MiniGamesGrid games={c.minigames?.games} />
      </section>
    </main>
  );
}
