import {
  Button,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";
import { EmailLayout, BRAND } from "./base-layout";

interface PaymentLinkEmailProps {
  clientName: string;
  depositAmountUsd: number;
  paymentUrl: string;
  curatorName?: string;
}

export function PaymentLinkEmail({
  clientName,
  depositAmountUsd,
  paymentUrl,
  curatorName = "The Curated Experiences Team",
}: PaymentLinkEmailProps) {
  const firstName = clientName.split(" ")[0];

  return (
    <EmailLayout preview={`Your deposit payment link — $${depositAmountUsd.toLocaleString()} to secure your New Zealand journey`}>
      <Section>
        <Text
          style={{
            fontSize: "15px",
            color: BRAND.foreground,
            lineHeight: "1.7",
            margin: "0 0 16px",
          }}
        >
          Dear {firstName},
        </Text>

        <Text
          style={{
            fontSize: "15px",
            color: BRAND.foreground,
            lineHeight: "1.7",
            margin: "0 0 16px",
          }}
        >
          Thank you for choosing Curated Experiences. To secure your New Zealand
          journey, please use the link below to complete your deposit payment of{" "}
          <strong>${depositAmountUsd.toLocaleString()} USD</strong>.
        </Text>

        <Section style={{ textAlign: "center", margin: "32px 0" }}>
          <Button
            href={paymentUrl}
            style={{
              backgroundColor: BRAND.navy,
              color: "#EDEAE2",
              padding: "14px 32px",
              borderRadius: "4px",
              fontSize: "14px",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.5px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Pay Deposit — ${depositAmountUsd.toLocaleString()}
          </Button>
        </Section>

        <Text
          style={{
            fontSize: "13px",
            color: BRAND.muted,
            lineHeight: "1.6",
            margin: "0 0 16px",
          }}
        >
          This link is unique to your booking. Once your deposit is received,
          your curator will be in touch to begin crafting your itinerary.
        </Text>

        <Hr style={{ borderColor: BRAND.warm200, margin: "24px 0" }} />

        <Text
          style={{
            fontSize: "14px",
            color: BRAND.foreground,
            lineHeight: "1.7",
            margin: "0 0 4px",
          }}
        >
          Warmly,
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: BRAND.foreground,
            lineHeight: "1.7",
            margin: "0",
          }}
        >
          {curatorName}
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: BRAND.muted,
            margin: "4px 0 0",
          }}
        >
          Curated Experiences
        </Text>
      </Section>
    </EmailLayout>
  );
}
