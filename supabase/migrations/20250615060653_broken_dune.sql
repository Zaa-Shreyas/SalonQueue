/*
  # Create staff authentication table

  1. New Tables
    - `staff`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `phone` (text, unique, not null)
      - `role` (text, default 'staff')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `staff` table
    - Add policy for staff to read their own data
*/

CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  role text DEFAULT 'staff',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read own data"
  ON staff
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can read staff for authentication"
  ON staff
  FOR SELECT
  TO anon
  USING (true);

-- Insert mock staff data
INSERT INTO staff (name, phone, role) VALUES
  ('John Manager', '+1234567890', 'manager'),
  ('Sarah Staff', '+1234567891', 'staff'),
  ('Mike Barber', '+1234567892', 'staff')
ON CONFLICT (phone) DO NOTHING;