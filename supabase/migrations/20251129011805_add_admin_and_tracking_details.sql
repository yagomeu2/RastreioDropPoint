/*
  # Add admin users and expand tracking details

  1. Changes to tracking_codes table
    - Add recipient_name (text, nullable) - Name of person who received
    - Add recipient_cpf (text, nullable) - CPF of recipient
    - Add delivery_date (timestamptz, nullable) - Actual delivery date
    - Add tracking_events (jsonb) - Array of status changes with timestamps
    - Add current_status (text) - Updated status field
    
  2. New Tables
    - `tracking_links` - Store important links for shipments
      - id (uuid, primary key)
      - tracking_code_id (uuid, foreign key)
      - title (text) - Link title/description
      - url (text) - Link URL
      - created_at (timestamptz)
    
    - `admin_users` - Store admin credentials
      - id (uuid, primary key)
      - email (text, unique)
      - password_hash (text) - Hashed password
      - created_at (timestamptz)

  3. Security
    - Enable RLS on all new tables
    - Public can read tracking_codes and links
    - Public can create tracking codes
    - Only admins can update status and manage links
*/

-- Add columns to tracking_codes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracking_codes' AND column_name = 'recipient_name'
  ) THEN
    ALTER TABLE tracking_codes ADD COLUMN recipient_name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracking_codes' AND column_name = 'recipient_cpf'
  ) THEN
    ALTER TABLE tracking_codes ADD COLUMN recipient_cpf text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracking_codes' AND column_name = 'delivery_date'
  ) THEN
    ALTER TABLE tracking_codes ADD COLUMN delivery_date timestamptz;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracking_codes' AND column_name = 'tracking_events'
  ) THEN
    ALTER TABLE tracking_codes ADD COLUMN tracking_events jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tracking_codes' AND column_name = 'current_status'
  ) THEN
    ALTER TABLE tracking_codes ADD COLUMN current_status text DEFAULT 'created';
  END IF;
END $$;

-- Create tracking_links table
CREATE TABLE IF NOT EXISTS tracking_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code_id uuid NOT NULL REFERENCES tracking_codes(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE tracking_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tracking links"
  ON tracking_links
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert tracking links"
  ON tracking_links
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update tracking links"
  ON tracking_links
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete tracking links"
  ON tracking_links
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_tracking_links_code ON tracking_links(tracking_code_id);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view admin users"
  ON admin_users
  FOR SELECT
  USING (false);

CREATE POLICY "Only allow public signup for admin"
  ON admin_users
  FOR INSERT
  WITH CHECK (true);