import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const BRAND = {
  navy: "#1F3864",
  warm50: "#faf9f7",
  warm200: "#e8dfd6",
  warm500: "#9a8574",
  foreground: "#1a1a1a",
  muted: "#6b6560",
};

export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: BRAND.warm50,
          fontFamily:
            'Georgia, "Times New Roman", serif',
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "580px",
            margin: "0 auto",
            padding: "40px 24px",
          }}
        >
          {/* Header */}
          <Section style={{ textAlign: "center", marginBottom: "40px" }}>
            <Text
              style={{
                fontSize: "24px",
                color: BRAND.navy,
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              Curated Experiences
            </Text>
            <Text
              style={{
                fontSize: "11px",
                color: BRAND.warm500,
                letterSpacing: "2px",
                textTransform: "uppercase" as const,
                margin: "4px 0 0",
              }}
            >
              Luxury New Zealand Travel
            </Text>
          </Section>

          {/* Content */}
          {children}

          {/* Footer */}
          <Section
            style={{
              marginTop: "48px",
              paddingTop: "24px",
              borderTop: `1px solid ${BRAND.warm200}`,
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: BRAND.warm500,
                margin: "0 0 8px",
              }}
            >
              Curated Experiences — A PPG Tours Venture
            </Text>
            <Text
              style={{
                fontSize: "11px",
                color: BRAND.warm500,
                margin: "0 0 4px",
              }}
            >
              <Link
                href="https://curatedexperiences.com"
                style={{ color: BRAND.warm500 }}
              >
                curatedexperiences.com
              </Link>
            </Text>
            <Text
              style={{
                fontSize: "11px",
                color: BRAND.warm500,
                margin: "0",
              }}
            >
              <Link
                href="{{unsubscribe_url}}"
                style={{ color: BRAND.warm500 }}
              >
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export { BRAND };
