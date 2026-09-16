import type { Metadata } from "next";
import CareersCTA from "@/components/CareersCTA";
import TeamSection from "@/components/TeamSection";
import GallerySection from "@/components/GallerySection";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About | Leorus",
  description: "Who we are, what we believe, and how we build games.",
};

export const revalidate = 3600;

export default async function AboutPage() {
  const c = await getContent();
  return (
    <main className="pt-32">
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h1 className="display font-extrabold text-[clamp(2.8rem,8vw,7rem)]">
          {c.about.title} <span className="text-ink/40">{c.about.titleMuted}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink/60">{c.about.intro}</p>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          {c.about.values.map((v: { title: string; body: string }, i: number) => (
            <div key={i} className="rounded-3xl border border-ink/10 bg-surface p-8">
              <span className="text-4xl font-extrabold display text-accent-ink">
                0{i + 1}
              </span>
              <h3 className="mt-5 text-2xl font-bold">{v.title}</h3>
              <p className="mt-3 text-ink/60">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
      {c.team && <TeamSection content={c.team} />}
      {c.gallery && <GallerySection content={c.gallery} />}
      <CareersCTA
        title={c.growth.careersTitle}
        body={c.growth.careersBody}
        cta={c.growth.careersCta}
        link={c.growth.careersLink}
      />
    </main>
  );
}
