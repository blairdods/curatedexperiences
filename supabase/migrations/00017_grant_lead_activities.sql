-- Grant service_role access to lead_activities (missing from original migration)
grant all on lead_activities to service_role;
grant all on lead_activities to authenticated;

-- Also grant service_role access to enquiries and bookings
-- (service client needs these for lead PATCH route and booking creation)
grant all on enquiries to service_role;
grant all on bookings to service_role;
