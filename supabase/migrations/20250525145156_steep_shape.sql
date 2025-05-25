/*
  # Create business_details table

  1. New Tables
    - `business_details`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `shop_name` (text, not null)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `business_details` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS business_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  shop_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE business_details ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own business details
CREATE POLICY "Users can read own business details"
  ON business_details
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own business details
CREATE POLICY "Users can insert own business details"
  ON business_details
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own business details
CREATE POLICY "Users can update own business details"
  ON business_details
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);