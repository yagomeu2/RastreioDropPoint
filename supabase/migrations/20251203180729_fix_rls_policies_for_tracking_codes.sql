/*
  # Fix RLS Policies for tracking_codes table

  1. Problem Identified
    - RLS is enabled on tracking_codes table
    - But NO policies exist, blocking all access
    - This causes "Erro ao gerar códigos" and "Código não encontrado" errors

  2. Security Policies
    - Add policy for public SELECT access (anyone can track packages)
    - Add policy for public INSERT access (anyone can create tracking codes)
    - Add policy for public UPDATE access (anyone can update status)
    - Add policy for public DELETE access (for cleanup)

  3. Notes
    - These are intentionally permissive policies for a public tracking system
    - All operations use USING (true) to allow public access
    - This matches the original migration intent but ensures policies are actually created
*/

-- Drop existing policies if they exist (in case of conflicts)
DROP POLICY IF EXISTS "Anyone can view tracking codes" ON tracking_codes;
DROP POLICY IF EXISTS "Anyone can create tracking codes" ON tracking_codes;
DROP POLICY IF EXISTS "Anyone can update tracking codes" ON tracking_codes;
DROP POLICY IF EXISTS "Anyone can delete tracking codes" ON tracking_codes;

-- Create SELECT policy for public read access
CREATE POLICY "Anyone can view tracking codes"
  ON tracking_codes
  FOR SELECT
  USING (true);

-- Create INSERT policy for public create access
CREATE POLICY "Anyone can create tracking codes"
  ON tracking_codes
  FOR INSERT
  WITH CHECK (true);

-- Create UPDATE policy for public update access
CREATE POLICY "Anyone can update tracking codes"
  ON tracking_codes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create DELETE policy for public delete access
CREATE POLICY "Anyone can delete tracking codes"
  ON tracking_codes
  FOR DELETE
  USING (true);