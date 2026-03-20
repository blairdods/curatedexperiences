import { Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { EmailLayout, BRAND } from "./base-layout";

export function WelcomeEmail({ name }: { name?: string }) {
  return (
    <EmailLayout preview="Welcome to Curated Experiences — your New Zealand journey starts here">
      <Section>
        <Text
          style={{
            fontSize: "22px",
            color: BRAND.navy,
            lineHeight: "1.4",
            margin: "0 0 16px",
          }}
        >
          {name ? `Welcome, ${name}` : "Welcome"}
        </Text>

        <Text
          style={{
            fontSize: "15px",
            color: BRAND.foreground,
            lineHeight: "1.7",
            margin: "0 0 16px",
          }}
        >
          Thank you for your interest in Curated Experiences. We&apos;re
          a small team of New Zealanders who design bespoke luxury
          journeys — every one built from scratch around what moves you.
        </Text>

        <Text
          style={{
            fontSize: "15px",
            color: BRAND.foreground,
            lineHeight: "1.7",
            margin: "0 0 16px",
          }}
        >
          Whether you&apos;re dreaming of Fiordland&apos;s ancient
          waterways, the vineyards of Marlborough, or a glacier
          helicopter landing at dawn — we&apos;d love to help you
          imagine what&apos;s possible.
        </Text>

        <Text
          style={{
            fontSize: "15px",
            color: BRAND.foreground,
            lineHeight: "1.7",
            margin: "0 0 24px",
          }}
        >
          In the meantime, here are a few places to start exploring:
        </Text>

        {/* Journey links */}
        {[
          {
            title: "South Island Odyssey",
            desc: "14 days from Queenstown to Fiordland",
            href: "https://curatedexperiences.com/journeys/south-island-odyssey",
          },
          {
            title: "Wine & Culinary Trail",
            desc: "10 days through NZ's finest wine regions",
            href: "https://curatedexperiences.com/journeys/wine-culinary-trail",
          },
          {
            title: "Wilderness & Adventure",
            desc: "12 days of glacier hikes and starlit skies",
            href: "https://curatedexperiences.com/journeys/wilderness-adventure",
          },
        ].map((journey) => (
          <Link
            key={journey.href}
            href={journey.href}
            style={{
              display: "block",
              padding: "16px",
              marginBottom: "8px",
              backgroundColor: "#f5f0eb",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            <Text
              style={{
                fontSize: "15px",
                color: BRAND.navy,
                margin: "0 0 2px",
                fontWeight: "bold",
              }}
            >
              {journey.title}
            </Text>
            <Text
              style={{
                fontSize: "13px",
                color: BRAND.muted,
                margin: 0,
              }}
            >
              {journey.desc}
            </Text>
          </Link>
        ))}

        <Text
          style={{
            fontSize: "15px",
            color: BRAND.foreground,
            lineHeight: "1.7",
            margin: "24px 0 0",
          }}
        >
          Warm regards,
          <br />
          Tony & Liam
          <br />
          <span style={{ fontSize: "13px", color: BRAND.muted }}>
            Curated Experiences
          </span>
        </Text>
      </Section>
    </EmailLayout>
  );
}
