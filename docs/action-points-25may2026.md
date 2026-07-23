# Action Points — Tony & Liam Meeting
## 25 May 2026

---

## Blair (Developer)

**Due: This weekend (before 12-day travel period)**

- [x] **System playbook** — Written at `docs/system-playbook.md`. Covers:
  - Full architecture flow: Concierge → Leads → Bookings + AI layer + mapping + campaigns
  - Emergency procedures and worst-case scenario protocols
  - CloudFlare emergency shutdown procedures (edge-level kill switch)
  - What to do if developer is unreachable
  - Restore procedures for accidentally deleted content
- [ ] **Bulk image/video optimisation** — Scale down high-resolution source files from Liam's OneDrive library; target: sharp but web-optimised sizes

**Ongoing / Pre-launch**

- [x] **Three-tier accommodation** — Standalone `accommodations` table live in Supabase. Admin page at `/admin/accommodations` with full CRUD, tier badges, region/rate fields, contracted flag. 140 properties ready to be entered.
- [x] **Stripe integration** — Code complete: payment link generation, send-to-client email, webhook auto-marks deposit paid. **Still needed**: add STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to Vercel env vars, and register curatedexperiences.com/api/stripe/webhook in Stripe dashboard.
- [x] **™ symbol** — Added to about page (philosophy + heritage sections) and homepage PPG Collective section. Footer and T&C were already correct.
- [x] **Real-time analytics dashboard** — Geo breakdown (SG/US/Other), GA4 traffic chart, conversion funnel, lead sources, CPA widget. CPA widget is manual placeholder — will be replaced with live Google Ads API data when ad accounts are connected.
- [x] **Marketing AI agent** — Live on analytics dashboard. Claude haiku analyses lead data by market, generates budget recommendations, each requires Approve/Dismiss before logging.
- [x] **GDPR/consent banners** — EU/EEA/UK/CH only. Detected via Cloudflare geo headers in middleware, cookie-based (1yr), not shown to US or Singapore visitors.
- [ ] **Payment policy T&Cs** — Once Tony/Liam decide on cooling-off period (48h vs 7 days) and deposit conditions, update Terms & Conditions template accordingly
- [ ] **Professional email setup** — Configure named addresses (e.g., tony@, liam@) instead of generic websales@ or info@

---

## Liam

- [ ] **Figma designs** — Desktop-first approach; high-value clients research on laptops; use Dev Mode for pixel-perfect developer handoff
- [ ] **Image/video library** — Continue compiling in OneDrive; check downloaded assets for embedded metadata (tags, location, categories) before manual tagging
- [ ] **Stock asset collection** — Harvest maximum relevant assets during active subscription period; cancel subscriptions after initial collection

---

## Tony / Blair

- [ ] **Site inspections** — Napier, Taupo, Rotorua (5 inspections/day over two consecutive days from 26 May)
- [ ] **Accommodation contracts** — Finalise remaining ~10% of the 140-property database

---

## Decisions Still Open

| Question | Options | Owner |
|---|---|---|
| Cooling-off / refund policy | 48-hour vs 7-day cooling-off; when deposits become non-refundable | Tony |
| Professional email addresses | Named personal addresses vs role-based | Tony/Liam |
| US trademark | Register now (complex/expensive) or defer to expansion phase | Tony |
| Marketing budget split | NZD ~2,500 initial; monitor SG vs NA for 1–2 weeks then reallocate | Tony/Blair |
| Keyword strategy | Competitor brand capture (cautious) vs high-intent luxury terms only | Tony/Blair |

---

## Key Decisions Made at This Meeting

- **Singapore-first** — Test SG market before NA; less saturated, higher spend per capita, observed demand at lodges
- **Three-tier accommodation** — Platinum / Gold / Silver to manage price sensitivity without sacrificing premium positioning
- **Stripe for instant deposit capture** — "Strike while the iron's hot" conversion approach
- **No newsletter pop-ups** — Prioritise concierge engagement over email capture; reduce friction
- **Desktop-first design** — High-value customers research on laptops
- **GDPR banners only where legally required** — Avoid distracting from primary CTA

---

## Target Go-Live: End of June 2026
