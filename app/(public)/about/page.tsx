"use client";

import { Hero } from "@/components/ui/hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Testimonial } from "@/components/ui/testimonial";

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="Our Story"
        title="Shaped by New Zealand, held by experience."
        subtitle="We do not sell tours. We curate time."
        imageSrc="/assets/images/233206-aoraki-mt-cook-canterbury.jpg"
        imageAlt="New Zealand fiord landscape"
        compact
      />

      {/* Philosophy */}
      <Section narrow>
        <div className="text-center">
          <p className="font-serif text-[32px] sm:text-[42px] leading-[1.12] text-navy tracking-normal">
            Curated Experiences&trade; was born from a simple belief: New Zealand
            deserves to be experienced properly — not rushed through, not
            reduced to a checklist, but felt.
          </p>
        </div>
        <div className="mt-12 space-y-6 max-w-2xl mx-auto">
          <p className="text-[15px] text-foreground/80 leading-7">
            We are a small team of New Zealanders who have spent our lives
            exploring this country — not as tourists, but as locals who know
            where the light falls best, which lodge has the owner who&apos;ll
            open a bottle of something special, and which trail leads to a
            view that will stop you in your tracks.
          </p>
          <p className="text-[15px] text-foreground/80 leading-7">
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
              role: "Strategy, Marketing & Curator",
              tagline: "New Zealand holds a special place in my heart and we want to share this with the World.",
              bio: "With decades of luxury travel experience across New Zealand and the Pacific, Tony brings an encyclopaedic knowledge of the country's best lodges, guides, and hidden experiences. His background with PPG Tours — Best New Zealand DMC at the World Travel Awards 2025, and finalist in two categories for 2026 — means he's worked with the most discerning travellers in the world. From designing VIP land programs for Silversea, Ponant, and Celebrity to crafting private journeys for high-net-worth clients, Tony knows exactly how to exceed expectations.",
            },
            {
              name: "Liam",
              role: "Head of Digital",
              tagline: "It's all about connecting with people, informing and educating them, to create the pathway to curating and developing great experiences.",
              bio: "Liam leads the digital experience — from the first search to the final conversation. His focus is on making sure every touchpoint is seamless, personal, and true to the Curated Experiences standard.",
            },
            {
              name: "Jade",
              role: "Marketing, Sustainability & Curator",
              tagline: "I love the creativity in developing memorable programmes, personal to each individual.",
              bio: "Jade brings a passion for thoughtful design and a deep commitment to sustainable travel. She crafts programmes that feel truly unique to each traveller, while ensuring every journey treads lightly on the landscapes we cherish.",
            },
            {
              name: "Tracy",
              role: "Travel Curator",
              tagline: "I'm a World Traveller but with deep set roots in New Zealand.",
              bio: "Tracy's global perspective is what sets her apart — having travelled extensively, she understands exactly what discerning travellers are looking for and how to deliver it with genuine, on-the-ground New Zealand knowledge.",
            },
          ].map((person) => (
            <div key={person.name} className="border-t border-navy/12 pt-6">
              <h3 className="font-serif text-[28px] leading-[1.08] text-navy tracking-normal">
                {person.name}
              </h3>
              <p className="text-[10px] tracking-[0.28em] uppercase font-semibold text-gold mt-3">
                {person.role}
              </p>
              <p className="mt-5 font-serif text-[20px] text-navy/80 leading-[1.2]">
                &ldquo;{person.tagline}&rdquo;
              </p>
              <p className="mt-4 text-[13px] text-foreground/70 leading-6">
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
          subtitle="Curated Experiences&trade; is a venture of PPG Tours — an established New Zealand travel company with an exceptional track record."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { stat: "20+", label: "Years of NZ travel expertise" },
            { stat: "Best NZ DMC", label: "World Travel Awards 2025" },
            { stat: "2026 Finalist", label: "NZ Tour Operator & DMC of the Year" },
            { stat: "Silversea, Ponant, Celebrity", label: "Trusted by the world's leading cruise lines" },
          ].map((item) => (
            <div key={item.label} className="border-t border-navy/12 pt-5">
              <p className="font-serif text-[28px] sm:text-[34px] text-navy tracking-normal leading-[1.08]">
                {item.stat}
              </p>
              <p className="mt-3 text-[12px] leading-5 text-foreground-muted">
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
              <h3 className="font-serif text-[26px] leading-[1.08] text-navy tracking-normal">
                {item.title}
              </h3>
              <p className="mt-4 text-[13px] text-foreground/70 leading-6">
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
          <h2 className="font-serif text-[38px] sm:text-[46px] leading-[1.08] tracking-normal text-navy">
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
              className="px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium text-gold
                border border-gold hover:bg-gold/8 transition-colors"
            >
              Start a Conversation
            </button>
            <a
              href="tel:0800287283"
              className="inline-flex items-center gap-2 px-6 py-4 text-xs tracking-[0.2em] uppercase font-medium text-navy/60
                border border-navy/15 hover:border-navy/30 hover:text-navy transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              0800 CURATE · 0800 287 283
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
