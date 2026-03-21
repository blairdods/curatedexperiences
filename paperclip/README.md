# Paperclip Agent Configuration

## Quick Start

```bash
# From the project root:
npx paperclipai run --data-dir ./paperclip/data

# During onboarding:
# - Database: Use embedded (default)
# - LLM: Enter your Anthropic API key
# - Storage: Local disk (default)
# - Auth: local_trusted (development)
```

## After Onboarding

Create agents via the Paperclip UI at http://localhost:3100 using the
configurations in `agents/` directory.

## Agents

| Agent | Role | Model | Heartbeat | Budget |
|-------|------|-------|-----------|--------|
| CEO | Daily brief + coordination | Haiku | Daily 7am NZT | $40/mo |
| Content | Draft articles + email copy | Sonnet | Every 4 hours | $60/mo |
| SEO+Ads | Rank monitoring + ad reports | Haiku | Every 6 hours | $30/mo |
| Concierge | Governance wrapper | Sonnet | Continuous | $35/mo |
