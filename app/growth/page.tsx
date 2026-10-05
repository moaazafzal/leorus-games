import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ReviewsSection, { type ReviewsContent } from "@/components/ReviewsSection";
import CareersCTA from "@/components/CareersCTA";
import {
  AUDIT,
  GrowthChannels,
  GrowthServices,
  GrowthSteps,
  GrowthPricing,
  GrowthAudit,
  type GrowthContent,
} from "@/components/GrowthSections";
import { getContent } from "@/lib/content";

// A landing page for the user acquisition offer, built to be shared on its
// own: the navbar drops its links here and every button lands on the audit
// form at the bottom. It reuses the site's own sections so it reads as part
// of the site rather than a bolted-on page.
export async function generateMetadata(): Promise<Metadata> {
  const g = (await getContent()).growthLanding;
  return {
    title: g?.seoTitle,
    description: g?.seoDescription,
    openGraph: { title: g?.seoTitle, description: g?.seoDescription, type: "website" },
  };
}

export const revalidate = 3600;

// Reviews that talk about ads, purchases or monetisation go first: they are
// the proof this page needs, and the rest follow in their usual order.
const ON_TOPIC = /\b(ads?|admob|unity ads|monetis\w*|monetiz\w*|in.app purchases?|revenue|installs?|downloads?)\b/i;

function onTopicFirst(reviews: ReviewsContent, title: string, body: string): ReviewsContent {
  const items = reviews.items ?? [];
  return {
    ...reviews,
    title,
    body,
    items: [...items.filter((r) => ON_TOPIC.test(r.quote)), ...items.filter((r) => !ON_TOPIC.test(r.quote))],
  };
}

export default async function GrowthPage() {
  const c = await getContent();
  const g: GrowthContent | undefined = c.growthLanding;
  if (!g) return null;

  return (
    <main>
      <Hero content={{ ...g.hero, cta: { label: g.hero.ctaLabel, href: AUDIT } }} />
      <GrowthChannels content={g} />
      <GrowthServices content={g} />
      <GrowthSteps content={g} />
      {c.reviews && <ReviewsSection content={onTopicFirst(c.reviews, g.reviewsTitle, g.reviewsBody)} />}
      <GrowthPricing content={g} />
      <CareersCTA title={g.closing.title} body={g.closing.body} cta={g.closing.cta} link={AUDIT} />
      <GrowthAudit content={g} email={c.contact.email} source={c.brand} />
    </main>
  );
}
