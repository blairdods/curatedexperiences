import { ConciergeWidget } from "@/components/concierge/concierge-widget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: Public nav + footer */}
      {children}
      <ConciergeWidget />
    </>
  );
}
