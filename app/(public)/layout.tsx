import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { ConciergeWidget } from "@/components/concierge/concierge-widget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-16 sm:pt-20">{children}</main>
      <Footer />
      <ConciergeWidget />
    </>
  );
}
