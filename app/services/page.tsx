import type { Metadata } from "next";
import {
  ServicePillars,
  ServiceStack,
  ServiceWhy,
  ServiceCta,
} from "@/components/ServicesSections";
import { getContent } from "@/lib/content";
import { accent } from "@/lib/accent";

export const metadata: Metadata = {
  title: "Services | Leorus Games",
  description:
    "Game development, UI and UX design, and user acquisition, built in house by Leorus Games.",
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const c = await getContent();
  const s = c.services;
  if (!s) return null;

  return (
    <main className="pt-32">
      <div className="text-center px-4 md:px-6">
        <h1 className="display font-extrabold text-[clamp(2.8rem,7vw,6rem)]">
          {accent(s.title)}
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-lg text-ink/60">{s.intro}</p>
      </div>

      <div className="mt-14">
        <ServicePillars content={s} />
      </div>
      <ServiceStack content={s} />
      <ServiceWhy content={s} />
      <ServiceCta content={s} />
    </main>
  );
}
