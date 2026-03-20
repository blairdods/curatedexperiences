"use client";

import { Button } from "./button";

export function ConciergeCTAButton({
  children,
  variant = "primary",
  size = "lg",
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => window.dispatchEvent(new Event("ce:open-concierge"))}
    >
      {children}
    </Button>
  );
}
