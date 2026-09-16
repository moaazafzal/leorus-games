import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";
import { accent } from "@/lib/accent";

export const metadata: Metadata = {
  title: "Contact | Leorus",
  description: "Get in touch with the Leorus team.",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const c = await getContent();
  return (
    <main className="pt-32">
      <section className="mx-auto max-w-7xl px-6 pb-24 grid lg:grid-cols-2 gap-16">
        <div>
          <h1 className="display font-extrabold text-[clamp(2.8rem,8vw,6.5rem)]">
            {accent(c.contact.title)}
          </h1>
          <p className="mt-8 max-w-md text-lg text-ink/60">{c.contact.intro}</p>
          <div className="mt-10 space-y-3">
            <a
              href={`mailto:${c.contact.email}`}
              className="block text-2xl font-bold hover:text-accent-ink transition-colors"
            >
              {c.contact.email}
            </a>
            <p className="text-ink/50">{c.contact.hours}</p>
          </div>
        </div>
        <ContactForm content={{ ...c.contact.form, email: c.contact.email, source: c.brand }} />
      </section>
    </main>
  );
}
