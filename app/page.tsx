import Hero from "@/components/Hero";
import GamesSection from "@/components/GamesSection";
import PartnerSection from "@/components/PartnerSection";
import ReviewsSection from "@/components/ReviewsSection";
import StudiosSection from "@/components/StudiosSection";
import { getContent } from "@/lib/content";

export const revalidate = 3600;

export default async function Home() {
  const c = await getContent();
  return (
    <main>
      <Hero content={c.hero} />
      <GamesSection content={c.gamesSection} games={c.games} />
      <PartnerSection content={c.partner} />
      {c.reviews && <ReviewsSection content={c.reviews} />}
      <StudiosSection content={c.studios} />
    </main>
  );
}
