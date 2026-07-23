# Curated Experiences — Marketing Strategy

*Synthesised from the Platform Blueprint v1, Tony's strategy notes (Gary Duffy sessions), brand voice guide, TNZ market research, and the implemented marketing automation system.*

*Status: Living document — updated May 2026*

---

## 1. Strategic Foundation

### 1.1 The Opportunity

Every existing competitor in luxury NZ FIT travel operates on a pre-AI model: a brochure website, a contact form, a human on email, and a PDF itinerary. The funnel is slow, expensive to staff, and dependent on whichever human picks up the enquiry.

Curated Experiences is the first luxury NZ travel operator built AI-native from day one — a structural advantage that compounds over time as competitors remain locked in legacy operating models.

### 1.2 Positioning

Curated Experiences is a **design-led travel specialist** — thoughtfully curated, personalised, seamlessly executed. Quality over volume. The emphasis is on personalised itineraries, premium experiences, and seamless execution, delivered with a high level of attention to detail.

**Credibility anchor**: PPG Tours — award-winning NZ Destination Management Company, World Travel Award winner 2025. Leverages established supplier network, operational expertise, and destination knowledge.

### 1.3 Brand Philosophy

- **Curate, don't create** — personalise experience and connection
- **Emotion before logistics** — communicate the feeling and experience of the journey, not the logistics
- **Quality signals over quantity** — 8-10 journeys maximum, presented as stories
- **The enquiry is the conversion** — no booking engine, pricing grids, or availability calendars
- **Concierge as front door** — the AI concierge is the primary CTA on every page

### 1.4 Brand Voice

The brand voice is warm, unhurried, knowledgeable, confident, and personal. Not corporate, salesy, or generic. The vocabulary explicitly avoids "tour," "package," "agent," "amazing," "awesome," "book now," "limited time," "hidden gem," and "bucket list." Maximum one exclamation mark per email; zero in concierge conversations.

---

## 2. Target Client

### 2.1 Primary Market

| Characteristic | Detail |
|---|---|
| **Geography** | United States — geo-targeted by ZIP code. High-income postcodes: Connecticut, New York, California, Florida, Massachusetts, Texas. |
| **Income / wealth signal** | $125K+ household income. Top household income deciles. Demonstrated interest in luxury goods and experiences. |
| **Travel behaviour** | Propensity to travel internationally. Preference for longer, experience-led journeys (10-14 days). Seeks nature, culture, and unique local experiences. |
| **Service expectation** | High service levels, comfort, and seamless logistics. Does not want to self-manage. Trusts a specialist to curate. |
| **NZ appeal** | Values distinctive landscapes, natural beauty, and relatively untouched environments. Wants something that feels genuinely remote and alive. |
| **Booking style** | Prefers curated and personalised travel over fixed group tours. Expects to be consulted, not catalogued. |
| **Lead time** | 4-12 months from inquiry to travel |
| **Age** | 40-60 |

### 2.2 Top Motivators

~70% each: landscapes, adventure, safety, wildlife, culture, "can't get elsewhere"

### 2.3 Geographic Clusters

States with direct NZ air routes: New York, California, Texas, Washington, Arizona

### 2.4 Key Emotional Triggers

Milford Sound, Southern Alps, Māori culture, sustainability & conservation, food & wine

### 2.5 Secondary Markets

Canada, UK — to follow once US market is established.

---

## 3. Channel Strategy

### 3.1 Channel Prioritisation

| Channel | Priority | Role | Timeline | Status |
|---|---|---|---|---|
| **Google Ads** | Primary | Paid acquisition of high-intent US travellers — immediate results while SEO builds | Launch Day 1 | Tracking configured; campaigns TBC |
| **SEO — organic search** | High | Long-term foundation. Topical authority through Journal content. | Months 1-6 to gain traction | Sitemap, schema, robots.txt live |
| **GEO — generative AI search** | High | Discoverability in ChatGPT, Perplexity, Google AI Overviews | Built in from Day 1 | Schema markup live; content seeding in progress |
| **Email nurture** | High | Convert website visitors to clients over time. 2 audience-specific sequences. | Phase 1 — Live | Implemented; cron runs daily 9am UTC |
| **Social media (Instagram/Facebook)** | Medium | Brand building and remarketing audience | Phase 1 (organic), Phase 2 (paid) | Agent configured; not yet posting |
| **Meta Ads** | Medium | Retargeting and lookalike audiences once base data exists | Phase 2 | Not started |
| **Travel advisor partnerships** | Medium | US luxury travel agents — access to HNW client bases | Phase 2-3 | Not started |
| **PR / media exposure** | Medium | Coverage in US luxury travel publications builds authority and GEO signal | Phase 2-3 | Not started |
| **Canada / UK markets** | Future | Geographic expansion once US market is operational | Phase 4+ | Not started |

### 3.2 Google Ads Strategy

#### Campaign Structure

| Campaign | Objective | Key Ad Groups |
|---|---|---|
| **Brand protection** | Own the brand | "Curated Experiences NZ", "curatedexperiences.com" |
| **Luxury NZ tours** | Primary acquisition | "luxury New Zealand tour", "bespoke NZ travel", "private New Zealand holiday for couples" |
| **South Island** | High-intent destination | "South Island luxury tour", "Queenstown private tour", "Fiordland guided experience" |
| **North Island** | Secondary destination | "North Island luxury travel", "Bay of Islands private tour" |
| **Experience-based** | Interest targeting | "New Zealand food and wine tour", "NZ fly fishing private guide" |
| **FIT / independent** | Intent-based | "New Zealand FIT travel", "independent luxury NZ holiday" |
| **Competitor conquest** | Competitive | Abercrombie & Kent NZ, Ahipara, Southern Crossings |
| **Remarketing (RLSA)** | Re-engage | Visitors who viewed tour pages but didn't enquire |

#### US Audience Targeting Layers

- **Geography**: California, New York, Connecticut, Massachusetts, Florida, Texas
- **Household income**: Top 10% bracket (Google income targeting)
- **Audience segments**: Luxury travellers, Frequent international travellers, Adventure travel enthusiasts
- **Life events**: Upcoming anniversary, Retirement
- **Device**: Desktop priority (higher booking intent). Mobile bid adjustment -20% initially.
- **Dayparting**: Increase bids during US weekday lunchtimes and evenings
- **Lookalike**: Build from converters once 30+ conversions tracked

#### Recommended Test Budget

NZD $2,000-5,000/month for first 90-day test period.

#### Current Implementation

- Google Ads tracking ID `AW-18032876556` is loaded via the `<Analytics>` component
- UTM campaign parameters captured at edge middleware and persisted as cookies (30-day expiry)
- Source classification (`google_ads` vs organic/social/direct/referral) drives hero personalization, journey recommendation, CTA tone, and concierge greeting variant
- Admin dashboard exports leads with full campaign attribution
- The SEO+Ads agent (Paperclip) is configured to monitor Google Ads performance every 6 hours

### 3.3 SEO Strategy

#### Authority Building

- Build topical authority through the Journal — one definitive guide per key destination and experience type
- Target long-tail, high-intent US queries: "luxury New Zealand private tour from US", "bespoke South Island itinerary"
- Internal linking: every Journal article links to 2-3 relevant journey pages

#### Technical SEO (Implemented)

- Dynamic `sitemap.xml` covering all static pages, journeys, destinations, and journal articles
- `robots.txt` allows all crawlers on public routes, blocks `/admin/` and `/api/`
- JSON-LD schema markup: `OrganizationSchema` (root layout), `TouristDestinationSchema`, `TravelActionSchema`, `ReviewSchema`
- Core Web Vitals compliance target

#### E-E-A-T Signals

- Author bios, team expertise, PPG Tours awards
- World Travel Awards 2026 finalist (NZ Tour Operator + NZ DMC)
- Australian trademark for "Curated Experiences"
- Qualmark, Travel Life sustainability, Tech NZ
- Client case studies and testimonials
- Cruise heritage: Silversea, Celebrity, Ponant VIP land programs

#### Backlink Targets

- NZ tourism authority sites
- US luxury travel publications
- PPG Tours domain equity transfer

### 3.4 GEO (Generative Engine Optimisation) Strategy

GEO optimises for discoverability in AI-generated answers (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot).

- Build a distinctive brand entity with consistent NAP, structured About page, and factual accuracy
- Structure all content with clear declarative facts AI can extract and cite
- Write definitive answers to questions AI search engines receive: "best luxury travel company New Zealand", "top bespoke NZ tour operators"
- FAQ sections on all key pages — AI systems extract these directly into answers
- Claim and optimise Google Business Profile and key luxury travel directories
- Rich imagery and video for balanced E-E-A-T

#### Target GEO Queries (Monitored by SEO+Ads Agent)

- "luxury new zealand travel"
- "bespoke new zealand tours"
- "new zealand luxury holiday"
- "fiordland luxury lodge"
- "new zealand wine tour"
- "curated experiences new zealand"

---

## 4. Lead Capture & Conversion

### 4.1 The Conversion Funnel

```
Visitor lands → Edge personalisation → Browse journeys → AI Concierge engagement →
Intent scoring → Lead creation → Nurture sequence → Human handoff → Proposal → Booking
```

### 4.2 Visitor Personalisation (Edge Middleware)

Before the first byte is served, Vercel Edge Middleware reads:

| Signal | Source | Personalisation Applied |
|---|---|---|
| **Geographic location** | Cloudflare geo headers | Hero variant, concierge greeting, currency context |
| **Traffic source** | UTM params / referrer | Source classification, journey recommendation, CTA tone |
| **Device & time** | User-agent + server time | Layout adaptation |
| **Return visitor** | Cookie (1-year expiry) | "Welcome back" concierge greeting |
| **UTM campaign** | URL parameters | Hero variant, featured journey, campaign attribution |

#### Personalisation Variants

| Signal | Variants |
|---|---|
| **Hero** | `adventure-us`, `culinary-us`, `luxury-us`, `international` |
| **Featured journey** | Campaign keywords map to journeys (adventure → The Expedition, wine → The Epicurean, fiordland → The Masterpiece) |
| **CTA tone** | `direct` (Google Ads traffic) vs `exploratory` (all other) |
| **Concierge greeting** | `welcome-back` (returning), `high-intent` (Google Ads), `us-visitor` (US geo), `default` |

### 4.3 AI Concierge — Conversion Engine

The concierge is the primary conversion mechanism. It is not a chatbot — it is a knowledgeable travel expert with deep NZ knowledge, a luxury brand voice, and live RAG access to every journey, destination, and FAQ in the knowledge base.

#### Conversation Flow

| Stage | AI Behaviour | Data Captured |
|---|---|---|
| **1. Warm open** | References page viewed, region, or return visit. Opens with a NZ insight — never "How can I help?" | Session context, page history |
| **2. Discovery** | Asks about the traveller's vision. One question at a time. | Interests, past travel, inspiration |
| **3. Soft qualification** | Weaves in practical questions: timing, group size, composition | Dates, group_size, composition |
| **4. RAG retrieval** | Queries vector store for matched journeys and destination content | Matched journey IDs |
| **5. Recommendation** | Recommends 1-2 journeys with narrative framing tied to visitor's input | Journey recommendation |
| **6. Budget signal** | Gentle contextual mention of investment level | budget_signal |
| **7. Intent reading** | Assesses engagement and readiness | intent_score 1-10 |
| **8a. Ready — generate brief** | Writes structured AI client brief, saves to DB, notifies Tony/Liam | Full ai_brief |
| **8b. Exploring — capture & nurture** | Offers curated NZ guide in exchange for email. Enters nurture sequence. | email |

#### Email Capture Fallback

For visitors not ready to chat, an inline email capture form is displayed: "Not ready to chat? Leave your email and we'll send you some inspiration." Collects name (optional) and email. Submitting triggers lead creation and welcome email.

### 4.4 Lead Creation & Merge Logic

When a lead is created via `POST /api/leads`:

1. **Merge check**: Finds existing concierge leads without email (same session), or leads with the same email within 2 hours
2. **On merge**: Updates existing lead with new details, boosts `intent_score` to max(existing, 6)
3. **On create**: Sets `nurture_sequence` to `"mid:pending"`, `intent_score` to 5 (with concierge context) or 3 (without)
4. **Welcome email**: Always sent via Resend after create or merge
5. **Internal notification**: Emailed to `blairdods@gmail.com` with intent label, AI brief, visitor details, and dashboard link

### 4.5 CRM Pipeline

```
new → nurturing → proposal_sent → deposit → confirmed → closed_won
                                                  → closed_lost
```

All lead activities are logged in `lead_activities` with types: `status_change`, `note`, `email_sent`, `assignment`, `score_change`, `contact_captured`, `lead_created`, `contact_updated`, `booking_created`.

---

## 5. Email Nurture Automation

### 5.1 Intent-Based Triggering

Email nurture sequences are triggered by the AI concierge's `intent_score`:

| Intent Score | Label | Sequence | Duration |
|---|---|---|---|
| 7-10 | Hot | High-Intent (5 emails) | 14 days |
| 4-6 | Warm | Mid-Intent (5 emails) | 28 days |
| 0-3 | Cold | None (organic only) | — |

### 5.2 High-Intent Sequence (5 emails, 14 days)

For leads who are actively planning and explicitly ready to connect.

| Day | Subject | Purpose |
|---|---|---|
| 0 | "Your New Zealand journey starts here" | Welcome + set expectation of 24hr human contact + feature Masterpiece journey |
| 2 | "A destination worth dreaming about" | Fiordland feature — emotional destination storytelling |
| 5 | "What our travellers say" | Social proof — real testimonial with name and city |
| 9 | "What makes Curated Experiences different" | USP: local expertise, truly bespoke, attention to detail |
| 14 | "Ready to start planning?" | Direct CTA: reply to email or chat with concierge |

### 5.3 Mid-Intent Sequence (5 emails, 28 days)

For leads who are researching and exploring but not yet ready to commit.

| Day | Subject | Purpose |
|---|---|---|
| 0 | "New Zealand — closer than you think" | Emotional hook + link to journal article |
| 4 | "Three journeys, three ways to experience NZ" | Product showcase: Masterpiece, Epicurean, Expedition |
| 10 | "Meet Tony and Liam" | Founder story — personal connection, trust building |
| 18 | "When to visit New Zealand" | Seasonal guide — practical value, reduces uncertainty |
| 28 | "Still dreaming of New Zealand?" | Gentle re-engagement — no pressure |

### 5.4 Delivery Infrastructure

- **Cron**: Vercel Cron triggers `POST /api/nurture` daily at 9:00 AM UTC
- **Auth**: Protected by `CRON_SECRET` header
- **Template source**: Reads from `email_templates` DB table first; falls back to hardcoded sequences in `lib/email/sequences.ts`
- **State tracking**: `nurture_sequence` field stores state as `"high:2"` or `"mid:3"` (sequence type + last-sent index)
- **Completion**: Sets `nurture_sequence` to `null` when sequence is finished
- **Sender**: Resend via `hello@curatedexperiences.com`
- **Templates editable** via admin UI at `/admin/settings/emails/` — changes take effect on next cron run

### 5.5 What's Missing

- No unsubscribe/preference center (placeholder `{{unsubscribe_url}}` not implemented)
- No email open or click tracking
- No A/B testing framework for subject lines or content
- No third sequence for organic/email-capture subscribers (low intent)

---

## 6. Content Marketing

### 6.1 Content Hub: The Journal

The Journal is the primary SEO and GEO engine. It is an AI-agent-powered content hub producing destination guides, travel stories, and NZ insider pieces.

### 6.2 AI Content Agent

The Content agent (Paperclip, Claude Sonnet, every 4 hours, $40-60/mo) produces:
- Journal articles (800-1,200 words, SEO-optimised)
- Email nurture copy
- Journey narratives
- Social media captions

All content is saved as `pending_approval` — Tony/Liam must approve before publishing.

### 6.3 Content Pillars

Aligned with the four brand pillars:
1. **Wild Interior** — landscapes, Fiordland, Southern Alps, remote experiences
2. **Māori Culture** — authentic cultural experiences, not decorative
3. **Food & Wine** — MICHELIN Guide 2026 hook, NZ wine regions, culinary experiences
4. **Conservation** — kaitiakitanga, sustainability, eco-lodges, wildlife

### 6.4 Key Content Topics

- Destination guides (one definitive guide per NZ region)
- Seasonal travel guides
- Journey deep-dives
- Insider NZ knowledge
- Client story / testimonial narratives
- Experience-type guides (heli, fly fishing, wine, photography)

---

## 7. AI Agent Marketing System

### 7.1 Paperclip Agent Orchestration

The AI agent OS models a company as an org chart of AI agents, each with a title, responsibilities, a monthly budget, and a heartbeat schedule. Tony and Liam are the board — they approve, review, and override.

### 7.2 Marketing Agents

| Agent | Role | Model | Cadence | Budget | Status |
|---|---|---|---|---|---|
| **CEO** | Daily brief on leads, spend, content pipeline, priorities | Haiku | Daily 7am NZT | $30-40/mo | Configured |
| **CMO** | Marketing calendar, campaign oversight, brand voice governance, KPI tracking | — | Daily | $25-35/mo | Planned (not yet built) |
| **Content** | Journal articles, email copy, journey narratives, social captions | Sonnet | Every 4h | $40-60/mo | Configured |
| **SEO+Ads** | Rank monitoring, Google Ads performance, bid recommendations, anomaly flags | Haiku | Every 6h | $20-30/mo | Configured |
| **Concierge** | Live website chat, lead qualification, brief generation, CRM record creation | Sonnet | Continuous + triggered | $20-35/mo | Live |
| **Social** | Instagram, Facebook, LinkedIn scheduling, comment monitoring, engagement reports | — | Every 8h | $15-20/mo | Planned (not yet built) |
| **Analytics** | GA4, Search Console, Ads, CRM data synthesis into actionable reports | — | Daily + weekly | $10-15/mo | Planned (not yet built) |
| **CFO** | Revenue tracking, cost-per-lead, gross margin, agent budget monitoring, monthly P&L | — | Weekly | $10-15/mo | Planned (not yet built) |

### 7.3 Governance

- Morning CEO brief surfaces priority leads and decisions needed
- Approval queue for all content before publishing
- Budget alerts at 80% and hard stops at 100% per agent per month
- Full audit trail — every tool call, prompt, and output logged with timestamp and cost
- Override capability: pause any agent, reassign any task, adjust any budget

### 7.4 Cost Comparison

AI agent fleet: ~$180-265/month in tokens. Equivalent human team: $8,000-15,000/month.

---

## 8. Analytics & Measurement

### 8.1 Tracking Infrastructure (Implemented)

- **GA4**: `NEXT_PUBLIC_GA4_ID` env var with fallback `G-XSB4LZMTX5`
- **Google Ads**: `AW-18032876556` (hardcoded)
- **UTM attribution**: Captured at edge middleware, persisted in cookies, stored in `enquiries` table
- **Lead source classification**: `google_ads`, `organic`, `social`, `direct`, `referral`
- **Custom event tracking**: `trackEvent(eventName, params)` helper available for custom GA4 events

### 8.2 Admin Analytics Dashboard (Implemented)

| Panel | Data |
|---|---|
| **Summary cards** | Total Leads, Total Revenue, Bookings, Conversion Rate |
| **Leads Over Time** | 90-day area chart |
| **Conversion Funnel** | 7-stage horizontal bar (new → nurturing → proposal → deposit → confirmed → won/lost) |
| **Revenue by Month** | Bar chart |
| **Lead Sources** | Pie/donut chart |
| **Intent Score Distribution** | Bar chart: Cold 0-3, Warm 4-6, Hot 7-10 |

### 8.3 Key Metrics

| Metric | Target | Source |
|---|---|---|
| **Inquiry-to-booking conversion** | 50% | Tony's target |
| **Cost per lead** | Tracked by CFO agent | Google Ads + CRM |
| **Cost per acquisition** | Tracked by CFO agent | Google Ads + bookings |
| **Revenue per booking** | ~$50K NZD (direct) | Bookings table |
| **Gross margin** | 35-40% (direct), ~25% (agency) | CFO agent |
| **SEO rankings** | Monitored by SEO+Ads agent every 6h | Search Console |
| **Google Ads ROAS** | Monitored by SEO+Ads agent every 6h | Google Ads API |

---

## 9. Competitive Positioning

### 9.1 Competitor Landscape

Southern Crossings is identified as the primary competitor — they have zero direct-to-consumer presence, which is CE's key advantage. Other competitors include Ahipara, Bespoke Kiwi, and Abercrombie & Kent NZ.

### 9.2 CE Differentiators

- **AI-native**: First luxury NZ operator with AI concierge as primary conversion mechanism
- **Direct-first**: Direct-to-consumer model — no intermediary
- **PPG Tours backing**: Award-winning DMC with established supplier network and operational expertise
- **World Travel Awards 2026 finalist**: NZ Tour Operator + NZ DMC categories
- **Personalisation at the edge**: Real-time content adaptation before first byte
- **24/7 concierge**: Always-on, consistent brand voice, no timezone friction

---

## 10. Launch Phasing

### Phase 1 — Foundation (Live)

- Website with 3-5 journey pages
- AI concierge with RAG knowledge base
- Edge personalisation (geo, UTM, source, device)
- Lead capture with intent scoring
- Email nurture sequences (high + mid intent)
- Internal lead notifications
- Admin dashboard (leads, analytics, email templates)
- GA4 + Google Ads tracking
- Technical SEO (sitemap, robots.txt, schema markup)
- Journal with AI-drafted content

### Phase 2 — Paid Acquisition (Current / Next)

- Google Ads campaigns live with full US targeting
- CEO + Content + SEO+Ads agents running
- Journal content publishing regularly
- Remaining journey pages (5-10 total)

### Phase 3 — Growth Channels

- Meta Ads (retargeting + lookalike)
- Social agent posting (Instagram, Facebook, LinkedIn)
- Travel advisor B2B landing page

### Phase 4 — Geographic Expansion

- Canada / UK localised campaigns
- Content adaptation for secondary markets

---

## 11. Budget Summary

| Category | Monthly Estimate | Status |
|---|---|---|
| **Platform infrastructure** | $90-120 | Live (Vercel, Supabase, Resend, Sentry) |
| **AI token spend (agents + concierge)** | $180-330 | Partially live |
| **Google Ads** | $2,000-5,000 NZD (recommended test) | TBC |
| **Meta Ads** | TBC (Phase 2) | Not started |
| **Other tools / subscriptions** | ~$100-200 | Partial |

---

## 12. Immediate Priorities

1. Launch Google Ads campaigns with full US targeting layers
2. Implement unsubscribe handling and email preference center
3. Add email open/click tracking to nurture sequences
4. Activate Content agent for regular Journal publishing
5. Build third nurture sequence for low-intent / organic subscribers
6. Start social media presence (organic Instagram + Facebook)
7. Claim and optimise Google Business Profile
8. Register with key luxury travel directories for GEO signals
9. Set up Search Console and begin rank monitoring
10. Build the CMO, Social, and Analytics agents in Paperclip

---

*This document synthesises strategy from:*
- *Curated Experiences Platform Blueprint v1 (Blair Dods, March 2026)*
- *Tony's strategy sessions with Gary Duffy, Discover Holidays (April 2026)*
- *Brand voice guide*
- *TNZ market research & knowledge base*
- *Implemented marketing automation codebase (May 2026)*
