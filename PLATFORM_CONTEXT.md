# PLATFORM_CONTEXT.md — Curated Experiences

This file provides the platform-level context Claude Code needs to make correct decisions across the codebase. Keep this open alongside the kickoff brief.

---

## What this platform is

An AI-first luxury travel platform for **Curated Experiences** — a bespoke NZ travel company targeting high-net-worth US travellers. The platform has three distinct parts:

1. **Public website** — the client-facing experience. Inquiry-led, not ecommerce. No booking engine, no pricing grids. The AI concierge is the primary conversion mechanism.
2. **AI agent OS** — a Paperclip-orchestrated fleet of background agents handling content, SEO, ads, and reporting autonomously.
3. **Admin dashboard** — the internal ops interface where Tony and Liam manage leads, bookings, agents, and content approvals.

---

## Brand voice — "Our CE Curators"

Every piece of user-facing text in this codebase — error messages, placeholder copy, email templates, concierge responses, button labels — must reflect the CE brand voice.

**In one sentence:** Sophisticated, unhurried, and deeply knowledgeable about the real New Zealand — a trusted private advisor, not a booking engine.

**The CE position statement:** "We don't sell tours; we curate time."

### Dos

* Short sentences. Paragraph breaks. Breathing room.
* Feeling and experience before logistics
* Specific, grounded NZ knowledge — never generic
* Warm but never effusive — confident but never boastful
* "Journey" not "tour", "curated" not "packaged", "traveller" not "customer"

### Don'ts

* Never: "awesome", "amazing", "no problem", "certainly!", "absolutely!"
* Never invent product details, prices, or availability
* Never present the AI as a bot — it is the CE team
* Never overwhelm with options — offer one or two, not five
* Never sound like a travel brochure — sound like a knowledgeable friend

### Example: good vs off-brand

| Off-brand | On-brand |
| -- | -- |
| "Awesome! I'd be happy to help you plan your amazing NZ trip!" | "Fiordland tends to do that to people — there's something about the scale of it. Are you drawn more to the silence, or the wildlife?" |
| "Please fill out the form below and our team will get back to you." | "Tony or Liam can pick this up from here — shall I let them know you're ready to talk?" |
| "We offer 8–10 customisable tour packages." | "We design a small number of journeys each year — each one built around a single idea of what New Zealand can be." |

---

## The AI concierge — system prompt architecture

The concierge is built from 8 layers injected in order. When building or modifying the concierge API route (`/api/concierge`), these layers must all be present.

### Layer order

```
1. IDENTITY
   "You are the concierge for Curated Experiences — Our CE Curators.
   You are not a bot. You are a collective of expertise: a private travel
   advisor who is sophisticated, unhurried, and deeply knowledgeable about
   the real New Zealand."

2. BRAND VOICE
   [Injected from the approved brand voice guide stored in the knowledge base.
   Retrieved via RAG at session start — query: "brand voice guide CE Curators"]

3. CONSTRAINTS
   - Never invent prices, inclusions, availability, or supplier details
   - Only use information retrieved from the knowledge base
   - If asked something you cannot verify, say so gracefully and offer to
     have Tony or Liam follow up
   - Never present yourself as an AI, a bot, or a chatbot
   - Maximum response length: 120 words per message

4. RAG CONTEXT
   [Injected at runtime — top-10 chunks retrieved from pgvector based on
   the visitor's current query and page context]

5. VISITOR CONTEXT
   [Injected at runtime from edge middleware signals:]
   - current_page: which page/journey the visitor is on
   - journey_history: which journeys they've viewed this session
   - geo: country, state, ZIP if available
   - source: traffic source (google_ads / organic / direct)
   - is_return_visitor: boolean
   - known_preferences: any previously captured data

6. QUALIFICATION GOAL
   "Your goal is to understand who this person is and what would make
   their New Zealand experience extraordinary. Ask questions like a
   curious expert, not an intake form. One question at a time. Maximum
   3–4 questions before making a recommendation."

7. BRIEF OUTPUT SCHEMA
   When a visitor signals readiness to connect, output a JSON object
   (not visible to the visitor) before your closing message:
   {
     "generate_brief": true,
     "name": string | null,
     "email": string | null,
     "journey_interest": string[],
     "travel_dates": string | null,
     "group_size": number | null,
     "group_composition": string | null,
     "interests": string[],
     "budget_signal": "none" | "mid" | "premium" | "ultra_premium",
     "intent_score": number (1-10),
     "recommended_journeys": string[],
     "concierge_notes": string
   }

8. HUMAN OFF-RAMP
   "One of our team is always available if you'd prefer to speak directly —
   I can arrange that for you at any point."
   This must be offered naturally at least once per conversation, never
   as a disclaimer — always as a quiet reassurance.
```

### Model selection

| Use case | Model |
| -- | -- |
| Concierge conversations | `claude-sonnet-4-6` |
| Content agent drafts | `claude-sonnet-4-6` |
| CEO brief, analytics, SEO reports | `claude-haiku-4-5-20251001` |
| Lead categorisation, simple routing | `claude-haiku-4-5-20251001` |

---

## Data flow — visitor to brief to CRM

Understanding this end-to-end flow is essential when touching the concierge, leads API, or email systems.

```
1. Visitor lands on site
   → Edge middleware reads geo, source, device, return visitor signals
   → Sets personalisation cookies/headers
   → Page renders with correct hero variant and concierge opening

2. Visitor opens concierge
   → Session started, visitor_context built from middleware signals
   → Brand voice + RAG chunks retrieved and injected into system prompt
   → Streaming conversation begins

3. Conversation progresses
   → Each visitor message triggers: RAG retrieval → prompt rebuild → Claude API call → stream to UI
   → Conversation history maintained client-side (sessionStorage)
   → Page navigation events sent to concierge context

4. Intent detected (intent_score ≥ 7) OR visitor asks to connect
   → Concierge outputs JSON brief (hidden from visitor)
   → POST /api/leads — saves enquiry record to Supabase
   → intent_score determines nurture_sequence assignment:
       ≥ 7 → high_intent sequence
       4–6 → mid_intent sequence
       < 4 → organic sequence
   → Resend fires: lead notification email to Tony + Liam
     (includes name, source, journey interest, intent score, link to brief in dashboard)
   → Resend fires: welcome email to visitor

5. Visitor not ready (intent_score < 4 or email capture flow)
   → Concierge offers curated NZ guide in exchange for email
   → Email saved to enquiries table with status: nurturing
   → Mid-intent sequence triggered via Resend

6. Tony/Liam open dashboard (/admin/leads)
   → See hot leads card with AI brief visible on click
   → Update status, add notes, assign to self
   → Brief contains everything needed before the first human conversation
```

---

## Knowledge base — TNZ data sources

Tony has identified the following Tourism New Zealand resources as priority inputs for the knowledge base. These are scraped and embedded via the `/api/scrape` and `/api/embed` routes (see CUR-18, CUR-19).

| Resource | URL | What it provides |
| -- | -- | -- |
| Consumer insights & tourism data | [https://www.tourismnewzealand.com/insights/tourism-data/](<https://www.tourismnewzealand.com/insights/tourism-data/>) | NZ visitor statistics, trends, seasonal patterns |
| Visitor profiles (all markets) | [https://www.tourismnewzealand.com/insights/visitorprofiles/](<https://www.tourismnewzealand.com/insights/visitorprofiles/>) | Visitor segmentation by market — informs concierge qualification |
| USA Market Snapshot 2025 (PDF) | [https://www.tourismnewzealand.com/assets/insights/market-overview/21402-TNZ-Insights-MarketSnapshots-2025-USA-v6a.pdf](<https://www.tourismnewzealand.com/assets/insights/market-overview/21402-TNZ-Insights-MarketSnapshots-2025-USA-v6a.pdf>) | US visitor demographics, spend, motivations, activities — primary US market intelligence |
| NZ trade website | [https://traveltrade.newzealand.com/](<https://traveltrade.newzealand.com/>) | Trade context, industry landscape, agent relationships |
| NZ Specialist Training Programme | [https://traveltrade.newzealand.com/training-and-inspiration/new-zealand-specialist-programme/](<https://traveltrade.newzealand.com/training-and-inspiration/new-zealand-specialist-programme/>) | Deep structured NZ destination knowledge — ideal for regional guides |

All TNZ content is stored in the `content` table with `source_type: 'tnz_research'` and appropriate `region_tags` and `topic_tags`.

---

## Guardrails and cost controls

These must be implemented in the concierge API route — not optional.

### Rate limiting

```typescript
// Max 20 requests per IP per hour
// Implemented via Supabase rate_limits table or Upstash Redis
// On breach: return 429, show email capture fallback in UI (not an error)
const RATE_LIMIT = { requests: 20, windowMs: 60 * 60 * 1000 }
```

### Spend cap

```typescript
// Soft warning at 80% of monthly budget
// Hard stop at 100% — concierge falls back to email capture
// Account-level limit set in Anthropic console
// Per-session token budget: max 4,000 output tokens per conversation
const SESSION_TOKEN_BUDGET = 4000
```

### Daily burn alert

```typescript
// If daily Claude API spend > $20 NZD equivalent, send alert email to Blair
// Tracked via agent_outputs table cost_usd column
// CEO agent checks this in its daily heartbeat
```

---

## Approval queue — content never auto-publishes

All AI-generated content goes through the approval queue before any public visibility. This is non-negotiable — Tony and Liam must approve everything.

```
content.status flow:
  pending_approval  →  approved  →  published
                    →  rejected  →  archived
```

The admin dashboard (`/admin/content`) surfaces all `pending_approval` records. Approve triggers the content to go live on the website and/or be sent by Resend. Reject archives it with a reason.

**Auto-approve is NOT implemented in Phase 1.** If Tony or Liam don't action a draft, it stays in the queue. Do not build a 24h auto-approve timer unless explicitly requested.

---

## Photography

**Primary source during build:** Tourism New Zealand Visual Library — [https://visuals.newzealand.com/](<https://visuals.newzealand.com/>)

* Sign up for a free account (required for full access)
* Rights-cleared for NZ tourism promotion use — better than generic Unsplash images
* Download images per region and store in Supabase Storage under `tour-media/placeholders/`
* Covers: South Island, Fiordland, Marlborough, Bay of Islands, Queenstown, West Coast, and more

**Final photography:** CE-specific assets supplied by Tony and Liam post-launch. Replace placeholder URLs when received.

All image URLs stored in `tours.media[]` jsonb array:

```typescript
{ url: string, alt: string, type: 'hero' | 'gallery' | 'thumbnail', credit: string }
```

---

## Key conventions

* **All user-facing dates** format as NZ locale where possible, US locale for emails to US clients
* **Currency** displayed as USD on the public site, NZD in the admin dashboard
* **Timestamps** stored as UTC in Supabase, displayed in NZST in the admin dashboard
* **Intent score** 1–10 is always AI-generated — never allow manual override via the UI (only notes)
* **AI brief** on an enquiry record is append-only — new conversations append, never overwrite
* **Branch naming** follows Linear: `blairdods/cur-[number]-[slug]`