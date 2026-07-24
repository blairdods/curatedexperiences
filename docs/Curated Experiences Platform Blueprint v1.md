**CURATED EXPERIENCES**

Platform Blueprint

*Website · AI Operating System · Ops Backend · Build Roadmap*

─────────────────────────────────────────────

*Prepared by Blair Dods  ·  March 2026*

*Based on discovery meeting and the Venture Development and Launch Framework (12 March 2026\)*

*Confidential — For Tony & Liam, Curated Experiences / PPG Tours*

| Document | Details |
| :---- | :---- |
| **Version** | 1.0 — Full platform blueprint (framework-aligned) |
| **Source doc** | Venture Development and Launch Framework, 12 March 2026 |
| **Status** | Working draft — for Tony & Liam review |
| **Target launch** | Q2 2026 (April–June) |
| **Author** | Blair Dods |

# **1\. Venture Overview**

The following overview is drawn directly from Tony's Venture Development and Launch Framework, 12 March 2026, and the meeting notes from the founding team call. It forms the strategic foundation that all technical and marketing recommendations in this document serve.

| Venture name | Curated Experiences |
| :---- | :---- |
| **Domain** | curatedexperiences.com (acquired) |
| **Business type** | Luxury FIT (Free Independent Travel) — bespoke inbound NZ tourism |
| **Positioning** | Design-led travel specialist. Thoughtfully curated, personalised, seamlessly executed. Quality over volume. |
|  |  |
| **Credibility anchor** | PPG Tours — award-winning NZ Destination Management Company, World Travel Award winner. Leverages established supplier network, operational expertise, and destination knowledge. |
| **Brand status** | Name confirmed. Logo and visual identity developed (AI-assisted, reviewed). Brand messaging and tone to be finalised. |
| **IP / brand protection** | Domain acquired. Trademark research and registration to be completed. |
| **Primary market** | Affluent US travellers, carefully geo-targeted by ZIP code, income, and demonstrated propensity for luxury travel and experiences. |
| **Secondary markets** | Canada, UK and other international markets — to follow once US market established. |
| **Product** | Approximately 5–10 example journeys, 10–14 days. Illustrative frameworks, fully customisable. Mix of location-based, experience-based, and themed itineraries. |
| **Target launch** | Q2 2026 — optimise readiness, scope, and investment timing. |

# **2\. Vision & First Principles**

## **2.1  The opportunity**

Every existing competitor in the luxury NZ FIT travel space operates on a pre-AI model: a brochure website, a contact form, a human on email, and a PDF itinerary. The funnel is slow, expensive to staff, and dependent on whichever human picks up the enquiry.

Curated Experiences has the opportunity to be the first luxury NZ travel operator built AI-native from day one — a structural advantage that compounds over time as competitors remain locked in legacy operating models.

## **2.2  Brand philosophy (Tony's words)**

| Core brand direction — from the Venture Development and Launch Framework "The emphasis will be on personalised itineraries, premium experiences, and seamless execution, delivered with a high level of attention to detail." "The intention is to establish a high-value travel design business centred on quality, personalisation, and exceptional travel experiences, rather than high-volume tourism." "Digital content will aim to create emotional connection and inspiration... The objective is to attract prospective clients by communicating the feeling and experience of the journey, rather than only the logistics of the itinerary." "Curate rather than create... personalise experience and connection." |
| :---- |

This brand philosophy is the editorial brief for every AI agent, every piece of content, and every concierge conversation in the platform. It is injected into the system prompt of all AI components.

## **2.3  Target traveller profile**

Drawn from the Venture Development Framework — this is the ideal client the entire platform is designed to attract and convert:

| Characteristic | Detail |
| :---- | :---- |
| **Geography** | United States — carefully geo-targeted by ZIP code. High-income postcodes: Connecticut, New York, California, Florida, Massachusetts, Texas. |
| **Income / wealth signal** | Top household income deciles. Demonstrated interest in luxury goods and experiences (not just travel). High discretionary spend. |
| **Travel behaviour** | Propensity to travel internationally. Preference for longer, experience-led journeys (10–14 days). Seeks nature, culture, and unique local experiences combined. |
| **Service expectation** | High service levels, comfort, and seamless logistics. Does not want to self-manage logistics. Trusts a specialist to curate. |
| **NZ appeal** | Values distinctive landscapes, natural beauty, and relatively untouched environments. Wants something that feels genuinely remote and alive. |
| **Booking style** | Prefers curated and personalised travel over fixed group tours. Expects to be consulted, not catalogued. |
| **AI concierge fit** | Will engage with a knowledgeable, unhurried conversational AI if the tone is right — as they would with a private travel advisor. |

## **2.4  The AI-first design contract**

Every component is designed with AI as a first-class participant. This means:

* The website adapts in real time to visitor context — different content for different signals

* Enquiries are handled conversationally by AI, not static forms

* All content — articles, social, email, ad copy — is generated and maintained by AI agents

* The ops dashboard surfaces AI summaries and decisions — humans approve, not administrate

* The knowledge base is a living vector store (an AI specific database) ensuring all AI speaks with consistent expertise and brand voice

* Every agent action is logged, budgeted, and governable — Tony and Liam are the board

# **3\. Platform Architecture Overview**

The platform is four interlocking layers. Each is independently valuable but the compound effect — when all four are running together — is what separates this from a conventional travel website.

| Layer | Name | What it does | Audience |
| :---- | :---- | :---- | :---- |
| **1** | Client-facing website | Personalised, AI-concierge-led public website — draws visitors in, builds confidence, drives enquiry | Prospects / visitors |
| **2** | AI Agent OS  | Orchestrated fleet of AI agents running content, SEO, ads, social, nurture, reporting, and ops 24/7 | Agents \+ board approval |
| **3** | Ops & CRM backend | Internal platform: leads, bookings, tour products, suppliers, financials — the business database | Tony, Liam, team |
| **4** | Data & knowledge layer | Postgres \+ pgvector powering all AI with accurate, consistent knowledge and client data | AI agents (internal) |

# **4\. Product Development**

This section is drawn directly from Section 5 of Tony's Venture Development and Launch Framework. The product structure shapes the website architecture, knowledge base, and content strategy.

## **4.1  Journey framework**

| From the Venture Development Framework "The product offering will consist of curated example journeys designed to demonstrate the types of experiences available." "Approximately 5–10 example journeys, typical duration of 10–14 days, designed as illustrative travel frameworks rather than fixed packages." "Each journey will be fully customisable based on client preferences." |
| :---- |

Three journey types are defined — the platform and content strategy must serve all three:

| Journey type | Examples | Platform implications |
| :---- | :---- | :---- |
| **Location-based** | South Island, North Island, Fiordland, Marlborough, Bay of Islands | Destination pages in website nav. GEO content per region. Concierge can recommend by region preference. |
| **Experience-based** | Adventure, nature, wines, culinary, wellness, wildlife | Filter tags on the Experiences index. Content agent produces experience-type guides. Concierge qualification asks about experience interests. |
| **Themed** | Photography, painting, cultural immersion, fly fishing, golf | Niche SEO opportunity. Blog content series. Supports premium positioning and differentiated enquiry. |

## **4.2  Product development activities**

The following activities are required to build out the full product set — these feed the knowledge base and website simultaneously:

* Design 5–10 compelling travel frameworks covering the three journey types above

* Identify and document premium accommodation for each itinerary region

* Identify distinctive experiences that create memorable moments within each journey

* Structure itineraries that reflect the brand ethos — feeling and experience first, logistics second

* Identify and develop relationships with premium suppliers aligned to desired quality level

* Write each journey as an editorial narrative, not a logistics document — this becomes both the website content and the knowledge base source

| AI acceleration of product development Once Tony and Liam provide the high-level structure for each journey, the Content agent can draft the full narrative descriptions, day-by-day copy, and highlight summaries — dramatically reducing the writing workload. These drafts go into the approval queue for Tony/Liam review before publishing or embedding in the knowledge base. |
| :---- |

# **5\. Layer 1 — Client-Facing Website**

## **5.1  Design philosophy**

The website's job is to make a wealthy American feel that New Zealand is already theirs to explore — and that Curated Experiences is the only company capable of making it happen. Tony's framework is explicit: communicate the feeling and experience of the journey, not the logistics. That is the editorial and design brief.

| Principle | Implementation |
| :---- | :---- |
| **Emotion before logistics** | Hero imagery and opening copy evoke feeling — 'What it's like to stand in Fiordland at dawn' — not 'Day 1: Arrive Queenstown, transfer to lodge' |
| **Curate, don't catalogue** | 8–10 journeys maximum, presented as stories not a dropdown list. Quality signals over quantity. |
| **Credibility without boasting** | PPG Tours' World Travel Award, Silversea/Ponant/MSC client work, and team expertise woven naturally into narrative — not on an 'Awards' page |
| **No ecommerce friction** | No booking engine, pricing grids, or availability calendars. The enquiry is the conversion — everything else is noise. |
| **Concierge as front door** | The AI concierge is the primary CTA on every page. Not a form. Not a phone number. A conversation. |
| **Mobile-first luxury** | US luxury travellers research on mobile. The experience must be impeccable at 390px — not just functional. |

## **5.2  Site structure**

| Page / section | Content & purpose | Phase |
| :---- | :---- | :---- |
| **Homepage** | AI-personalised hero, featured journeys (contextual), trust signals (awards, PPG, clients), concierge entry point, journal teaser | **Phase 1** |
| **Journeys index** | Curated grid of 5–10 journeys. Filter by type (location / experience / themed). Each card is a story entry, not a spec sheet. | **Phase 1** |
| **Journey detail page** | Immersive long-form: narrative opening, day-by-day story, regions visited, key experiences, photography, testimonial, inline concierge CTA | **Phase 1** |
| **Destinations** | Editorial pages per NZ region — South Island, North Island, Fiordland, Marlborough etc. Deep, authoritative, GEO-optimised. | **Phase 1** |
| **Our story** | PPG Tours background and awards, Tony & Liam biography, team expertise, New Zealand philosophy. The trust page. | **Phase 1** |
| **Journal** | AI-agent-powered content hub — destination guides, travel stories, NZ insider pieces. Primary SEO and GEO engine. | **Phase 1** |
| **Testimonials** | Rich client stories with narrative, trip context, outcome — not star ratings. 'James and Helen spent 14 days…' | **Phase 1** |
| **Travel advisor hub** | B2B landing page for US travel agents — credentials, commission structure, contact. Agent portal (Phase 3). | **Phase 2** |
| **Private client portal** | Post-booking: digital itinerary, countdown, supplier contacts, packing list, trip notes. AI-assisted trip preparation. | **Phase 3** |

## **5.3  Personalisation engine**

The website uses Vercel Edge Middleware to read visitor signals before the first byte is served — zero-latency personalisation at the CDN edge.

| Signal | Source | Experience adaptation |
| :---- | :---- | :---- |
| **Geographic location / ZIP** | Cloudflare geo headers | High-income US ZIP → luxury-first hero. Different copy for NYC, CA, FL, CT. International → adjust currency/context. |
| **Traffic source** | UTM params / referrer | Google Ads arrival → show tour matching the ad group. Organic → editorial-led content. Social → visual-heavy. |
| **Device & time** | User-agent \+ server time | Desktop weekday → long-form. Mobile evening → visual-first, concise. Tablet → balanced. |
| **Return visitor** | Cookie / first-party data | 'Welcome back' message. Resume where they left off. Surface tours they previously viewed. |
| **Page behaviour** | JS event stream | High dwell on Fiordland page → trigger concierge with Fiordland-specific opening. Exit intent → one last gentle prompt. |
| **Campaign audience segment** | UTM audience param | 'Luxury traveller' segment vs 'adventure traveller' → different hero journey, different concierge opening. |

## **5.4  AI concierge — specification**

The concierge is the platform's most important revenue-driving component. It is not a chatbot. It is a knowledgeable travel expert with deep NZ knowledge, a luxury brand voice, and live RAG access (Retrieval-Augmented Generation \- a way for the AI to quickly access CE data) to every tour, destination, and FAQ in the knowledge base.

### **Conversation flow**

| \# | Stage | AI behaviour | Data captured |  |
| :---- | :---- | :---- | :---- | :---- |
| **1** | **Warm, contextual open** | References the page viewed, region of interest, or return visit. Opens with a NZ insight or question — never 'How can I help?' | Session context, page history |  |
| **2** | **Curiosity-led discovery** | Asks about the traveller's vision for the trip — not a form, a conversation. One question at a time, following their lead. | Interests, past travel, inspiration |  |
| **3** | **Soft qualification** | Weaves in practical questions: timing, group size, group composition, NZ visit history | Dates, group\_size, composition |  |
| **4** | **RAG knowledge retrieval** | Queries vector store for matched journeys, destination content, relevant FAQs — grounds all recommendations in accurate data | Matched journey IDs |  |
| **5** | **Personalised recommendation** | Recommends 1–2 journeys with narrative framing tied to what the visitor just told the AI. Specific, not generic. | Journey recommendation |  |
| **6** | **Budget signal** | Gentle contextual mention of investment level — 'Our journeys of this type typically represent an investment from $X' — reads the response | budget\_signal |  |
| **7** | **Intent reading** | Assesses engagement level and readiness — ready to connect vs. still exploring and researching | intent\_score 1–10 |  |
| **8a** | **Ready — generate brief** | Offers to connect with Tony/Liam. Writes structured AI client brief, saves to DB, notifies team. | ai\_brief (full object) |  |
| **8b** | **Exploring — capture & nurture** | Offers a curated NZ guide or journal subscription in exchange for email. Enters nurture sequence. | email, nurture\_track |  |

### **Example AI client brief — generated automatically on enquiry**

| Client brief: James Bradford — generated by concierge AI Name: James Bradford  |  Email: j.bradford@email.com  |  Date: 15 March 2026 Source: Google Ads — 'South Island luxury tour' campaign  |  ZIP: 06830 (Greenwich CT — top-income) Group: 2 adults (60s) \+ adult son and daughter-in-law (30s)  |  Dates: April 12–26 2026 (14 nights) Budget signal: Premium — no hesitation when investment level was mentioned Interests: Helicopter experiences, private access, fine dining, fly fishing, wine Journeys explored: South Island Grand (6 min dwell), Fiordland Exclusive (4 min dwell) AI recommended: South Island Grand (primary), Fiordland day add-on (secondary) Reference point given: Previous Tuscany trip — expects similar quality, more remote Intent score: 9/10 — explicitly asked how to 'get the ball rolling' Recommended action: HIGH PRIORITY call. Lead with personalised 14-day South Island itinerary, helicopter upgrade, private fly-fishing experience. Mention Jade's design involvement. |
| :---- |

# **6\. Digital Marketing Strategy**

The Venture Development Framework explicitly identifies Google Ads as the primary launch channel, with SEO and GEO as parallel investments. This section translates those priorities into a structured strategy — noting that Tony also identified Meta Ads, travel advisor partnerships, and PR as additional channels to develop.

## **6.1  Channel prioritisation**

| Channel | Priority | Role | Timeline |
| :---- | :---- | :---- | :---- |
| **Google Ads** | Primary | Paid acquisition of high-intent US travellers — immediate results while SEO builds. Proven model (discoverholidays.ca reference). | Launch Day 1 |
| **SEO — organic search** | High | Long-term foundation. Topical authority through Journal content. Destination and experience pages. | Months 1–6 to gain traction |
| **GEO — generative AI search** | High | Discoverability in ChatGPT, Perplexity, Google AI Overviews. Explicitly listed by Tony as a priority channel. | Built in from Day 1 |
| **Email nurture** | High | Convert website visitors to clients over time. 3 audience-specific sequences. Critical for high-ticket, long consideration cycles. | Phase 1 |
| **Social media (Instagram/Facebook)** | Medium | Brand building and remarketing audience. US luxury traveller demographic. AI agent manages posting. | Phase 1 (organic), Phase 2 (paid) |
| **Meta Ads** | Medium | Listed by Tony as an additional channel. Retargeting and lookalike audiences once base data exists. | Phase 2 |
| **Travel advisor partnerships** | Medium | US luxury travel agents — access to HNW client bases with trusted recommendations. | Phase 2–3 |
| **PR / media exposure** | Medium | Coverage in US luxury travel publications builds authority and GEO signal. | Phase 2–3 |
| **Canada / UK markets** | Future | Geographic expansion once US market is operational and optimised. | Phase 4+ |

## **6.2  Google Ads strategy**

### **Campaign structure**

| Campaign | Objective | Key ad groups |
| :---- | :---- | :---- |
| **Brand protection** | Own the brand | 'Curated Experiences NZ', 'curatedexperiences.com' — prevent competitor bidding on brand terms |
| **Luxury NZ tours** | Primary acquisition | 'luxury New Zealand tour', 'bespoke NZ travel', 'private New Zealand holiday for couples' |
| **South Island** | High-intent destination | 'South Island luxury tour', 'Queenstown private tour', 'Fiordland guided experience' |
| **North Island** | Secondary destination | 'North Island luxury travel', 'Bay of Islands private tour', 'Rotorua luxury experience' |
| **Experience-based** | Interest targeting | 'New Zealand food and wine tour', 'NZ fly fishing private guide', 'photography tour New Zealand' |
| **FIT / independent** | Intent-based | 'New Zealand FIT travel', 'independent luxury NZ holiday', 'private guided NZ tour' |
| **Competitor conquest** | Competitive | Bid on Abercrombie & Kent NZ, Ahipara, Southern Crossings — capture comparison shoppers |
| **Remarketing (RLSA)** | Re-engage | Visitors who viewed tour pages but didn't enquire — higher bids, specific creative |

### **US audience targeting layers**

* Geography: California, New York, Connecticut, Massachusetts, Florida, Texas — states with highest NZ luxury travel intent

* Household income: Top 10% bracket (Google income targeting)

* Audience segments: 'Luxury travellers', 'Frequent international travellers', 'Adventure travel enthusiasts'

* Life events: 'Upcoming anniversary', 'Retirement' — key purchase triggers for long-haul luxury travel

* Device: Desktop priority (higher booking intent). Mobile bid adjustment \-20% initially.

* Dayparting: Increase bids during US weekday lunchtimes and evenings — peak travel research windows

* Lookalike: Build lookalike audiences from converters once 30+ conversions tracked

## **6.3  SEO strategy**

* Build topical authority through the Journal — one definitive guide per key destination and experience type

* Target long-tail, high-intent US queries: 'luxury New Zealand private tour from US', 'bespoke South Island itinerary'

* Technical: Core Web Vitals compliance, schema markup (TravelAction, TouristDestination, Review), fast TTFB

* Internal linking: every Journal article links to 2–3 relevant journey pages

* E-E-A-T signals: author bios, team expertise, PPG Tours awards, client case studies

* Backlinks: NZ tourism authority sites, US luxury travel publications, PPG Tours domain equity transfer

## **6.4  GEO (Generative Engine Optimisation) strategy**

GEO optimises for discoverability in AI-generated answers (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot).

* Build a distinctive brand entity with consistent NAP, structured About page, and factual accuracy throughout

* Structure all content with clear declarative facts AI can extract and cite

* Write definitive answers to questions AI search engines receive: 'best luxury travel company New Zealand', 'top bespoke NZ tour operators'

* Use FAQ sections on all key pages — AI systems extract these directly into answers

* Claim and optimise Google Business Profile and key luxury travel directories — AI systems synthesise multiple sources

* Rich imagery and video — required for a balanced E-E-A-T approach

# **7\. Layer 2 — AI Agent Operating System**

## **7.1  AI agent orchestration platform**

Creating the self-hosted AI agent orchestration platform allows us to model a company as an org chart of AI agents, each with a title, responsibilities, a monthly budget, and a heartbeat schedule. Tony and Liam are the board: they approve hires, review strategies, and override at will. No agent spends beyond its budget. No action is taken without a log entry.

Total cost: free. It replaces what would otherwise be a $3,000–5,000/month human marketing and operations coordinator. Note, it does require the use of AI tokens that do incur a fee.

## **7.2  Agent org chart**

| Agent | Responsibilities | Key outputs | Heartbeat | Mo. budget |
| :---- | :---- | :---- | :---- | :---- |
| **CEO agent** | Morning prioritisation, cross-agent coordination, escalation routing, weekly business review | Daily brief, weekly report, escalation alerts to Tony/Liam | Daily 7am | **$30–40** |
| **CMO agent** | Marketing calendar ownership, campaign oversight, brand voice governance, KPI tracking and review | Monthly marketing plan, campaign briefs, KPI dashboard | Daily | **$25–35** |
| **Content agent** | All written content: journal articles, journey descriptions, destination guides, email copy, social captions — all RAG-grounded and approval-queued | 2–3 articles/week, social posts, email sequences | Every 4h | **$40–60** |
| **SEO \+ Ads agent** | Keyword rank tracking, Google Ads performance monitoring, bid recommendations, ad copy refresh, Search Console alerts | Weekly rank report, ad performance summary, copy variants | Every 6h | **$20–30** |
| **Concierge agent** | Live website chat, lead qualification, brief generation, CRM record creation, nurture sequence assignment | Qualified leads, AI briefs, CRM entries, nurture triggers | Continuous \+ triggered | **$20–35** |
| **Social agent** | Instagram, Facebook, LinkedIn scheduling, comment monitoring, brand mention alerts, engagement reports | 10+ posts/week per platform, engagement report, alerts | Every 8h | **$15–20** |
| **Analytics agent** | GA4, Search Console, Ads, and CRM data synthesis into actionable reports — flags anomalies and opportunities | Weekly performance report, monthly deep-dive, anomaly alerts | Daily \+ weekly | **$10–15** |
| **COO agent** | Supplier follow-ups, booking operations reminders, itinerary checklist management, task tracking — supports the lean ops model Tony outlined | Ops task list, supplier reminders, booking status updates | Daily | **$10–15** |
| **CFO agent** | Revenue tracking, cost-per-lead, gross margin per booking, agent budget monitoring, monthly P\&L — answers Tony's financial planning requirements | Monthly P\&L, cost-per-lead, margin alerts, budget status | Weekly | **$10–15** |

| Total estimated agent budget Low estimate: \~$180/month  |  High estimate: \~$265/month Each agent is hard-capped at its monthly budget — when it hits the limit, it pauses and notifies the board. Equivalent human team cost for equivalent output: $8,000–15,000/month. The AI team covers: marketing coordination, content production, SEO monitoring, ads management, customer service, ops coordination, and financial reporting. |
| :---- |

## **7.3  How agents use the knowledge base**

* Every content-producing agent queries the vector store before generating output — no hallucinated product details

* The concierge retrieves matched journey descriptions, destination content, and FAQs in real time

* Brand voice guide is always included in agent system prompts — consistent tone across all outputs

* Agents flag any claim not retrievable from the knowledge base for human verification before publishing

## **7.4  Governance model**

* Morning CEO brief in the board dashboard — what happened overnight, what needs a decision today

* Approval queue for all content before it publishes (or auto-approve after 24h if no action taken)

* Budget alerts at 80% and hard stops at 100% per agent per month

* Full audit trail — every tool call, prompt, and output is logged with timestamp and cost

* Override capability at any time — pause any agent, reassign any task, adjust any budget or instruction

# **8\. Layer 3 — Ops & CRM Backend**

Tony's framework identifies four key operational functions: travel design, customer communication, supplier coordination, and trip delivery. The ops backend is the internal platform that supports all four — and where AI agents handle the routine so the team handles the exceptional.

## **8.1  The board dashboard**

Tony and Liam's daily interface — one screen replacing Google Analytics, a CRM, AI platforms's native UI, a task manager, and the email inbox for business updates.

| Dashboard widget | What it shows |
| :---- | :---- |
| **CEO daily brief** | AI-written 3–4 paragraph morning summary: overnight leads, agent activity, key metrics, decisions needed today. Tony's day starts here. |
| **Key metrics strip** | Website visitors (7d), concierge chats, hot leads, agent spend vs budget — all with week-on-week delta |
| **Hot leads panel** | Cards for each active lead: name, origin, journey interest, budget signal, intent score, status. Click to view full AI brief. |
| **Agent activity panel** | Live status of all 9 agents: current task, last heartbeat, cost used vs budget this month. One-click pause or override. |
| **Approval queue** | Content and social posts awaiting review. Preview \+ approve/reject in one click. Auto-approves after 24h if configured. |
| **Journey performance** | Which journeys generate the most interest, dwell time, concierge mentions, and conversions |
| **Booking pipeline** | Kanban: Enquiry → Qualified → Proposal sent → Deposit → Confirmed → In progress → Completed |
| **Monthly P\&L snapshot** | Revenue confirmed, pipeline value, gross margin, agent costs, ad spend — CFO agent synthesised |

## **8.2  Journey product database**

Journeys are managed as structured product records — not CMS pages. Every AI agent draws from the same authoritative source of truth.

| Field | Type | Description |
| :---- | :---- | :---- |
| **id** | UUID | Unique journey identifier |
| **slug** | TEXT | URL-friendly identifier (e.g. south-island-grand) |
| **title** | TEXT | Journey display name |
| **tagline** | TEXT | One-line narrative hook — communicates feeling, not logistics |
| **journey\_type** | TEXT\[\] | location\_based / experience\_based / themed (Tony's three categories) |
| **duration\_days** | INT | Length of journey |
| **price\_from\_usd** | INT | Indicative starting price — displayed as 'from $X' |
| **regions** | TEXT\[\] | NZ regions visited (e.g. \[Queenstown, Fiordland, Marlborough\]) |
| **experience\_tags** | TEXT\[\] | E.g. \[Helicopter, Wine, Fly fishing, Fine dining, Wellness\] |
| **theme\_tags** | TEXT\[\] | E.g. \[Photography, Culinary, Adventure\] — for themed journeys |
| **ideal\_for** | TEXT\[\] | Traveller profile: \[Couples, Families, Solo, Multi-gen\] |
| **seasons** | TEXT\[\] | Best travel months (e.g. \[October, November, December, March\]) |
| **highlights** | TEXT\[\] | 3–5 key experiences that define this journey |
| **inclusions** | TEXT\[\] | What is included (accommodation, transfers, guide etc.) |
| **itinerary\_days** | JSONB\[\] | Array of day objects: {day, title, narrative, overnight, key\_experiences\[\]} |
| **media** | JSONB\[\] | Media objects: {url, alt, type: hero/gallery/video, caption, credit} |
| **supplier\_ids** | UUID\[\] | Linked supplier records used in this journey |
| **testimonial\_ids** | UUID\[\] | Linked testimonials referencing this journey |
| **embedding** | VECTOR(1536) | Embedding for RAG retrieval by concierge and content agents |
| **customisable** | BOOLEAN | Whether this journey is offered as fully customisable (default: true) |
| **active** | BOOLEAN | Whether journey is publicly listed on the website |
| **updated\_at** | TIMESTAMP | Last modification — triggers re-embedding automatically |

## **8.3  Enquiry & CRM schema**

| Field | Type | Description |
| :---- | :---- | :---- |
| **id** | UUID | Unique enquiry identifier |
| **name** | TEXT | Full name |
| **email** | TEXT | Email address |
| **phone** | TEXT | Phone (optional) |
| **source** | TEXT | google\_ads / organic / social / direct / travel\_advisor / referral |
| **utm\_campaign** | TEXT | Ads campaign name if applicable |
| **zip\_code** | TEXT | US ZIP code — from geo headers or self-reported in concierge chat |
| **journey\_interest** | UUID\[\] | Journey IDs the visitor engaged with during concierge chat |
| **travel\_dates** | DATERANGE | Intended travel window |
| **group\_size** | INT | Number of travellers |
| **group\_composition** | TEXT | e.g. 'Couple', '2 adults \+ 2 adult children (30s)' |
| **interests** | TEXT\[\] | Stated interests from concierge: \[Wine, Helicopter, Fly fishing…\] |
| **journey\_type\_pref** | TEXT | location\_based / experience\_based / themed — from conversation |
| **budget\_signal** | TEXT | none / mid / premium / ultra\_premium |
| **intent\_score** | INT | 1–10. AI-scored lead temperature. 8+ \= contact today. |
| **ai\_brief** | TEXT | Full AI-written client brief in prose — the document Tony opens when reviewing a lead |
| **status** | TEXT | new / nurturing / proposal\_sent / deposit / confirmed / closed\_won / closed\_lost |
| **assigned\_to** | TEXT | tony / liam |
| **nurture\_sequence** | TEXT | Which email sequence is currently active |
| **notes** | TEXT | Human notes added by Tony or Liam during qualification |
| **created\_at** | TIMESTAMP | First capture timestamp |
| **last\_contact\_at** | TIMESTAMP | Most recent touchpoint |

## **8.4  Booking, supplier & financial schemas**

Full schemas for bookings (17 fields including custom itinerary, guest details, payment tracking, supplier booking refs), suppliers (14 fields including tier classification, contracted rates, lead times), and financial records (gross margin per booking, P\&L contribution) are defined in the technical specification appendix. The CFO agent reports against this data weekly.

# **9\. Layer 4 — Data & Knowledge Layer**

The knowledge base is the brain of the entire system. It must be built before any AI agent is activated — it is the ground truth that eliminates hallucination risk and ensures every agent speaks with consistent expertise and brand voice.

## **9.1  Knowledge base — what goes in**

| Category | Content | Priority | Owner |
| :---- | :---- | :---- | :---- |
| **Journey narratives** | Full itinerary narratives, day-by-day copy, highlights, inclusions, supplier notes — all 5–10 journeys | Phase 1 | Tony/Liam |
| **Brand voice guide** | Tone, vocabulary, example copy, what to say/avoid, luxury positioning principles, CE vs PPG distinction | Phase 1 | Tony/Liam |
| **NZ destination content** | Deep editorial per region: geography, best times, insider knowledge, what makes each area special | Phase 1 | Content agent |
| **FAQs** | 100+ Q\&A: visa, tipping, driving, seasons, currency, safety, NZ customs, travel logistics | Phase 1 | Content agent |
| **Team & credibility** | Tony and Liam bios, PPG Tours history, awards, Silversea/Ponant/MSC client work, philosophy | Phase 1 | Tony/Liam |
| **Supplier profiles** | What each supplier offers, quality tier, what makes them special — for concierge accuracy | Phase 1 | Tony/Liam |
| **Testimonials** | Full client testimonial text, trip context, guest profiles (anonymised) — proof points | Ongoing | Tony/Liam |
| **Competitor awareness** | What CE does differently from Ahipara, Bespoke Kiwi, Southern Crossings, A\&K — for concierge positioning | Phase 1 | TBC |
| **Email sequence copy** | All nurture sequences — 3 tracks: high intent, mid intent, organic subscriber | Phase 1 | Content agent |
| **Ad copy library** | All approved Google Ads headlines and descriptions — agents reference for consistency | Phase 1 | TBC/Content agent |
| **NZ tourism facts** | MBIE stats, Tourism NZ data, seasonal patterns, visa information, travel advisories | Quarterly | Analytics agent |

## **9.2  Embedding pipeline**

* All knowledge base content is chunked at 512 tokens with 50-token overlap, preserving paragraph boundaries

* Each chunk is embedded and stored in Supabase pgvector with metadata: source\_type, source\_id, region\_tags, journey\_ids, last\_updated

* Retrieval: cosine similarity search returning top-10 most relevant chunks for any agent query — runs in under 100ms

* Re-embedding triggers automatically when source documents are updated

* Manual re-index available from admin dashboard for bulk knowledge base updates

# **10\. Systems & Technology Stack**

The framework identifies systems as a key development area: website platform, marketing automation, CRM, analytics, and internal workflow systems. This section defines the complete technical answer to that requirement — a lean, modern stack with AI at its centre.

| Layer | Technology | Role | Cost/mo. |
| :---- | :---- | :---- | :---- |
| **Frontend** | **Next.js 15 (App Router)** | Public website \+ internal dashboard. Server components for SEO, client components for AI chat and interactivity. | **Vercel Pro \~$20** |
| **Styling** | **Tailwind CSS \+ design system** | Luxury typographic system, responsive grid. Bespoke design language matching CE brand. | **Free** |
| **Edge / personalisation** | **Vercel Edge Middleware** | Visitor personalisation before first byte — geo, device, source signals. Zero latency. | **Included** |
| **Database** | **Supabase (Postgres)** | Core data: journeys, enquiries, bookings, suppliers, content, financial records. | **Pro \~$25** |
| **Auth** | **Supabase Auth** | Admin dashboard authentication. Row-level security on all internal data. | **Included** |
| **Vector / RAG** | **Supabase pgvector** | Knowledge base embeddings \+ cosine similarity retrieval for all agents and concierge. | **Included** |
| **File storage** | **Supabase Storage** | Tour photography, itinerary PDFs, invoices, brand assets. | **\~$5** |
| **AI — concierge** | **Claude API (claude-sonnet-4-6)** | Conversational AI with streaming responses and RAG context injection. | **\~$30–80** |
| **AI — agents** | **Claude API (claude-sonnet-4-6)** | All 9 AI platform agents. Budgeted individually per month. | **\~$150–250** |
| **Agent orchestration** | **AI platform (self-hosted)** | Org chart, heartbeats, budget enforcement, approval queue, governance, audit log. | **Free (OSS)** |
| **Embeddings** | **Anthropic embeddings API** | Knowledge base chunking and embedding for pgvector storage. | **\~$5–10** |
| **Email** | **Resend** | Transactional email (lead notifications) and nurture sequence delivery. | **\~$10–20** |
| **Analytics** | **GA4 \+ Search Console** | Traffic, engagement, search performance. Free tier. | **Free** |
| **Ads API** | **Google Ads API** | Analytics and SEO agents read performance data. Recommendations surfaced in dashboard. | **Free (API)** |
| **Maps** | **Mapbox GL JS** | Interactive journey route maps on journey detail pages. | **Free tier** |
| **Monitoring** | **Vercel Analytics \+ Sentry** | Performance, errors, Core Web Vitals. CTO agent monitors. | **\~$10** |
| **Deployment** | **Vercel** | CI/CD, preview deployments, edge network, domain management. | **Included** |

| Total platform running cost (monthly, excluding Google Ads) Infrastructure (Vercel, Supabase, Resend, Sentry): \~$90–120/month AI token spend (concierge \+ 9 AI platform agents): \~$180–330/month Total: approximately $270–450/month Google Ads budget is separate and subject to Tony/Liam decision — recommended test budget: $2,000–5,000/month for first 90 days. |
| :---- |

# **11\. Operational Model & Team Structure**

Tony's framework specifies a lean initial operational structure across four key functions. This section maps how the AI agent layer covers each function — and where human involvement is essential.

| Function (from framework) | AI agent coverage | Human role | When human needed |
| :---- | :---- | :---- | :---- |
| **Travel design & curation** | Content agent drafts itinerary narratives, suggests supplier combinations, generates customisation options based on client brief | Tony/Liam final design and approval of all itineraries | Every booking — this is the core expertise and value proposition |
| **Customer communication & engagement** | Concierge agent handles all initial website enquiries 24/7, nurture agent manages email sequences, CEO agent surfaces priority leads | Tony/Liam handle all voice/video calls and proposal conversations | When lead is ready — AI delivers them briefed and warm |
| **Supplier coordination** | COO agent manages reminder sequences, booking confirmations, pre-trip checklists | Tony/Liam own supplier relationships, rate negotiations, quality decisions | New suppliers, complex logistics, issues during travel |
| **Trip delivery & execution** | COO agent provides pre-departure checklists, supplier contact sheets, AI-generated guest briefing notes | Tony/Liam or on-ground NZ team handle actual trip execution | During all trips — this cannot be automated |
| **Marketing** | CMO, Content, SEO+Ads, Social agents run all marketing 24/7 | Tony/Liam approve content before publish, set strategy direction quarterly | Weekly 30-min review of approval queue and metrics |
| **Finance** | CFO agent tracks all revenue, costs, and margin — produces P\&L | Tony/Liam review P\&L, make pricing and investment decisions | Monthly review \+ ad-hoc when alerts are triggered |

## **11.1  Future recruitment (from Tony's framework)**

Tony's framework anticipates additional roles as the venture grows. The AI platform is designed to delay and reduce the need for these hires — but they remain the growth path:

* Travel designers / curators — as journey volume grows beyond Tony and Liam's capacity

* Operational coordination staff — when concurrent bookings exceed manageable overhead

* Marketing coordination staff — if the approval and oversight of AI outputs becomes a bottleneck

The AI platform is designed to handle the first 20–30 bookings per year without any of these hires. When these roles are recruited, the AI agents act as their force-multipliers — not their replacements.

# **12\. Monthly tech operating costs**

Anticipated technology, AI and marketing costs are as follows.

## **12.1  Monthly running costs**

| Item | Est. cost/month | Notes |
| :---- | :---- | :---- |
| **Platform infrastructure** | **$90–120** | Vercel, Supabase, Resend, Sentry |
| **AI token spend (agents \+ concierge)** | **$180–330** | 9 AI platform agents \+ website concierge |
| **Google Ads** | **TBC** | Recommend $2,000–5,000 NZD/month for first 90-day test |
| **Meta Ads (Phase 2\)** | **TBC** | To be scoped once Google Ads is optimised |
| **Blair consultancy retainer** | **TBC** | To be agreed — advisory \+ ongoing development |
| **Other tools / subscriptions** | **\~$100–200** | SEO monitoring, stock photography, misc SaaS |

# **13\. Launch Strategy & Build Roadmap**

The target is a Q2 2026 launch — April through June. With today being 15 March 2026, that gives approximately 3–14 weeks depending on the target launch date. The roadmap below reflects this constraint with a compressed Phase 1 and a clear Minimum Viable Launch (MVL) definition.

## **13.1  Minimum Viable Launch (MVL) — target: late April / May 2026**

The MVL is the earliest version of the platform that is credible enough to convert a high-value lead. It does not need to be perfect. It needs to be:

* A live, fast, mobile-optimised website with at minimum 3–5 journey pages

* A working AI concierge backed by a seeded knowledge base

* An active Google Ads campaign pointing to the website

* An admin dashboard where Tony can see leads and agent activity

* One active email nurture sequence for captured leads

| What can wait until post-MVL Full suite of 10 journeys (3–5 is enough to launch) Themed and experience-based journey types (location-based first) Meta Ads, travel advisor portal, private client portal Full AI platform agent fleet (start with Concierge \+ Content \+ CEO agents) Detailed booking pipeline and financial tracking (manual initially) |
| :---- |

## **13.2  Build roadmap**

### **Phase 1 — Foundation (Weeks 1–2, by end of March)**

| Week | Focus | Deliverables | Owner | Type |
| :---- | :---- | :---- | :---- | :---- |
| **Wk 1** | **Infrastructure** | Supabase project, full schema, Supabase Auth, Vercel project, domain connection, admin shell skeleton | Blair | **Dev** |
| **Wk 1** | **Knowledge base** | Tony/Liam enter journey outlines, brand voice doc drafted, NZ region content seeded, FAQs compiled | Tony+Liam+Blair | **Content** |
| **Wk 2** | **Embedding pipeline** | Chunking \+ embedding script, pgvector setup, RAG retrieval endpoint, accuracy testing | Blair | **Dev** |
| **Wk 2** | **Concierge API** | Claude API integration, system prompt architecture, RAG injection, streaming handler, brief output to DB | Blair | **AI** |

### **Phase 2 — Website & Concierge (Weeks 3–6, April)**

| Week | Focus | Deliverables | Owner | Type |
| :---- | :---- | :---- | :---- | :---- |
| **Wk 3** | **Design system** | Typography, colours, components — luxury design language aligned to CE brand assets | Blair | **Dev** |
| **Wk 3** | **Homepage** | Personalised hero (edge middleware), trust strip, featured journeys, concierge CTA | Blair | **Dev** |
| **Wk 4** | **Journey pages** | 3–5 journey detail pages: narrative, day-by-day, photography, map, testimonials, concierge trigger | Blair | **Dev** |
| **Wk 4** | **Concierge UI** | Chat interface: streaming, mobile-first, auto-trigger, email capture fallback, brief generation | Blair | **AI** |
| **Wk 5** | **Core pages** | Experiences index, Destinations, Our Story, Testimonials — credibility architecture | Blair | **Dev** |
| **Wk 5** | **SEO foundation** | Schema markup, sitemap, GA4, Search Console, Ads conversion tracking, Core Web Vitals | Blair | **Dev** |
| **Wk 6** | **Soft launch review** | Tony \+ Liam full review. QA across devices. Photography integrated. Concierge flow tested end-to-end. | Tony+Liam+Blair | **Review** |

### **Phase 3 — Google Ads & Core Agents (Weeks 7–10, May–June)**

| Week | Focus | Deliverables | Owner | Type |
| :---- | :---- | :---- | :---- | :---- |
| **Wk 7** | **Google Ads launch** | Campaign structure, US audience targeting, ZIP/income layers, first campaigns live, conversion tracking | Blair \+ TBC | **Marketing** |
| **Wk 7** | **AI platform — CEO \+ Concierge** | CEO agent daily brief, concierge agent formalised in AI platform, board dashboard live | Blair | **AI** |
| **Wk 8** | **Content \+ SEO agents** | Content agent (journal drafts), SEO+Ads agent (rank monitoring, ad performance), approval queue | Blair | **AI** |
| **Wk 8** | **Email nurture** | Resend integration, 3 nurture sequences, welcome email, concierge email capture flow | Blair | **AI** |
| **Wk 9** | **Remaining agents** | Social, Analytics, COO, CMO, CFO agents configured and running | Blair | **AI** |
| **Wk 10** | **Journal launch** | First 4–6 AI-drafted journal articles approved and live. GEO content seeding begins. | Content agent \+ TB C | **Content** |

### **Phase 4 — Growth (Months 4–6+)**

| Week | Focus | Deliverables | Owner | Type |
| :---- | :---- | :---- | :---- | :---- |
| **Mo 4** | **Remaining journeys** | Complete the full 5–10 journey suite. Add remaining experience-based and themed journeys. | Tony+Liam+Content agent | **Content** |
| **Mo 4** | **Meta Ads** | Facebook \+ Instagram paid campaigns. Retargeting audiences from website visitors. | Blair \+ Social agent | **Marketing** |
| **Mo 5** | **Travel advisor channel** | B2B landing page, travel advisor outreach, agent pack — US luxury agency targeting | COO agent \+ Blair | **Marketing** |
| **Mo 5** | **Private client portal** | Post-booking portal: digital itinerary, countdown, supplier contacts, trip notes | Blair | **Dev** |
| **Mo 6+** | **Canada / UK expansion** | Localised campaigns, content adaptation, currency adjustment for secondary markets | Agents \+ Blair | **Marketing** |

# **14\. Brand Assets & Collateral**

The framework lists collateral and website development as a key milestone. Beyond the website itself, the following brand and marketing materials need to be created — several of which can be AI-assisted or AI-generated.

| Asset | Description | Phase | Owner |
| :---- | :---- | :---- | :---- |
| **Logo files** | Final logo in all required formats: SVG, PNG (light/dark), favicon, social profile versions | **Phase 1** | Liam/Jade |
| **Brand guidelines** | Colour palette, typography, logo usage rules, photography style, tone of voice summary — for all future design work | **Phase 1** | TBC |
| **Email signature** | Branded email signatures for Tony, Liam, and any future team members | **Phase 1** | Blair |
| **Business cards** | Premium print business cards — digital version for Apple/Google Wallet | **Phase 1** | TBC |
| **Journey one-pagers** | Printable / downloadable PDF one-pager per journey for post-enquiry follow-up | **Phase 2** | Content agent \+ Blair |
| **Proposal template** | Premium branded proposal document — Tony/Liam complete and personalise per client | **Phase 2** | Blair |
| **Travel advisor kit** | Credentials pack for US travel agencies: CE overview, commission structure, contact | **Phase 2** | Content agent |
| **PR media kit** | Press-ready brand story, team bios, high-res images, awards summary — for media pitching | **Phase 2** | Content agent \+ Tony |
| **Social profile assets** | Profile images, cover photos, highlight covers — Instagram, Facebook, LinkedIn | **Phase 1** | TBC |

# **15\. Open Questions & Decisions Required**

The following need to be confirmed by Tony and Liam before or at the start of the build. None are blockers to starting — but they shape implementation details.

| \# | Question | Context / options | Priority |
| :---- | :---- | :---- | :---- |
| **1** | **What is the exact target launch date?** | Tony's framework says Q2 2026\. Is this April, May, or June? This determines how aggressive the build schedule needs to be. | **Critical** |
| **2** | **How many journeys will be ready at launch?** | MVL needs 3–5. If only 3 are ready, we launch with 3 and add more progressively. Which 3 are most important? | **Critical** |
| **3** | **What photography and video assets exist now?** | Existing PPG Tours photography may be usable. What does the library look like?  | **Critical for design** |
| **4** | **What is the Google Ads monthly test budget?** | Recommend NZD $2,000–5,000/month for 90-day test. Shapes campaign structure and expected CPC/ROAS. | **Critical for launch** |
| **5** | **Who approves content before it publishes?** | Liam reviews social/blog, Tony reviews pricing references. Or: auto-approve after 24h. Need a clear workflow. | **Needed for AI platform config** |
| **6** | **Is there an existing customer database from PPG Tours?** | Past high-value PPG clients are the warmest possible audience. Could accelerate early bookings significantly. | **High value** |
| **7** | **What is the preferred approval model for the concierge?** | Should it capture email before or after recommending journeys? Affects conversation flow design. | **UX design** |
| **8** | **What is Tony/Liam's preferred daily engagement with the dashboard?** | 30 min morning review? Or more hands-off with alerts only? Shapes how the CEO brief and approval queue are designed. | **Dashboard UX** |

*Blair Dods  ·  blairdods@gmail.com  ·  March 2026*
*Confidential — prepared exclusively for Tony Regan and Liam Regan, Curated Experiences / PPG Tours*
