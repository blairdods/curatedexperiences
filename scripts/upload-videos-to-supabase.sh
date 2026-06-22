#!/usr/bin/env bash
# Upload optimised MP4 videos to Supabase Storage for Vercel production.
# Only needed for files >50 MB — smaller files are served from /public/assets/videos/.
#
# Files that MUST be in Supabase Storage for Vercel (>50 MB):
#   234422-queen-charlotte-track-marlborough-sounds.mp4  (88 MB)
#   234448-abel-tasman-national-park-nelson-tasman.mp4   (66 MB)
#   232888-wai-o-tapu-rotorua-aerials.mp4                (46 MB — borderline, upload to be safe)
#
# Usage:
#   chmod +x scripts/upload-videos-to-supabase.sh
#   ./scripts/upload-videos-to-supabase.sh

set -euo pipefail

PROJECT_REF="bwpbvdmdwjqguiliymnq"
BUCKET="videos"
ASSET_DIR="$(dirname "$0")/../public/assets/videos"

supabase storage create-bucket --project-ref "$PROJECT_REF" "$BUCKET" \
  --public 2>/dev/null || true

echo "Uploading large MP4 videos to Supabase Storage (bucket: $BUCKET)"
echo ""

LARGE_FILES=(
  "234422-queen-charlotte-track-marlborough-sounds.mp4"
  "234448-abel-tasman-national-park-nelson-tasman.mp4"
  "232888-wai-o-tapu-rotorua-aerials.mp4"
)

for fname in "${LARGE_FILES[@]}"; do
  f="$ASSET_DIR/$fname"
  if [ ! -f "$f" ]; then
    echo "✗ Not found: $fname"
    continue
  fi
  echo "→ Uploading: $fname"
  supabase storage cp \
    --project-ref "$PROJECT_REF" \
    --bucket "$BUCKET" \
    --content-type "video/mp4" \
    "$f" \
    "ss:///$BUCKET/$fname" \
    && echo "  ✓ Done" \
    || echo "  ✗ Failed"
  echo ""
done

echo "Done. Update src values in lib/data/videos.ts for uploaded files:"
echo "  https://${PROJECT_REF}.supabase.co/storage/v1/object/public/${BUCKET}/<filename>"
