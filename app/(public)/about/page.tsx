"use client";

import { Hero } from "@/components/ui/hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Testimonial } from "@/components/ui/testimonial";

export default function AboutPage() {
  return (
    <>
      <Hero
        title="Our Story"
        subtitle="We don't sell tours. We curate time."
        imageSrc="https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1920&q=80"
        imageAlt="New Zealand landscape"
        compact
      />

      {/* Philosophy */}
      <Section narrow>
        <div className="text-center">
          <p className="font-serif text-2xl sm:text-3xl leading-relaxed text-navy tracking-tight">
            Curated Experiences was born from a simple belief: New Zealand
            deserves to be experienced properly — not rushed through, not
            reduced to a checklist, but felt.
          </p>
        </div>
        <div className="mt-12 space-y-6 max-w-2xl mx-auto">
          <p className="text-foreground/80 leading-relaxed">
            We are a small team of New Zealanders who have spent our lives
            exploring this country — not as tourists, but as locals who know
            where the light falls best, which lodge has the owner who&apos;ll
            open a bottle of something special, and which trail leads to a
            view that will stop you in your tracks.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Every journey we design is built from scratch. No templates, no
            group departures, no compromises. Just a conversation about what
            moves you, and a team that knows how to turn that into something
            unforgettable.
          </p>
        </div>
      </Section>

      {/* Team */}
      <Section background="warm">
        <SectionHeader
          eyebrow="Our Curators"
          title="Meet the team"
          subtitle="The people behind every journey."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {[
            {
              name: "Tony",
              role: "Co-founder & Lead Curator",
              bio: "With decades of luxury travel experience across New Zealand and the Pacific, Tony brings an encyclopaedic knowledge of the country's best lodges, guides, and hidden experiences. His background with PPG Tours — Best New Zealand DMC at the World Travel Awards 2025, and finalist in two categories for 2026 — means he's worked with the most discerning travellers in the world. From designing VIP land programs for Silversea, Ponant, and Celebrity to crafting private journeys for high-net-worth clients, Tony knows exactly how to exceed expectations.",
            },
            {
              name: "Liam",
              role: "Co-founder & Experience Designer",
              bio: "Liam's passion is in the details — the restaurant that just opened, the guide who knows the mountain like the back of his hand, the new vineyard that's doing something genuinely different. He designs every itinerary as if he were travelling it himself, balancing adventure with rest, and always leaving room for the unexpected.",
            },
          ].map((person) => (
            <div key={person.name}>
              <div className="w-24 h-24 rounded-full bg-warm-200 mb-6" />
              <h3 className="font-serif text-xl text-navy tracking-tight">
                {person.name}
              </h3>
              <p className="text-xs tracking-widest uppercase text-warm-500 mt-1">
                {person.role}
              </p>
              <p className="mt-4 text-sm text-foreground/70 leading-relaxed">
                {person.bio}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Credentials */}
      <Section narrow>
        <SectionHeader
          eyebrow="Our Heritage"
          title="Built on PPG Tours"
          subtitle="Curated Experiences is a venture of PPG Tours — an established New Zealand travel company with an exceptional track record."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { stat: "20+", label: "Years of NZ travel expertise" },
            { stat: "Best NZ DMC", label: "World Travel Awards 2025" },
            { stat: "2026 Finalist", label: "NZ Tour Operator & DMC of the Year" },
            { stat: "Silversea, Ponant, Celebrity", label: "Trusted by the world's leading cruise lines" },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-serif text-2xl sm:text-3xl text-navy tracking-tight">
                {item.stat}
              </p>
              <p className="mt-2 text-sm text-foreground-muted">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Sustainability & Safety */}
      <Section background="warm">
        <SectionHeader
          eyebrow="Our Commitment"
          title="Kaitiakitanga — Guardianship of the Land"
          subtitle="We believe luxury travel and environmental responsibility are inseparable."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              title: "Sustainable by Design",
              description:
                "We are pursuing Travel Life sustainability certification and Qualmark accreditation — New Zealand's official quality and environmental tourism mark. Every journey we design considers its impact on the communities and landscapes we visit.",
            },
            {
              title: "Conservation Partners",
              description:
                "From private kiwi release experiences to predator-free island projects, we connect our travellers with genuine conservation efforts. This isn't greenwashing — it's how we put our values into practice.",
            },
            {
              title: "Safe & Welcoming",
              description:
                "New Zealand is consistently ranked among the world's safest destinations. From your first airport transfer to your final farewell, our on-the-ground team ensures your safety and peace of mind at every step.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-serif text-lg text-navy tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonial */}
      <Section>
        <Testimonial
          quote="Tony doesn't just know New Zealand — he understands what makes a journey feel personal. Every recommendation felt like it was chosen specifically for us."
          author="Jennifer & Mark Williams"
          location="New York, NY"
        />
      </Section>

      {/* CTA */}
      <Section narrow>
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-navy">
            Ready to Talk?
          </h2>
          <p className="mt-4 text-foreground-muted leading-relaxed">
            Whether you have a clear vision or just a feeling that New Zealand is calling,
            we&apos;d love to hear from you. No obligation — just a conversation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                typeof window !== "undefined" && window.dispatchEvent(new Event("ce:open-concierge"))
              }
              className="px-8 py-3 text-sm tracking-wide bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
            >
              Start a Conversation
            </button>
            <a
              href="tel:+6498895828"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-wide text-navy border border-navy/20
                rounded-lg hover:bg-navy/5 transition-colors"
            >
              Call +64 9 889 5828
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
