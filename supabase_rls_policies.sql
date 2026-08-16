# Supabase RLS + Storage Policies for E-Cell JNCT PU
# Run this entire block in: https://supabase.com/dashboard/project/quisgptwimxalflbaakh/sql

## ─── 0. SCHEMA ALTERATIONS FOR MISSING COLUMNS ──────────────────────────────
-- Run this if your events and members tables are missing these columns:
ALTER TABLE events ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

## ─── 1. ENABLE RLS ON ALL TABLES ───────────────────────────────────────────

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE members_join_requests ENABLE ROW LEVEL SECURITY;


## ─── 2. EVENTS ──────────────────────────────────────────────────────────────

-- Public can only read published events
CREATE POLICY "Public read published events"
  ON events FOR SELECT
  USING (status = 'published');

-- Service role (server) can do everything (bypasses RLS — this is correct)
-- No additional policy needed; service_role always bypasses RLS


## ─── 3. EVENT_FIELDS ────────────────────────────────────────────────────────

-- Public can read fields for published events only
CREATE POLICY "Public read fields for published events"
  ON event_fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_fields.event_id AND e.status = 'published'
    )
  );


## ─── 4. EVENT_REGISTRATIONS ─────────────────────────────────────────────────

-- Public cannot read registrations (PII) — only service_role can
-- Public can only insert (register)
CREATE POLICY "Public can register for events"
  ON event_registrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events e
      WHERE e.id = event_registrations.event_id AND e.status = 'published'
    )
  );

-- No SELECT policy for public — only service_role reads registrations


## ─── 5. MEMBERS ─────────────────────────────────────────────────────────────

-- Public can read all members (team page)
CREATE POLICY "Public read members"
  ON members FOR SELECT
  USING (true);

-- No public INSERT/UPDATE/DELETE — only service_role


## ─── 6. MEMBERS_JOIN_REQUESTS ───────────────────────────────────────────────

-- Public can submit join requests
CREATE POLICY "Public can submit join requests"
  ON members_join_requests FOR INSERT
  WITH CHECK (true);

-- Public cannot read join requests (PII — phones, colleges)
-- Only service_role reads them


## ─── 7. STORAGE: ecell-assets BUCKET ────────────────────────────────────────
## Run in Supabase dashboard: Storage → Policies → ecell-assets

-- Allow public read of uploaded files (needed for displaying images)
CREATE POLICY "Public read ecell-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ecell-assets');

-- Allow anon uploads ONLY to registrations/* path, max enforced by app
CREATE POLICY "Anon upload to registrations folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ecell-assets'
    AND (storage.foldername(name))[1] = 'registrations'
  );

-- Deny anon DELETE and UPDATE (prevent overwrite/deletion)
-- No DELETE or UPDATE policy for anon role = implicitly denied
