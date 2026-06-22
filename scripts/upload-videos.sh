#!/usr/bin/env bash
# Upload all MP4 videos to Supabase Storage.
# Requires the 'videos' bucket to already exist as a public bucket.
# Run from the project root.

set -euo pipefail

BUCKET="videos"
VIDEO_DIR="public/assets/videos"

echo "Uploading videos to Supabase Storage (bucket: $BUCKET)"
echo ""

for f in "$VIDEO_DIR"/*.mp4; do
  fname=$(basename "$f")
  echo "→ $fname"
  supabase storage cp "$f" "ss:///$BUCKET/$fname" --experimental
  echo ""
done

echo "All done."
