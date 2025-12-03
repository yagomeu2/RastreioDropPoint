/*
  # Create tracking codes table for SHP EXPRESS

  1. New Tables
    - `tracking_codes`
      - `id` (uuid, primary key) - Unique identifier
      - `code` (text, unique, not null) - Generated tracking code (BR + 12 digits + F/T/M)
      - `account` (text, nullable) - Optional account information
      - `real_tracking_code` (text, nullable) - Optional real tracking code
      - `status` (text, default 'created') - Status of the shipment
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `tracking_codes` table
    - Add policy for public read access (anyone can track)
    - Add policy for public insert access (anyone can create codes)
    - Add policy for public update access (anyone can update status)

  3. Indexes
    - Index on `code` for fast lookups
    - Index on `account` for filtering by account
*/

CREATE TABLE IF NOT EXISTS tracking_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  account text,
  real_tracking_code text,
  status text DEFAULT 'created' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE tracking_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tracking codes"
  ON tracking_codes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create tracking codes"
  ON tracking_codes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update tracking codes"
  ON tracking_codes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_tracking_codes_code ON tracking_codes(code);
CREATE INDEX IF NOT EXISTS idx_tracking_codes_account ON tracking_codes(account);
CREATE INDEX IF NOT EXISTS idx_tracking_codes_created_at ON tracking_codes(created_at DESC);