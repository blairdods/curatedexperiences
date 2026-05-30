# Curated Experiences — Review & Plan
## Tony & Liam Meeting — Sunday 10 May 2026, 10:30am NZT

*Prepared by Blair Dods | Incorporates: Tony's April voice notes (Gary Duffy sessions), Liam's A&K benchmark analysis (May 5), Tony's meeting agenda (May 7), costing sheet thread, all commits, architecture docs, and progress trackers.*

---

## 1. Executive Summary

The Curated Experiences platform has moved from blueprint to working product. All four layers — public website, AI concierge, admin dashboard, and data/knowledge layer — are built, deployed, and functional at `curatedexperiences.vercel.app`. The last 8 weeks have been the most productive phase: the admin dashboard reached Phase 2 (RBAC, audit trails, Kanban, email templates), the journal content system went live with 19 SEO-optimised articles, a tour costing module was built with modular line-item calculations, and every action item from Tony's April voice notes was implemented on the site.

We are now in the **pre-launch phase**. The technical platform is ready. What stands between us and going live is primarily operational readiness — contracts, real images, a custom domain, Google Ads activation, and final review.

**Launch timing**: Tony has indicated "later in June" — noting they have meetings in Vancouver June 17-18. This gives us approximately 6 weeks from now to complete the critical path items.

**Tony, May 7**: *"This project is most exciting and it is amazing the collective development and knowledge that has evolved in less than 2 months!!!"*

**Immediate actions from this week's emails**:
- Domain: `curatedexperiences.com` was removed from Cloudflare (incomplete nameserver setup) — needs re-adding
- Security: Supabase flagged RLS warning on a public table — needs investigation (likely intentional for specific tables, but must verify)

---

## 2. What We've Built

### 2.1 Layer 1 — Public Website

**Homepage** (`/`)
- Personalised hero with 4 geo/source-based variants — subtitle, hero image, and featured journey all change per visitor:

| Hero Variant | Trigger Condition | Subtitle | Featured Journey |
|---|---|---|---|
| `luxury-us` | US visitor, no ad campaign (default for all US organic/direct traffic) | "Where world-class luxury meets untouched wilderness. Your personal curator awaits." | The Masterpiece |
| `adventure-us` | US + Google Ads with "adventure" campaign tag | "Glacier heli-hikes, canyon jet boats, and starlit skies — extraordinary experiences, designed for you." | The Expedition |
| `culinary-us` | US + Google Ads with "wine" or "culinary" campaign tag | "From Marlborough's world-famous vineyards to MICHELIN-recognised restaurants — a culinary journey like no other." | The Epicurean |
| `international` | Non-US visitor (any source) | "Curated Experiences for the discerning traveller. From glacial peaks to private vineyards..." | The Masterpiece |

> **Important**: Variant detection relies on UTM campaign parameters from paid ads. Organic/direct traffic cannot express interest signals (wine vs. adventure), so all US organic visitors default to `luxury-us` → The Masterpiece. The "California wine country creative" description used in strategy discussions refers to the `culinary-us` variant's target persona — it only activates for paid ads with matching campaign tags, not for organic California traffic. State-level geo is not available from edge headers.

- Hero video background (Alpine Lodge helicopter landing) with fallback image per variant
- Trust strip with World Travel Awards, PPG Tours, Rosewood logos
- Profile-matched journey cards (featured journey pinned to first position, rest follow)
- Journal teaser section
- "Why This Matters" section with DMC logistics and private fleet copy
- "Curated Difference" section positioned after journeys
- Absolute Privacy & Secure Logistics messaging

**Journeys** (`/journeys`, `/journeys/[slug]`)
- 6 journeys: The Masterpiece (15-day Rosewood flagship), The Epicurean (10-day wine & culinary), The Expedition (12-day adventure), The Discovery (15-day all-regions classic), The Hidden Trail (15-day hidden gems), The Southern Heart (12-day South Island deep dive)
- Day-by-day accordion itinerary
- Interactive Mapbox route maps
- Sticky CTA ("Start Planning") on every page
- All taglines and copy updated per Tony/Liam content (March 26 & April 4 batches)

**Destinations** (`/destinations`, `/destinations/[region]`)
- 4 NZ regions with editorial content and related journeys

**Journal** (`/journal`, `/journal/[slug]`)
- 19 MDX articles covering: luxury lodges (Huka, Rosewood trio, Minaret Station), Māori culture (manaakitanga, kaitiakitanga, genuine cultural experiences), food & wine (Central Otago pinot, NZ wine beyond sauvignon blanc, seafood), wildlife, Great Walks, Southern Alps, volcanic plateau, when to visit, modular design philosophy, Milford Sound, and positioning NZ as an underrated luxury destination
- All bylined "The Curated Experiences Team"
- Full MDX infrastructure with rich rendering

**Supporting Pages**
- About page with team bios, philosophy, PPG Tours credentials, cruise line heritage
- Stories page with 3 narrative testimonials
- Contact modal (replaced all mailto links)

**SEO & Analytics**
- Dynamic sitemap.xml, robots.txt
- JSON-LD structured data (Organization, TouristTrip, TouristDestination)
- OG/Twitter meta tags
- GA4 tag (G-XSB4LZMTX5)
- Google Ads tag (AW-18032876556)
- Performance: next/image optimization throughout

**Design System**
- Fonts: Playfair Display (headings) + Inter (body)
- Brand colours: navy #1F3864, warm neutrals (#faf9f7 → #d4c5b5), gold accent #b8860b
- Logo on navigation, footer, admin sidebar, and login page
- TM symbol where appropriate
- Pure Tailwind — no UI library dependency

### 2.2 Layer 2 — AI Concierge (Flagship Feature)

**Backend** (`app/api/concierge/route.ts`)
- Streaming Claude API (claude-sonnet-4-6) with RAG augmentation
- 8-layer system prompt:
  1. Identity — "Our CE Curators" brand persona
  2. Brand voice — warm, unhurried, knowledgeable, confident, personal
  3. Constraints — no pricing, no availability, no bookings, don't over-promise
  4. RAG context — vector search results from content (5) + tours (3) in parallel
  5. Visitor context — geo, device, source, UTM, returning status
  6. Qualification goal — gently collect name, timing, party size, interests, budget range
  7. Brief extraction — structured JSON embedded in conversation
  8. Human off-ramp — always offer to connect with a human curator
- Brief auto-saves to Supabase `enquiries` table
- Email notification to Tony/Liam via Resend on every qualified brief
- Rate limiting: 20 req/IP/hour, per-session token budgets (50k in / 20k out)

**Frontend** (`components/concierge/`)
- Streaming chat UI with rAF-batched rendering
- Session persistence via sessionStorage
- Trigger system: 45s timer (journey pages), exit intent (high-value pages), CTA clicks
- Soft inline email capture after 3 messages
- Brief content stripped from displayed messages
- `ce:open-concierge` custom event for external CTA buttons
- Session dismissed state (prevents re-triggering)

**April Voice Note Updates Applied**
- Human fallback always offered at any stage ("talk to a human" / "we'll call you")
- Aspirational TNZ-aligned questions added to prompts:
  - "Do you want to experience genuine NZ culture?"
  - "Do you want to escape somewhere truly out of the ordinary?"
  - "Are you drawn to amazing wildlife encounters?"
  - "Is feeling safe and looked after important to you?"
- Safety messaging woven in (70% of US considerers cite it as motivator)
- Local cuisine used as conversation starter

### 2.3 Layer 3 — Admin Dashboard

**Authentication & Access**
- Magic link email authentication
- RBAC (admin, editor, viewer roles)
- Audit trails on all mutations
- Blair seeded as admin

**CRM** (`/admin/leads`)
- Leads table with filters (status, source, date range, search)
- Lead detail view: contact info (editable), conversation history, activity timeline
- Add notes, update status, assign to team members
- Auto-create booking from lead on deposit
- Bulk actions (status change, assign, export)
- CSV exports
- Merge duplicate leads (concierge brief + email capture → one record)

**Booking Management** (`/admin/bookings`)
- Drag-and-drop Kanban board (inquiry → deposit → planning → in progress → completed → cancelled)
- Booking detail with all lead context
- Status flow: deposit → planning → in progress → completed
- Booking detail with editable fields

**Tour Costing Module** (`/admin/bookings/[id]` — NEW)
- Template/section/line-item builder
- Per-person-per-day calculations
- Auto-calculations for totals, margins, per-person rates
- Modular cost components: accommodation, transport, activities, heli, guides, internal flights
- Sync to Supabase
- Summary card with cost breakdown

**Content Management** (`/admin/content`)
- Content queue with approval workflow
- Version history with restore capability
- Content editor for journal articles and pages

**Journey Management** (`/admin/journeys`)
- Journey list with status
- Journey editor with day-by-day itinerary builder
- Availability toggles

**Settings** (`/admin/settings`)
- Brand voice editor
- Email template manager
- Team member manager
- Settings key-value store

**Other Admin Pages**
- Analytics dashboard (`/admin/analytics`)
- Audit log viewer (`/admin/audit`)
- Database explorer (`/admin/database`)
- CEO brief viewer (Paperclip agent output)

### 2.4 Layer 4 — Data & Knowledge

- **Database**: Supabase Postgres with pgvector extension
- **Embedding model**: gte-small (384 dimensions) via Supabase Edge Function
- **Indexes**: HNSW for fast approximate nearest neighbour search
- **RPC functions**: `match_content()`, `match_tours()` for cosine similarity
- **Content embedded**: 121 TNZ research records from 5 sources
- **Edge Function**: `embed` — text mode + batch record mode
- **Migrations**: 21 applied (initial schema → GA4 analytics)

### 2.5 Email & Nurture Automation

- **Resend integration**: React Email templates with brand layout
- **Welcome email**: triggered on email capture
- **Lead notification**: emailed to Tony/Liam on concierge brief
- **Nurture sequences**:
  - High-intent: 5 emails over 14 days
  - Mid-intent: 5 emails over 28 days
- **Vercel Cron**: daily processing at 9am UTC (`/api/nurture`)
- **CRON_SECRET** configured for secure cron invocation

### 2.6 Personalisation Engine

**Edge Middleware** (`middleware.ts`)
- Runs on every request (excluding static assets)
- Extracts: geo (country, city), traffic source (google_ads / organic / social / direct / referral), device type, UTM params, returning visitor flag
- Sets `ce-signals` JSON cookie (30-day expiry) with all derived variants
- Sets `ce-visitor` flag cookie (365-day expiry) for returning visitor detection
- Persists `ce-utm-campaign` and `ce-utm-source` cookies (30-day) for attribution

**Signal → Variant Derivation** (`lib/personalisation/signals.ts`)

*Hero Variant (`heroVariant`)*:
| Signal | Variant |
|---|---|
| Non-US country | `international` |
| US + Google Ads + campaign includes "adventure" | `adventure-us` |
| US + Google Ads + campaign includes "wine" or "culinary" | `culinary-us` |
| US (all other — organic, direct, social, referral, or ads without matching campaign tag) | `luxury-us` (default) |

*Featured Journey (`featuredJourney`)*:
| Signal | Journey |
|---|---|
| Campaign includes "adventure" or "wilderness" | `the-expedition` |
| Campaign includes "wine" or "culinary" | `the-epicurean` |
| Campaign includes "fiordland" or "south-island" | `the-masterpiece` |
| All other (including organic/direct) | `the-masterpiece` (default) |

*CTA Tone (`ctaTone`)*:
| Signal | Tone |
|---|---|
| Google Ads | `direct` |
| All other sources | `exploratory` |

> Note: Both tones currently render "Begin Your Journey" — the distinction is available for future A/B testing of CTA copy.

*Concierge Variant (`conciergeVariant`)* — controls the concierge's opening message:
| Signal | Variant | Opening behaviour |
|---|---|---|
| Returning visitor (`ce-visitor` cookie present) | `welcome-back` | "Welcome back" tone, references previous visit |
| Google Ads traffic | `high-intent` | More direct, conversion-oriented opening |
| US visitor, first time | `us-visitor` | US-tailored opening with cultural bridges |
| Non-US or unknown, first time | `default` | Generic warm welcome |

**Client-Side Consumption** (`lib/personalisation/use-signals.ts`)
- Reads `ce-signals` cookie on mount
- Falls back to `luxury-us` / `the-masterpiece` / `exploratory` defaults if cookie is missing
- Powers `HomePage` component in `app/(public)/home-client.tsx`

### 2.7 Paperclip AI Agents (Governed)

Four agents configured with system prompts, budgets, and heartbeats:
- **CEO Agent**: strategic oversight, briefs, priorities
- **Content Agent**: article generation aligned with SEO strategy
- **SEO+Ads Agent**: search console monitoring, ad optimization
- **Concierge Agent**: conversation quality monitoring

---

## 2.8 Liam's A&K Benchmark & the Modular Vision (New — May 5)

Liam analysed the Abercrombie & Kent New Zealand digital experience (built by King & Partners, a top-tier luxury agency) as a primary benchmark. Key observations and questions:

**What A&K Does Well:**
- **Itinerary Refiner**: Once an itinerary is selected, users can toggle the number of days in each location and select from a curated list of activities. This is modular customization within a controlled framework.
- **"Quiet Luxury" aesthetic**: Extreme typographic discipline and white space. Avoids standard transactional elements in favour of a sophisticated editorial layout. Functions as a high-end magazine first, a travel company second.
- **Dynamic modular "Experiences" per destination**: A reference for how we can build scalable but bespoke front-end experiences.

**Liam's Question**: *"Do you think something similar to this is achievable for us? Specifically regarding the modular itinerary logic built into the website along with the feel."*

**Our Status Against This Benchmark:**

| A&K Feature | Our Current State | Gap |
|---|---|---|
| Editorial magazine aesthetic | Strong — Playfair/Inter fonts, warm neutrals, journal system with 19 articles | Could refine typographic discipline and white space |
| Itinerary refiner (toggle days/activities) | Day-by-day accordion (static) | We don't yet have interactive "choose your own days" — this is the modular itinerary refiner Liam is asking about |
| Dynamic modular experiences | Journey detail pages with fixed itineraries | Freedom of choice menu is on the roadmap but not built |
| "Quiet Luxury" feel | Brand voice and design system aligned | Could push harder on minimalism — less text density, more breathing room |

**Technical Assessment**: An A&K-style itinerary refiner is absolutely achievable. It requires:
1. A data model for modular itinerary segments (locations, accommodation options, activity menus per location) — our costing module already models this structure
2. A front-end component that lets users toggle days and select from curated activity lists — this would be a new build
3. Integration with the concierge so the user's selections feed into the brief

This is a strong candidate for a post-launch Phase 2 feature. The costing module already provides the backend data structure for this.

**Image Progress**: Liam has found "lesser known websites with great stock quality, affordable prices, and less generic" options for hero videos and signature itinerary images. He's also reviewing iStock/Shutterstock monthly subscriptions and Alamy image packs (as recommended by Gary Duffy).

**Costing Sheet**: Liam has prepared a draft template based on Gary Duffy's model (Discover Holidays/CanadaByDesign.com). The structure covers per-person-per-day with modular components. Tony wants it "integrated much more and modulated based on location modules with accommodation options, a pricing sheet linked to the main costing sheet, dates, accommodation options, excursions (freedom of choice menu), and other add-ons." This is the foundation for the backend costing database.

---

## 3. How Everything Works Together

### The Full Client Journey

```
US visitor searches "luxury New Zealand travel"
          │
          ▼
    Lands on curatedexperiences.com
          │
          ▼
Edge middleware detects: US, desktop, Google organic
    → Hero variant: luxury-us (default for US organic)
    → Featured journey: The Masterpiece
    → Concierge variant: us-visitor
    → CTA tone: exploratory

    Note: The "California wine country creative" (culinary-us
    variant → The Epicurean) only activates for paid Google Ads
    traffic with "wine" or "culinary" campaign tags. Organic
    traffic cannot express interest signals without state-level
    geo or explicit intent data. See Section 2.6 for full
    signal-to-variant mapping.
          │
          ▼
Visitor browses journeys, reads journal articles
    → Every page has "Start Planning" CTA
    → 45s on a journey page → concierge slides in
    → Exit intent detected → concierge offers help
          │
          ▼
Visitor clicks "Start Planning" → Concierge opens
    "Kia ora — I'm your travel curator. Tell me about the
     trip you're imagining, and I'll design something
     extraordinary for you."
          │
          ▼
AI Concierge conversation:
    • Asks aspirational questions
    • Answers with RAG-augmented knowledge (real lodge details,
      real destination knowledge from vector store)
    • After 3 messages → soft email capture
    • Gently qualifies: name, timing, party size, interests,
      budget range
    • Always offers: "Would you like me to have one of our
      curators call you?"
    • Extracts structured brief behind the scenes
          │
          ▼
When visitor gives email or brief is complete:
    • Brief saved to Supabase enquiries table
    • Resend emails Tony/Liam with full brief
    • Welcome email sent to visitor
    • Visitor enters nurture sequence
          │
          ▼
Admin dashboard:
    • Tony/Liam see new lead in CRM
    • Review conversation transcript
    • Assign to travel designer
    • Create booking → moves to Kanban
    • Build itinerary using costing module
    • Send proposal (future: automated PDF)
          │
          ▼
Nurture continues:
    • Week  1: Personal email from designer
    • Month 1: "What's happening in NZ this season"
    • Month 3: Curated content based on stated interests
    • Month 6: Personal check-in + seasonal availability
          │
          ▼
Client books → Booking moves through Kanban:
    deposit → planning → in progress → completed
          │
          ▼
Post-trip:
    • Survey gathers feedback (future)
    • Referral request
    • Client becomes word-of-mouth advocate
```

### The AI Operating System

```
24/7 AGENT FLEET
├── CEO Agent: Reviews metrics, writes strategic briefs
├── Content Agent: Generates journal articles, optimises for SEO
├── SEO+Ads Agent: Monitors Search Console, adjusts ad strategy
└── Concierge Agent: Reviews conversation quality, suggests prompt improvements

PAPERCLIP CONTROL PLANE
├── Agent governance: budgets, heartbeats, approval gates
├── Task assignment and tracking
└── Human-in-the-loop for content approval

DATA FLOW
Content DB → Vector Embeddings → RAG Context
    → Concierge conversations → Briefs → Enquiries table
    → Journal articles → SEO discovery → Organic traffic
    → Nurture emails → Re-engagement → Conversions
```

### Technical Architecture

```
VERCEL (Next.js 16, React 19)
├── Edge Middleware (personalisation signals)
├── SSR/SSG Pages (journeys, destinations, journal)
├── API Routes (concierge, leads, nurture, admin)
└── Cron Jobs (daily nurture processing)

SUPABASE (Postgres + pgvector)
├── Tables: tours, enquiries, content, bookings, agent_outputs, settings, etc.
├── Vector search: match_content(), match_tours()
├── Edge Function: embed (gte-small, 384 dims)
├── Auth: magic link for admin
└── Storage: images, documents

EXTERNAL SERVICES
├── Claude API (concierge conversations + agent reasoning)
├── Resend (transactional + nurture emails)
├── GA4 + Google Ads (analytics + acquisition)
├── Mapbox (journey route maps)
└── Paperclip (agent governance)
```

---

## 4. Demo Plan

### Pre-Demo Setup (5 min before)
- [ ] Deploy latest commit to Vercel (auto-deploys from main)
- [ ] Verify concierge is responding (send a test message)
- [ ] Verify admin dashboard loads and magic link works
- [ ] Open 3 tabs: public site, concierge (mid-conversation), admin dashboard
- [ ] Have journal articles page ready to show
- [ ] Have costing module ready on a test booking

### Demo Flow (30 min)

**Part 1: The Visitor Experience (10 min)**

1. **Landing page** — Show the homepage
   - Hero video playing
   - Trust strip with World Travel Awards
   - Journey cards below the fold
   - "Start Planning" CTAs throughout
   - Journal teaser at bottom

2. **Browse journeys** — Click into "The Masterpiece"
   - Day-by-day accordion
   - Mapbox route map
   - Sticky CTA follows scroll
   - Note: no pricing grids, no booking engine — "Start Planning" is the call to action

3. **Journal content** — Show 2-3 articles
   - Lodge comparison (Kauri Cliffs / Cape Kidnappers / Matakauri)
   - Māori culture article
   - When to visit NZ
   - Explain: these are SEO-optimised, AI-generated content that builds topical authority

4. **The Concierge engages** — Either:
   - Wait 45 seconds on a journey page (auto-trigger), OR
   - Click "Start Planning" (manual trigger)
   - Live demo a conversation:
     - Concierge introduces itself in brand voice
     - Ask about interests → concierge recommends relevant journey
     - Ask about lodges → concierge answers with real knowledge (RAG from vector store)
     - Concierge asks aspirational questions
     - After 3 messages → soft email capture appears
     - Show: "Would you like to talk to a human curator?" is always available

**Part 2: Behind the Scenes (10 min)**

5. **What just happened** — Switch to admin dashboard
   - Show the new lead in the CRM
   - Lead detail: full conversation transcript, extracted brief, contact info
   - Activity timeline with every interaction logged
   - Email notification that Tony/Liam received

6. **Booking workflow**
   - Create a booking from the lead
   - Show Kanban board: drag from inquiry → deposit → planning
   - Open booking detail

7. **Costing Module** — The newest feature
   - Show template/section/line-item structure
   - Per-person-per-day breakdown
   - Auto-calculations for margins and totals
   - Explain: this is built for the modular approach Tony described

8. **Content Management**
   - Show content queue with approval workflow
   - Demonstrate editing a journal article
   - Version history with restore

**Part 3: The Full Picture (10 min)**

9. **Email nurture** — Show an example nurture email template
   - Explain the 2 sequences (high-intent, mid-intent)
   - Daily cron processes the queue automatically

10. **Paperclip Agents** — Show the agent dashboard
    - CEO brief output
    - Content agent articles pending approval
    - Explain: these run 24/7, governed, with human approval gates

11. **Walk the remaining items** — Use Section 5 below
    - What's done vs. what's left
    - What Tony & Liam need to provide
    - Timeline to launch

---

## 5. What's Remaining

### 5.1 Critical Path — Must Complete Before Launch

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | **Real imagery** — Replace all Unsplash photos with TNZ Visual Library / Tony's photography | Tony | Waiting |
| 2 | **Custom domain** — `curatedexperiences.com` → Vercel | Tony/Liam | DNS update needed |
| 3 | **Google Ads campaigns** — Setup and launch (tracking is live, campaigns not configured) | Blair + Tony | Tracking ready |
| 4 | **Team bios** — Real first names, experience blurbs, human photos for About + Team pages | Tony/Liam | Waiting |
| 5 | **Supplier contracts & rates** — Central database of accommodation, rates, contacts | Tony/Liam | In progress |
| 6 | **Finalise costing sheet** — Per-person-per-day, modular components | Liam | Reviewing |
| 7 | **Dummy booking** — Run end-to-end to validate process | All | After contracts |
| 8 | **Full QA pass** — Cross-browser, mobile, Core Web Vitals, concierge, analytics, security | Blair | After domain |

### 5.2 Important — Can Follow Launch

| # | Item | Notes |
|---|---|---|
| 9 | **Modular itinerary refiner** — A&K-style interactive day/activity toggling on journey pages | Builds on costing module data model |
| 10 | **PDF proposal generation** — Automated PDF creation from costing module | Requires design + build |
| 11 | **Post-trip survey flow** — Feedback collection + referral prompts | Requires design |
| 12 | **Freedom of choice menu** — Daily activity options surfaced on journey pages | Content from Tony/Liam |
| 13 | **Sustainability section** — Travel Life, kaitiakitanga, Qualmark content | Once certifications confirmed |
| 14 | **Phone CTA** — More prominent click-to-call or scheduling widget | Design decision |
| 15 | **Lodge-specific SEO pages** — Target Huka Lodge, Cape Kidnappers, etc. queries | Content can be AI-generated |
| 16 | **Dynamic content** — Replace static data files with Supabase-driven content | Gradual migration |
| 17 | **Mapbox account** — Needs payment method for production | Blair |
| 18 | **Paperclip activation** — Run agents in production with CRON_SECRET | Blair |
| 19 | **Re-add domain to Cloudflare** — `curatedexperiences.com` was removed due to incomplete nameserver setup | Tony |

### 5.3 Tony's Ops Priorities (from April Voice Notes — 4-6 week timeline)

1. Get all supplier contracts and competitive net rates in place
2. Build central depository database for accommodation, rates, contacts
3. Finalise modular costing sheet (per person per day)
4. Run through a dummy booking end-to-end
5. Complete sustainability certifications (Travel Life, Qualmark)
6. Decide on image library / photography approach
7. Face-to-face working session when possible

### 5.4 Credibility Updates to Surface

- **2026 World Travel Awards finalist** — TWO categories (Tour Operator + DMC) — make bigger on homepage
- **Australian trademark** for "Curated Experiences" accepted — TM symbol in use
- **Qualmark** — once confirmed
- **Travel Life sustainability** — once certified
- **Tech NZ membership** — once confirmed
- **Cruise line heritage**: Silversea, Celebrity, Ponant — on About page

---

## 6. Decisions Needed

1. **Image library**: Liam has found some lesser-known stock sources. Do we proceed with stock (iStock/Shutterstock subscription, Alamy packs) or invest in custom photography?
2. **Domain**: `curatedexperiences.com` was removed from Cloudflare. Do we re-add to Cloudflare or point directly to Vercel?
3. **Google Ads**: Budget and target CPA for initial campaigns? Which journey to lead with?
4. **Team page**: How many travel curators to feature? Names/photos ready?
5. **Pricing visibility**: Any pricing information on the public site, or entirely behind the concierge? (Gary Duffy recommends transparency to "stop door knockers")
6. **Launch date**: Target "later in June" per Tony — specific week? (Note: Tony/Liam in Vancouver June 17-18)
7. **Paperclip agents**: Activate now (generating content in background) or post-launch?
8. **A&K-style itinerary refiner**: Priority for Phase 2, or explore for launch?
9. **Supabase RLS warning**: Verify which tables need RLS and whether the current configuration is intentional

---

## 7. Next Steps

### From This Meeting (May 10)
- [ ] Review and agree on this document
- [ ] Confirm launch target date (late June window)
- [ ] Resolve image library decision (Liam to present findings)
- [ ] Decide domain approach (re-add to Cloudflare vs. Vercel directly)
- [ ] Agree on Google Ads budget and initial campaign structure

### Next 2 Weeks (May 11-24)
- [ ] Blair: Investigate and resolve Supabase RLS security warning
- [ ] Blair: Full QA pass on staging
- [ ] Liam: Finalise costing sheet structure, share with Blair for system integration
- [ ] Tony/Liam: Supplier contracts and rates into central database
- [ ] Tony: Team bios and photos for About page
- [ ] Domain: Re-add `curatedexperiences.com` and configure DNS
- [ ] Blair: Google Ads campaign setup (once budget and hero journey confirmed)

### By Mid-June (Before Vancouver Trip)
- [ ] All critical path items (5.1) completed
- [ ] Staging review session with Tony & Liam
- [ ] DNS cutover for curatedexperiences.com (if not already done)
- [ ] Final QA on production domain

### Go-Live
- [ ] Target: Late June 2026 (after June 17-18 Vancouver meetings)

---

## Appendix A: Git History Summary

| Date | Key Commits |
|---|---|
| **May 3** | Tour costing module, Journal content system (19 MDX articles), Journal bylines |
| **Apr 27** | Merge duplicate leads, Lead capture fixes, Soft inline email capture |
| **Apr 26** | Concierge contact links fix, Tony voice note action items implemented |
| **Apr 18** | Admin Phase 2 (RBAC, audit, Kanban, email templates, bulk actions), Booking status flow |
| **Apr 6** | All 6 journeys updated per Tony's April 4 change requests |
| **Mar 22-27** | Brand copy updates, Hero video, Logo, Performance, GA4/Ads tags, Nurture cron, Journey content from Tony/Liam |

## Appendix B: File Count Summary

- **19 admin pages** (dashboard, CRM, bookings, content, journeys, settings, audit, database)
- **22 admin components** (tables, forms, Kanban, editors, filters, viewers)
- **19 API routes** (concierge, leads, nurture, admin CRUD, embed, retrieve, exports)
- **5 concierge library files** (system prompt, client, rate limit, brief extraction, brand voice)
- **19 journal articles** (lodges, culture, food/wine, wildlife, geography, planning)
- **6 public page routes** + 2 dynamic routes (journey detail, journal article)
- **21 Supabase migrations** applied

---

## Appendix C: Recent Email Correspondence (May 2026)

| Date | From | Subject | Key Content |
|---|---|---|---|
| **May 7** | Tony | CE Meeting Agenda 10-May-26 | Forwarded agenda docx. Discussion topics: launch timing, digital marketing mechanics, launch imperatives. "We are very excited" |
| **May 7** | Blair → Tony | Re: Agenda | Confirmed attendance for Sunday call |
| **May 6** | Tony | Supabase security warning | Forwarded critical alert: "Table publicly accessible — RLS not enabled." Needs investigation |
| **May 5** | Liam | Strategic Reference: A&K NZ | Detailed A&K benchmark analysis. Key question: can we build an itinerary refiner? "King & Partners is the gold standard" |
| **May 5** | Tony | Cloudflare domain removal | `curatedexperiences.com` removed from Cloudflare — incomplete nameserver setup. Needs re-adding |
| **May 3** | Tony/Liam | Website Images and Costing Sheets | Liam shared updated costing template. Gary Duffy shared his CanadaByDesign model. Tony wants modular integration: locations, dates, accommodation options, excursions, add-ons |
| **May 1** | Liam | Catching up in person | Face-to-face meeting invitation. Can host in Auckland. Tony later decided both should be present |
| **May 4** | Tony | Sunday | Set up the Sunday May 10 call. Launch possibly "later in June" — away June 17-18 in Vancouver |

---

*End of document. For discussion at the Sunday 10 May 2026 meeting.*
