-- Update booking status default from 'confirmed' to 'deposit'
-- and migrate any existing 'confirmed' bookings to 'deposit'
alter table bookings alter column status set default 'deposit';

update bookings set status = 'deposit' where status = 'confirmed';
