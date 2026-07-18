alter table public.journal_articles
  add column if not exists hero_image_position jsonb;
