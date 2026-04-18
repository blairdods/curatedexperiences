-- Editable email templates for nurture sequences
create table if not exists email_templates (
  id uuid primary key default gen_random_uuid(),
  sequence_type text not null check (sequence_type in ('high_intent', 'mid_intent')),
  step_index int not null,
  subject text not null,
  preview_text text,
  body_html text not null,
  delay_days int not null default 0,
  active boolean not null default true,
  updated_by text,
  updated_at timestamptz default now(),
  unique (sequence_type, step_index)
);

-- Seed high_intent sequence (5 emails)
insert into email_templates (sequence_type, step_index, subject, preview_text, body_html, delay_days) values
('high_intent', 0, 'Your New Zealand journey starts here', 'We''d love to help you plan something extraordinary',
'<p>Thank you for sharing your travel plans with us — we''re genuinely excited about what we can create for you.</p>
<p>One of our curators, Tony or Liam, will be in touch within 24 hours to start shaping your journey. In the meantime, here''s a taste of what''s possible:</p>
<p><a href="https://curatedexperiences.com/journeys/the-masterpiece">The Masterpiece</a> — our most popular journey, 14 days from Queenstown to Fiordland.</p>
<p>We''ll speak soon.</p>
<p>Warm regards,<br/>Tony & Liam</p>', 0),

('high_intent', 1, 'A destination worth dreaming about', 'Fiordland — where the world feels brand new',
'<p>If there''s one place in New Zealand that stops travellers in their tracks, it''s Fiordland.</p>
<p>Ancient rainforest dropping into mirror-still fiords. Morning mist that burns off to reveal Mitre Peak. An overnight cruise where you fall asleep to the sound of waterfalls.</p>
<p><a href="https://curatedexperiences.com/destinations/fiordland">Explore Fiordland</a></p>
<p>We''d love to include it in your journey if it appeals.</p>', 2),

('high_intent', 2, 'What our travellers say', 'Real stories from people who''ve experienced New Zealand with us',
'<p><em>"We''ve travelled the world, but nothing has come close to what Tony and the team crafted for us in New Zealand. Every single day exceeded our expectations."</em></p>
<p>— Sarah & David Chen, San Francisco</p>
<p><a href="https://curatedexperiences.com/stories">Read more traveller stories</a></p>', 5),

('high_intent', 3, 'What makes Curated Experiences different', 'We don''t sell tours — we curate time',
'<p>There are many ways to visit New Zealand. Here''s why people choose us:</p>
<p><strong>Local expertise.</strong> We''re New Zealanders who know places that don''t appear in any guidebook.</p>
<p><strong>Truly bespoke.</strong> No two journeys are alike. Every itinerary is designed from scratch.</p>
<p><strong>The details.</strong> The lodge whose owner opens a bottle of something special. The guide who knows the mountain like the back of his hand.</p>
<p><a href="https://curatedexperiences.com/about">Our story</a></p>', 9),

('high_intent', 4, 'Ready to start planning?', 'No obligation — just a conversation about your ideas',
'<p>We''ve been thinking about your New Zealand journey — and we''d love to start putting something together.</p>
<p>There''s no obligation, no pressure. Just a conversation about what moves you, and how we might bring it to life.</p>
<p><a href="mailto:hello@curatedexperiences.com?subject=Ready to start planning">Reply to this email</a> or <a href="https://curatedexperiences.com">chat with our concierge</a> — we''re here whenever you''re ready.</p>
<p>Tony & Liam</p>', 14);

-- Seed mid_intent sequence (5 emails)
insert into email_templates (sequence_type, step_index, subject, preview_text, body_html, delay_days) values
('mid_intent', 0, 'New Zealand — closer than you think', 'A place that changes how you see the world',
'<p>There''s something about New Zealand that''s hard to put into words until you''ve felt it — the scale of the landscapes, the warmth of the people, the feeling that the whole country was designed for slow, meaningful travel.</p>
<p><a href="https://curatedexperiences.com/journal/why-new-zealand-is-the-worlds-most-underrated-luxury-destination">Why NZ is the world''s most underrated luxury destination</a></p>', 0),

('mid_intent', 1, 'Three journeys, three ways to experience NZ', 'Adventure, wine, or the full South Island odyssey',
'<p>Every journey we design starts with a conversation — but here are three of our most loved starting points:</p>
<p><a href="https://curatedexperiences.com/journeys/the-masterpiece">The Masterpiece</a> — 14 days, Queenstown to Fiordland</p>
<p><a href="https://curatedexperiences.com/journeys/the-epicurean">The Epicurean</a> — 10 days through NZ''s finest wine regions</p>
<p><a href="https://curatedexperiences.com/journeys/the-expedition">The Expedition</a> — 12 days of glacier hikes and starlit skies</p>
<p>Each is fully customisable. What appeals to you?</p>', 4),

('mid_intent', 2, 'Meet Tony and Liam', 'The people behind your journey',
'<p>Curated Experiences is a two-person operation — Tony and Liam, both New Zealanders with decades of luxury travel expertise.</p>
<p>When you plan a journey with us, you''re not handed off to a call centre. You''re working directly with the people who designed every detail.</p>
<p><a href="https://curatedexperiences.com/about">Read our story</a></p>', 10),

('mid_intent', 3, 'When to visit New Zealand', 'Every season has its magic',
'<p>New Zealand''s seasons are reversed from the Northern Hemisphere, which means:</p>
<p><strong>October–December:</strong> Spring wildflowers, fewer crowds, stunning hiking weather.</p>
<p><strong>January–March:</strong> Summer — long days, warm lakes, wine harvest in March.</p>
<p><strong>April–May:</strong> Autumn — golden trees, cooler air, incredible light.</p>
<p><strong>June–September:</strong> Winter — skiing in Queenstown, Southern Lights, cosy lodges.</p>
<p>Whenever you''re thinking of visiting, we can design something perfect.</p>', 18),

('mid_intent', 4, 'Still dreaming of New Zealand?', 'We''re here whenever you''re ready',
'<p>No rush. The mountains aren''t going anywhere.</p>
<p>Whenever the time feels right, we''d love to help you plan something extraordinary. Just reply to this email or <a href="https://curatedexperiences.com">visit our website</a>.</p>
<p>Warmly,<br/>Tony & Liam</p>', 28);

-- RLS
alter table email_templates enable row level security;

create policy "Authenticated users can read email templates"
  on email_templates for select
  to authenticated
  using (true);
