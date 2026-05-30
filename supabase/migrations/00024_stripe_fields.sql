-- Add Stripe payment fields to bookings
alter table public.bookings
  add column if not exists stripe_payment_link_id   text,
  add column if not exists stripe_payment_link_url  text,
  add column if not exists stripe_session_id        text,
  add column if not exists stripe_payment_intent_id text;
