# Curated Experiences — System Playbook
*For Liam and Tony to operate the platform independently.*
*Prepared by Blair Dods | May 2026*

---

## 1. System Architecture — What Connects to What

```
VISITOR BROWSER
      │
      ▼
CLOUDFLARE (DNS + WAF + DDoS protection)
      │  curatedexperiences.com → Vercel
      ▼
VERCEL (Next.js 16, auto-deployed from GitHub main branch)
      │
      ├── Public website (/, /journeys, /destinations, /journal, /about)
      ├── Admin dashboard (/admin/*)
      ├── API routes (/api/*)
      │     ├── /api/concierge  — AI chat (streams from Claude API)
      │     ├── /api/nurture    — Daily email queue (cron at 9am UTC)
      │     ├── /api/leads/*    — Lead management
      │     ├── /api/admin/*    — All admin data operations
      │     └── /api/embed      — Vector embedding (calls Supabase Edge Function)
      │
      └── Edge Middleware — personalisation signals, auth session refresh
            │
            ▼
SUPABASE (Database + Auth + Edge Functions + Storage)
      │   Project: bwpbvdmdwjqguiliymnq
      │   URL: https://bwpbvdmdwjqguiliymnq.supabase.co
      │
      ├── Postgres database (all tables)
      ├── pgvector extension (semantic search for concierge)
      ├── Auth (magic link email login for admin)
      ├── Edge Function: embed (generates vector embeddings)
      └── Storage (images — not yet in active use)

EXTERNAL SERVICES
      ├── Anthropic/Claude API — powers the AI concierge + agents
      ├── Resend — sends all transactional + nurture emails
      ├── Mapbox — journey route maps on public site
      └── Google Analytics 4 (G-XSB4LZMTX5) — visitor analytics
```

---

## 2. Where Everything Lives

| Service | URL / Location | What you do there |
|---|---|---|
| **Website (live)** | curatedexperiences.vercel.app | View the public site |
| **Admin dashboard** | curatedexperiences.vercel.app/admin | Leads, bookings, content, accommodations |
| **Vercel** | vercel.com → curatedexperiences project | View deployments, logs, env vars, cron jobs |
| **Supabase** | supabase.com/dashboard/project/bwpbvdmdwjqguiliymnq | Database, auth, backups, SQL editor |
| **Cloudflare** | cloudflare.com → curatedexperiences.com zone | DNS, security rules, emergency shutdown |
| **GitHub** | github.com/blairdods/curatedexperiences | Source code — every push to `main` auto-deploys |
| **Resend** | resend.com | Email logs, domain verification, API keys |
| **Google Analytics** | analytics.google.com | Visitor traffic data |

---

## 3. Admin Dashboard — Day-to-Day Operations

### Logging In
1. Go to `curatedexperiences.vercel.app/admin`
2. Enter your email address → click **Send Magic Link**
3. Check your email → click the link → you're in

Magic links expire after 1 hour. If it doesn't work, request a new one.

### Main Dashboard (`/admin`)
The first thing you see after logging in. Four at-a-glance summary cards:
- **Total Leads** — all enquiries ever received
- **Hot Leads (7+)** — leads scored 7 or above by the AI; these need immediate attention
- **Bookings** — total bookings in the system
- **Pending Approval** — knowledge base content items waiting for review

Below the cards, two panels run side by side:
- **CEO Daily Brief** — an AI-generated morning summary (see below)
- **Recent Leads** — the five most recent enquiries with name, source, date, and intent badge

**CEO Daily Brief**: generated each morning at 7am NZT. It reads the database directly and summarises overnight lead activity, hot leads needing contact, content pending approval, and priorities for the day. No action required — it refreshes automatically. If you see "No brief available yet", it means the brief cron hasn't run since the database was last cleared.

### Leads (`/admin/leads`)
- Every concierge conversation that produces a brief automatically creates a lead here
- Filter by status (new / contacted / qualified / booked / closed) or intent score (hot / warm / cold)
- Click a lead to see the full conversation transcript, extracted brief, contact info
- Update status, add notes, assign to a team member
- **To create a booking from a lead**: open the lead → click **Create Booking**

### Bookings (`/admin/bookings`)
- Kanban board: drag cards through `inquiry → deposit → planning → in progress → completed`
- Click a booking to open the detail view with the costing module
- Costing module: add sections (accommodation, transport, activities, heli, guides, flights), add line items, set per-person/per-room/flat rates — totals calculate automatically

### Accommodations (`/admin/accommodations`)
- Property database with Platinum / Gold / Silver tier structure
- Add properties with name, tier, region, nightly rate range, supplier contact, contracted status
- This is the master list Blair uses when building itineraries in the costing module

### Content (`/admin/content`)
- Edit journal articles and pages
- All changes go into a version history — nothing is permanently deleted
- **To restore a previous version**: open the content item → click Version History → select and restore

### Destinations (`/admin/destinations`)
- Full CRUD for destination pages — add, edit, or delete destinations
- Fields: name, region (North Island / South Island), tagline, full description, highlights, "Best for" tags, best seasons, hero image, gallery images, related journey slugs
- Changes publish immediately to the public `/destinations` pages
- Until at least one destination is in the database, the public site falls back to the built-in static content — so you can add destinations gradually without breaking anything

### Journeys (`/admin/journeys`)
- **Edit any journey**: click a journey → edit all fields including the narrative, tagline, itinerary days, highlights, inclusions, regions, images, pricing, and availability windows
- **Narrative field**: the long editorial description shown on the public journey page — add this to make admin-edited journeys look complete on the public site
- **Availability**: manage seasonal windows with pricing and capacity within each journey's edit page
- **Create new journeys**: use the + Create Journey button — once created in the database, they appear on the public site
- Toggle journey active/inactive status to control public visibility
- The public journey pages read from the database first; if a journey slug isn't in the database, it falls back to the built-in content

### Analytics (`/admin/analytics`)
- **Summary cards** — total leads, revenue, bookings, conversion rate; GA4 sessions/users/bounce rate (once GA4 is configured)
- **Marketing AI Agent** — click **Generate Recommendations** to get AI-powered budget suggestions based on live lead data. Each suggestion shows rationale and requires Approve or Dismiss before anything is logged. Previous decisions are shown in the history below.
- **Geographic Breakdown** — lead split by Singapore / US / Other; populates automatically as new leads come in
- **Website Traffic** — sessions and users from GA4 over the last 30 days
- **Cost Per Lead** — ad spend per market → live CPA calculation; will connect to Google Ads API automatically when ad accounts are linked
- **Conversion Funnel** — leads by pipeline stage
- **Lead Sources** — where leads are coming from (concierge, email capture, contact form)
- **Intent Distribution** — cold / warm / hot lead breakdown

### Settings (`/admin/settings`)
- Brand voice settings for the AI concierge
- Email template editor — edit the nurture email copy here
- Team member management

### Audit Log (`/admin/audit`) — admin only
Every change made through the admin dashboard is recorded here automatically. You cannot turn it off, and entries cannot be deleted.

**What it records:**
- Lead status changes, notes added, assignments
- Booking status changes, costing updates, payment link generation
- Content edits (title, body, status changes)
- Journey and destination edits
- All entries include: who made the change, what changed (before and after values), and a timestamp

**When to use it:**
- If a lead or booking looks wrong and you're not sure what happened — check the audit log for that entity's history
- If you need to confirm when a payment link was sent to a client
- If multiple team members are working on leads and there's a dispute about what was changed

**How to search it:**
- Filter by entity type (lead, booking, content, journey) and date range
- Click any entry to see the full before/after diff

This log is also what Blair uses to investigate any data issues remotely without needing to call you.

### Taking a Deposit via Stripe (`/admin/bookings/[id]`)

Once a booking has a deposit amount set in the Financials panel:

1. Click **Generate Payment Link** — creates a secure Stripe payment page for the exact deposit amount
2. Click **Send to client** — fires a branded email to the client's address with a pay button (one click)
3. Alternatively click **Copy link** to paste it into WhatsApp, iMessage, or an email manually

When the client pays:
- The booking automatically advances to **Planning** status
- The deposit is marked paid with a timestamp
- No manual action needed

**Notes:**
- Each booking gets one payment link — clicking Generate again returns the same link
- The link never expires unless you deactivate it in the Stripe dashboard
- Payment is in USD; Stripe handles card processing and currency conversion for international clients
- If a client says the link isn't working, check the Stripe dashboard (stripe.com → Payment Links) to confirm it's still active

---

## 4. The AI Concierge — How It Works

The concierge at the bottom-right of every public page is powered by **Claude Sonnet** (Anthropic's API). Here's what happens behind the scenes:

1. Visitor triggers the chat (45s timer on journey pages, exit intent, or "Start Planning" click)
2. Message goes to `/api/concierge` on Vercel
3. Route checks rate limits (20 requests/IP/hour), then calls Claude API with:
   - System prompt (brand voice, constraints, qualification goals)
   - Visitor context (geo, device, UTM source)
   - RAG results — vector search of the knowledge base (real lodge details, NZ destinations)
4. Response streams back to the browser in real time
5. After enough context is gathered, a structured brief is silently extracted and saved to `enquiries` in Supabase
6. Tony and Liam receive an email via Resend with the full brief

**What the concierge will NOT do**: quote prices, make bookings, or promise availability. It always offers to connect the visitor with a human curator.

---

## 5. Automated Processes — What Runs Without Anyone Touching It

| Process | Schedule | What it does |
|---|---|---|
| **Nurture email cron** | Daily at 9am UTC (9pm NZT) | Processes the nurture email queue — sends the next email in sequence to every lead in an active nurture programme |
| **Vercel auto-deploy** | On every push to `main` on GitHub | Builds and deploys the site in ~60 seconds |
| **Supabase daily backups** | Daily (Supabase managed) | Automatic point-in-time recovery available |
| **GDPR consent banner** | On every page load | Automatically shown to EU/EEA/UK/Switzerland visitors who haven't consented. Not shown to US or Singapore visitors. Once a visitor accepts or declines, the banner never shows again for that browser. |

The nurture cron is configured in `vercel.json` and secured with a `CRON_SECRET` environment variable. It runs automatically — you don't need to do anything.

---

## 6. Making Content Changes

### To edit a journal article or page copy
1. Admin dashboard → **Content** → find the article → **Edit**
2. Make your changes in the editor
3. Click **Save** — it publishes immediately

### To add a new journey or major structural change
This requires a code change by Blair. Email or WhatsApp with the details.

### To update the AI concierge's brand voice or tone
Admin dashboard → **Settings** → **Brand Voice** → edit and save.

### To update nurture email copy
Admin dashboard → **Settings** → **Email Templates** → edit subject/body → save. The next cron run will use the updated copy.

---

## 7. Emergency Procedures

### The site is down / returning errors

**Step 1 — Check Vercel status**
Go to vercel.com → your project → **Deployments** tab.
- If the latest deployment shows a red error: the last code push broke something. Click the previous deployment → **Promote to Production** to instantly roll back.
- If all deployments are green: the problem is elsewhere.

**Step 2 — Check Supabase**
Go to supabase.com/dashboard/project/bwpbvdmdwjqguiliymnq → **Home**.
- If there's a status warning, the database may be temporarily unavailable. Check status.supabase.com.
- Database outages are rare and self-resolve. The site will recover automatically.

**Step 3 — Check Cloudflare**
Go to cloudflare.com → curatedexperiences.com zone → **Overview**.
- If the site is under attack, Cloudflare's WAF will be blocking traffic automatically.
- Under Attack Mode (see Section 8) can be enabled if needed.

---

### The concierge is not responding / giving errors

1. Go to Vercel → your project → **Logs** tab → filter to `/api/concierge`
2. Common causes:
   - **Anthropic API outage**: check status.anthropic.com — self-resolves
   - **Rate limit hit**: the concierge has a 20 req/IP/hour limit — legitimate users won't hit this
   - **Environment variable missing**: check Vercel → project → **Settings** → **Environment Variables** that `ANTHROPIC_API_KEY` is present

---

### A lead or booking was accidentally deleted

Nothing in the admin dashboard is permanently deleted immediately.
- **Leads (enquiries)**: Go to Supabase → **SQL Editor** → run `SELECT * FROM enquiries WHERE id = '[id]'` — if it's gone from the UI, check the audit log at `/admin/audit` which records all mutations.
- **Full restore**: Supabase maintains point-in-time backups. Contact Blair to restore from backup if needed.
- **Content items**: Admin → Content item → Version History → restore any previous version.

---

### Nurture emails have stopped sending

1. Check Vercel → project → **Cron Jobs** tab → confirm `/api/nurture` ran at 9am UTC
2. If it errored: check the function logs for the error message, then contact Blair
3. Check Resend dashboard (resend.com) → **Logs** to see if emails are being rejected by the receiving mail server
4. Missing leads won't receive emails until they're re-added to a nurture sequence manually in the admin dashboard

---

## 8. Emergency Shutdown via Cloudflare

If the site is under a serious attack, experiencing abuse, or needs to be taken offline immediately:

### Option A — Enable "Under Attack Mode" (keeps site up, challenges all visitors)
1. Login to cloudflare.com
2. Select the **curatedexperiences.com** zone
3. Go to **Security** → **Settings**
4. Set **Security Level** to **Under Attack** — all visitors will see a 5-second challenge page before accessing the site. Legitimate users pass through; bots are blocked.

### Option B — Redirect all traffic (soft takedown)
1. Cloudflare → curatedexperiences.com → **Rules** → **Redirect Rules**
2. Create a rule: `When hostname equals curatedexperiences.com → Redirect to` a maintenance page URL
3. Delete the rule to restore normal traffic

### Option C — Pause Cloudflare (nuclear option — site goes offline)
1. Cloudflare → curatedexperiences.com zone → scroll to bottom → **Advanced Actions** → **Pause Cloudflare on Site**
2. This bypasses all Cloudflare protection and routes traffic directly to Vercel
3. Use only if Cloudflare itself is the problem

**To restore from any of the above**: reverse the action in Cloudflare. The site and database are unaffected — Cloudflare is purely a traffic layer.

---

## 9. Environment Variables — What They Are and Why They Matter

All secret keys live in Vercel → project → **Settings** → **Environment Variables**. Never commit these to GitHub.

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public, safe to expose) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public read key (public, safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key — full database access. **Keep secret.** |
| `ANTHROPIC_API_KEY` | Powers the AI concierge. Losing this takes concierge offline. |
| `RESEND_API_KEY` | Sends all emails. Losing this stops all email notifications. |
| `CRON_SECRET` | Authenticates the daily nurture cron job |
| `MAPBOX_ACCESS_TOKEN` | Powers the journey route maps |
| `STRIPE_SECRET_KEY` | Generates deposit payment links. Losing this disables payment link generation. |
| `STRIPE_WEBHOOK_SECRET` | Verifies incoming Stripe webhook events. Required for auto-marking deposits paid. |

If a key needs to be rotated (e.g. after a suspected leak): update it in Vercel → **Environment Variables** → **Edit** → redeploy. The old key should also be revoked in the respective service's dashboard.

---

## 10. What You Can and Cannot Break

### Safe to do — fully recoverable
- ✅ Edit any content in the CMS (version history keeps everything)
- ✅ Add / edit / delete leads, bookings, accommodations
- ✅ Update email templates and brand voice settings
- ✅ Toggle journey availability on/off
- ✅ Roll back a broken Vercel deployment to the previous version

### Requires care — recoverable but needs Blair
- ⚠️ Running SQL directly in the Supabase SQL Editor — can modify data. Use SELECT statements only unless you know what you're doing.
- ⚠️ Changing Cloudflare DNS records — can take the site offline if done incorrectly. Blair should do these.
- ⚠️ Deleting environment variables in Vercel — will break the functionality that variable powers immediately.

### Do not touch
- ❌ The Supabase **Edge Functions** tab — the `embed` function powers vector search. Don't redeploy or delete it.
- ❌ Supabase **Database** → **Extensions** — pgvector must remain enabled.
- ❌ GitHub repository settings or branch protections

---

## 11. Contact & Support

| Issue | Who to contact |
|---|---|
| Site down, code problem, database issue | **Blair** — WhatsApp first |
| Vercel billing / account | vercel.com/support |
| Supabase billing / account | supabase.com/support |
| Cloudflare | cloudflare.com/support |
| Email deliverability (Resend) | resend.com/support |
| Anthropic API (concierge down) | status.anthropic.com → check first; console.anthropic.com → support |

### If Blair is completely unreachable
1. Check if the site is actually down (use updown.io or similar to verify — not just your browser)
2. If it is: check Vercel deployments first — roll back if the latest deployment is red
3. If Vercel looks fine: check status.supabase.com and status.anthropic.com
4. Most outages are third-party and self-resolve within 30 minutes
5. Emergency Cloudflare shutdown is available if needed (Section 8)
6. Nothing in the CMS or database can cause the site to go permanently offline

---

*Last updated: May 2026 | Blair Dods*
