/*
  # Create salon queue management schema

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `duration` (integer, minutes)
      - `price` (decimal)
      - `created_at` (timestamp)
    
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `service` (text)
      - `status` (text, enum: waiting, in-progress, completed)
      - `estimated_wait` (integer, minutes)
      - `actual_wait` (integer, minutes, nullable)
      - `created_at` (timestamp)
      - `started_at` (timestamp, nullable)
      - `completed_at` (timestamp, nullable)
    
    - `queue_analytics`
      - `id` (uuid, primary key)
      - `date` (date)
      - `hour` (integer)
      - `customer_count` (integer)
      - `avg_wait_time` (integer)
      - `service_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a walk-in system)
*/

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration integer NOT NULL DEFAULT 30,
  price decimal(10,2) NOT NULL DEFAULT 0.00,
  created_at timestamptz DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'in-progress', 'completed')),
  estimated_wait integer NOT NULL DEFAULT 30,
  actual_wait integer,
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Queue analytics table
CREATE TABLE IF NOT EXISTS queue_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  hour integer NOT NULL DEFAULT EXTRACT(hour FROM now()),
  customer_count integer NOT NULL DEFAULT 0,
  avg_wait_time integer NOT NULL DEFAULT 0,
  service_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (walk-in system)
CREATE POLICY "Public can read services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read customers"
  ON customers
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert customers"
  ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update customers"
  ON customers
  FOR UPDATE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read analytics"
  ON queue_analytics
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert default services
INSERT INTO services (name, duration, price) VALUES
  ('Haircut', 30, 25.00),
  ('Hair Wash & Blow Dry', 45, 35.00),
  ('Hair Color', 120, 80.00),
  ('Beard Trim', 20, 15.00),
  ('Facial', 60, 50.00),
  ('Manicure', 40, 30.00),
  ('Pedicure', 50, 40.00)
ON CONFLICT DO NOTHING;

-- Create function to update analytics
CREATE OR REPLACE FUNCTION update_queue_analytics()
RETURNS trigger AS $$
BEGIN
  -- Update analytics when a customer is completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO queue_analytics (date, hour, customer_count, avg_wait_time, service_type)
    VALUES (
      CURRENT_DATE,
      EXTRACT(hour FROM now()),
      1,
      COALESCE(NEW.actual_wait, NEW.estimated_wait),
      NEW.service
    )
    ON CONFLICT (date, hour, service_type) DO UPDATE SET
      customer_count = queue_analytics.customer_count + 1,
      avg_wait_time = (queue_analytics.avg_wait_time * queue_analytics.customer_count + 
                      COALESCE(NEW.actual_wait, NEW.estimated_wait)) / (queue_analytics.customer_count + 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_analytics_trigger
  AFTER UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_queue_analytics();