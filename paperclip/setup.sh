#!/bin/bash
# Paperclip Agent Setup Script
# Run after `npx paperclipai run --data-dir ./paperclip/data` is running

PAPERCLIP_URL="${PAPERCLIP_URL:-http://localhost:3100}"

echo "🚀 Setting up Paperclip agents for Curated Experiences"
echo "   Paperclip URL: $PAPERCLIP_URL"
echo ""

# Check Paperclip is running
if ! curl -sf "$PAPERCLIP_URL/api/health" > /dev/null 2>&1; then
  echo "❌ Paperclip is not running at $PAPERCLIP_URL"
  echo "   Start it with: npx paperclipai run --data-dir ./paperclip/data"
  exit 1
fi

echo "✅ Paperclip is running"
echo ""

# Create agents
for agent_file in paperclip/agents/*.json; do
  agent_name=$(jq -r '.name' "$agent_file")
  echo "Creating agent: $agent_name"

  response=$(curl -sf -X POST "$PAPERCLIP_URL/api/agents" \
    -H "Content-Type: application/json" \
    -d @"$agent_file" 2>&1)

  if [ $? -eq 0 ]; then
    echo "  ✓ Created: $agent_name"
  else
    echo "  ⚠ May already exist or failed: $agent_name"
    echo "    $response"
  fi
done

echo ""
echo "✅ Done! Open $PAPERCLIP_URL to manage your agents."
echo ""
echo "Next steps:"
echo "  1. Approve pending agents in the Paperclip dashboard"
echo "  2. Set environment variables for each agent (Supabase URL, keys)"
echo "  3. Trigger a manual wakeup on the CEO agent to test the daily brief"
