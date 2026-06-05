import { Section } from "@/components/ui/section";

export const metadata = {
  title: "Terms & Conditions | Curated Experiences",
  description:
    "Booking terms and conditions for Curated Experiences — bespoke luxury travel across New Zealand.",
};

const EFFECTIVE_DATE = "1 June 2026";
const COMPANY_NAME = "Curated Experiences™";
const LEGAL_ENTITY = "PPG Tours Limited";
const REGISTERED_COUNTRY = "New Zealand";
const EMAIL = "enquiries@curatedexperiences.com";
const PHONE = "0800 287 283";

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-navy text-cream pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase font-medium text-gold mb-5">
            Legal
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight leading-tight">
            Terms &amp; Conditions
          </h1>
          <div className="mt-6 h-px w-10 bg-gold" />
          <p className="mt-7 text-cream/60 text-sm leading-relaxed">
            Effective {EFFECTIVE_DATE}. Please read these terms carefully before
            making a booking with us.
          </p>
        </div>
      </div>

      {/* Body */}
      <Section narrow>
        <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-12">

          {/* 1 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              1. About These Terms
            </h2>
            <p>
              These Terms and Conditions govern all bookings made with{" "}
              {COMPANY_NAME}, a trading name of {LEGAL_ENTITY}, a company
              registered in {REGISTERED_COUNTRY}. By making a booking with us —
              whether by phone, email, or through our website — you agree to
              be bound by these terms on behalf of yourself and all members of
              your travelling party.
            </p>
            <p className="mt-4">
              References to &ldquo;we&rdquo;, &ldquo;us&rdquo;, and
              &ldquo;our&rdquo; mean {COMPANY_NAME}. References to
              &ldquo;you&rdquo; mean the lead booker and all members of your
              party.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              2. Your Booking
            </h2>
            <p>
              A booking is confirmed once we have received your deposit (see
              Section 4) and issued a written Booking Confirmation. Until that
              point, any itinerary, pricing, or availability we share with you
              is provisional and subject to change.
            </p>
            <p className="mt-4">
              The lead booker is responsible for ensuring that all members of
              the travelling party are aware of and agree to these terms, and
              for the accuracy of all personal information provided to us.
            </p>
            <p className="mt-4">
              We reserve the right to decline a booking at our discretion,
              in which case any deposit received will be refunded in full.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              3. Pricing &amp; Currency
            </h2>
            <p>
              All prices are quoted in New Zealand Dollars (NZD) unless
              otherwise stated in your written proposal. Prices are based on
              costs, exchange rates, and supplier tariffs current at the time
              of quotation.
            </p>
            <p className="mt-4">
              We reserve the right to pass on any price increases from our
              suppliers or significant adverse exchange rate movements prior to
              full payment being received. We will notify you as soon as
              possible if any such increase applies to your booking.
            </p>
            <p className="mt-4">
              Once full payment has been received, the price of your journey
              is guaranteed, except in the case of government-imposed taxes,
              levies, or fuel surcharges outside our control.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              4. Deposit &amp; Payment
            </h2>
            <p>
              To confirm a booking, a deposit of <strong>25% of the total journey
              price</strong> is required. The deposit is non-refundable except where
              we are required to cancel your journey (see Section 6).
            </p>
            <p className="mt-4">
              <strong>Final payment</strong> of the remaining balance is due{" "}
              <strong>90 days before your departure date</strong>. For bookings
              made within 90 days of departure, full payment is required at the
              time of booking.
            </p>
            <p className="mt-4">
              If final payment is not received by the due date, we reserve the
              right to treat the booking as cancelled and apply the cancellation
              charges set out in Section 5.
            </p>
            <p className="mt-4">
              Payment may be made by bank transfer or by arrangement with our
              team. Details will be provided in your Booking Confirmation.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              5. Cancellation by You
            </h2>
            <p>
              All cancellations must be made in writing to{" "}
              <a href={`mailto:${EMAIL}`} className="text-gold underline">
                {EMAIL}
              </a>
              . Cancellation takes effect on the date we receive your written
              notice. The following charges apply, calculated as a percentage
              of the total journey price:
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone/50">
                    <th className="text-left py-3 pr-8 font-medium text-navy tracking-wide">
                      Notice period before departure
                    </th>
                    <th className="text-left py-3 font-medium text-navy tracking-wide">
                      Cancellation charge
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone/30">
                  {[
                    ["91 days or more", "Deposit only (25%)"],
                    ["61 – 90 days", "50% of total journey price"],
                    ["31 – 60 days", "75% of total journey price"],
                    ["30 days or fewer", "100% of total journey price"],
                  ].map(([period, charge]) => (
                    <tr key={period}>
                      <td className="py-3 pr-8 text-foreground/70">{period}</td>
                      <td className="py-3 text-foreground/70">{charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6">
              Some suppliers (particularly lodges, helicopter operators, and
              charter services) may apply their own cancellation terms, which
              can be more restrictive than those above. We will advise you of
              any such terms at the time of booking.
            </p>
            <p className="mt-4">
              We strongly recommend taking out comprehensive travel insurance
              that includes cancellation cover (see Section 9).
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              6. Changes or Cancellation by Us
            </h2>
            <p>
              We plan every journey with great care, but occasionally
              circumstances beyond our control require us to make changes.
            </p>
            <p className="mt-4">
              <strong>Minor changes</strong> — such as substituting an
              equivalent lodge, adjusting activity timing, or reordering
              itinerary days — may be made without liability on our part. We
              will always notify you as soon as possible and endeavour to
              maintain the spirit and quality of your original programme.
            </p>
            <p className="mt-4">
              <strong>Significant changes</strong> — such as a change to the
              main destination regions or a material reduction in the quality
              of accommodation — will be notified to you in writing. You will
              then have the option to accept the revised journey, accept an
              alternative journey of comparable value, or cancel with a full
              refund.
            </p>
            <p className="mt-4">
              In the unlikely event that we must cancel your journey due to
              circumstances within our control, you will receive a full refund
              of all payments made to us. We will not be liable for any further
              costs or compensation beyond this refund.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              7. Changes Requested by You
            </h2>
            <p>
              We understand that plans evolve. We will do our best to
              accommodate any changes you request after a booking is confirmed,
              subject to supplier availability. An administration fee of NZD
              $150 per change may apply, in addition to any costs imposed by
              suppliers.
            </p>
            <p className="mt-4">
              Changes that significantly alter the nature of your journey may
              be treated as a cancellation and rebooking, in which case the
              cancellation charges in Section 5 may apply.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              8. Force Majeure
            </h2>
            <p>
              We will not be liable for any failure to perform, or delay in
              performing, our obligations where such failure or delay results
              from circumstances beyond our reasonable control. This includes,
              but is not limited to: natural disasters, extreme weather,
              pandemic or public health events, civil unrest, acts of
              terrorism, government action, or industrial disputes.
            </p>
            <p className="mt-4">
              In such circumstances, we will use all reasonable endeavours to
              offer alternative arrangements or, where this is not possible,
              provide a refund of recoverable amounts from our suppliers. We
              will not be responsible for any additional costs you incur, such
              as airfares or accommodation, as a result of a force majeure
              event — which is another reason comprehensive travel insurance is
              essential.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              9. Travel Insurance
            </h2>
            <p>
              Comprehensive travel insurance is a <strong>condition of booking</strong>{" "}
              with Curated Experiences. Your policy must include, as a minimum:
            </p>
            <ul className="mt-4 space-y-2 list-disc list-inside text-foreground/70">
              <li>Trip cancellation and curtailment</li>
              <li>Emergency medical expenses and evacuation</li>
              <li>Baggage and personal effects</li>
              <li>Personal liability</li>
            </ul>
            <p className="mt-4">
              We recommend taking out insurance at the time of paying your
              deposit so that cancellation cover begins immediately. We are
              happy to recommend insurance providers if you require guidance.
            </p>
            <p className="mt-4">
              We will not be responsible for any costs you incur as a result
              of failing to hold adequate travel insurance.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              10. Passports, Visas &amp; Health Requirements
            </h2>
            <p>
              It is your responsibility to ensure that all members of your
              party hold valid passports (with at least six months' validity
              beyond your return date) and any visas or travel authorisations
              required to enter New Zealand and any other countries visited
              during your journey.
            </p>
            <p className="mt-4">
              We are not responsible for any costs, losses, or disruption
              arising from failure to obtain the correct travel documents. We
              recommend checking with the relevant embassy or consulate well in
              advance of travel.
            </p>
            <p className="mt-4">
              You are also responsible for ensuring you meet any health or
              vaccination requirements applicable to your destination. Please
              consult your doctor or a travel health clinic before travel.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              11. Our Responsibilities &amp; Liability
            </h2>
            <p>
              We act as a principal in arranging your journey and take
              responsibility for the overall quality and delivery of the
              programme we design for you. We will always endeavour to deliver
              your journey as described and to the standard you expect.
            </p>
            <p className="mt-4">
              Our liability to you is limited to the total cost of your
              journey as paid to us. We are not liable for any indirect or
              consequential loss, including but not limited to lost profits,
              loss of enjoyment, or costs arising from delays or changes to
              your travel arrangements caused by third-party suppliers, force
              majeure events, or circumstances outside our reasonable control.
            </p>
            <p className="mt-4">
              Nothing in these terms limits our liability for death, personal
              injury, or fraud caused by our negligence, or for any other
              liability that cannot lawfully be excluded.
            </p>
            <p className="mt-4">
              Where you purchase services directly from third-party suppliers
              (such as optional activities booked locally), those suppliers are
              solely responsible for the delivery of those services.
            </p>
          </div>

          {/* 12 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              12. Your Responsibilities
            </h2>
            <p>
              You are responsible for the behaviour of all members of your
              travelling party. We and our suppliers reserve the right to
              terminate a journey without refund if any member of your party
              behaves in a way that is disruptive, dangerous, or harmful to
              others.
            </p>
            <p className="mt-4">
              Please inform us at the time of booking of any medical
              conditions, mobility requirements, dietary needs, or other
              circumstances that may affect your journey. We will do our best
              to accommodate your needs, but cannot guarantee that all
              requests can be fulfilled.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              13. Privacy
            </h2>
            <p>
              We collect and hold personal information about you to facilitate
              your booking and to deliver the services you have requested. We
              will not sell or share your personal information with third
              parties except where necessary to deliver your journey (for
              example, providing your details to lodges, transport providers,
              and activity operators).
            </p>
            <p className="mt-4">
              We comply with the New Zealand Privacy Act 2020. You have the
              right to access and correct any personal information we hold
              about you. To make a request, please contact us at{" "}
              <a href={`mailto:${EMAIL}`} className="text-gold underline">
                {EMAIL}
              </a>
              .
            </p>
          </div>

          {/* 14 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              14. Intellectual Property
            </h2>
            <p>
              Curated Experiences&trade; is a registered trademark in Australia
              and New Zealand. All itineraries, proposals, content, and
              materials produced by us remain our intellectual property and may
              not be reproduced or shared without our written consent.
            </p>
          </div>

          {/* 15 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              15. Complaints
            </h2>
            <p>
              If something is not right during your journey, please contact
              your travel curator immediately so we have the opportunity to
              resolve the issue on the ground. Issues raised after your return
              that were not raised during travel may be more difficult to
              address.
            </p>
            <p className="mt-4">
              If you wish to make a formal complaint after your return, please
              write to us at{" "}
              <a href={`mailto:${EMAIL}`} className="text-gold underline">
                {EMAIL}
              </a>{" "}
              within 28 days of your return date. We will acknowledge your
              complaint within 5 business days and aim to resolve it within 28
              days.
            </p>
          </div>

          {/* 16 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              16. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of New Zealand. Any dispute
              arising in connection with a booking will be subject to the
              exclusive jurisdiction of the New Zealand courts.
            </p>
            <p className="mt-4">
              Nothing in these terms affects any rights you may have under the
              New Zealand Consumer Guarantees Act 1993 or the Fair Trading Act
              1986 where those rights cannot lawfully be excluded.
            </p>
          </div>

          {/* 17 */}
          <div>
            <h2 className="font-serif text-2xl text-navy tracking-tight mb-4">
              17. Contact Us
            </h2>
            <p>
              If you have any questions about these terms, please get in touch:
            </p>
            <div className="mt-4 space-y-1 text-foreground/70">
              <p>
                <strong className="text-navy font-medium">
                  {COMPANY_NAME}
                </strong>
              </p>
              <p>A venture of {LEGAL_ENTITY}</p>
              <p>
                Email:{" "}
                <a href={`mailto:${EMAIL}`} className="text-gold underline">
                  {EMAIL}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="text-gold underline">
                  {PHONE}
                </a>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="border-t border-stone/40 pt-8">
            <p className="text-xs text-foreground/50 leading-relaxed">
              These terms were last updated on {EFFECTIVE_DATE}. We may update
              these terms from time to time. The version in effect at the time
              your booking is confirmed will apply to your journey.
            </p>
          </div>

        </div>
      </Section>
    </>
  );
}
