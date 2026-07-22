# Google Ads admin integration

The admin integration is deliberately split into reporting, drafting, approval,
and publishing. Publishing is not enabled by this implementation.

## 1. Database

Run `supabase/migrations/00035_google_ads.sql` in the production Supabase
project. It adds lead attribution fields, reporting snapshots, sync history,
and an approval-gated ad draft table.

## 2. Google Ads account access

1. Confirm the 10-digit serving account customer ID.
2. If the account is under a manager account, confirm the manager customer ID.
3. Obtain a production-enabled developer token from the manager account API
   Center. Basic access is preferred for future planning tools.
4. Add the service account email as a read-only Google Ads user. The existing
   `GA4_CLIENT_EMAIL` can be reused, or a dedicated
   `GOOGLE_ADS_SERVICE_ACCOUNT_EMAIL` can be supplied.
5. Add the variables documented in `.env.local.example` to Vercel.

The integration uses Google Ads API v24 through the REST search stream. It does
not require the local media library and never uploads campaign mutations.

## 3. Conversion actions

Create these website conversion actions, then add their public labels to
Vercel:

| Event | Recommended role | Count |
| --- | --- | --- |
| `lead_created` | Primary | One |
| `intent_score_high` | Primary after validation | One |
| `email_captured` | Secondary | One |
| `concierge_engaged` | Secondary | One |
| `ai_brief_generated` | Secondary | One |

If the equivalent GA4 events are imported into Google Ads, leave the imported
actions secondary so the same event is not used twice by bidding.

Turn on `NEXT_PUBLIC_GOOGLE_ADS_ENHANCED_CONVERSIONS` only after the account has
accepted Google's customer-data terms.

## 4. Attribution

The edge proxy retains last-touch UTM values plus `gclid`, `gbraid`, and
`wbraid` for 90 days. Lead creation resolves acquisition source separately from
the form or concierge surface that captured the lead.

Use this final URL suffix on campaigns that do not already provide UTMs:

```text
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}
```

Keep Google Ads auto-tagging enabled as well.

## 5. Media safety

The creative workspace reads the tracked image index and remote-source map. An
asset is eligible only when:

- `Paid Ads OK` is `Yes`; and
- it has a durable provider URL or an existing tracked public URL.

Raw files in `/asset-library/` are ignored by Git and are not copied, generated,
or required by the live integration. Local-only assets are excluded from the ad
workspace even if they are present on a developer machine.

## 6. Operation

- `/admin/ads` shows reporting, reconciliation, search-term review, and ad
  drafts.
- Admins and analysts can run an on-demand 30-day sync.
- The daily Vercel cron refreshes seven days of data.
- Admins and curators can generate drafts from live destinations, journeys, and
  journal articles.
- Only admins can approve or reject drafts.
- Approval does not publish a campaign.
