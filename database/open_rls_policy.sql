-- Create completely open RLS policy for authenticated users
-- This will allow any authenticated user to manage cart items
-- We can make it more restrictive later once we confirm it works

-- Re-enable RLS if it was disabled
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow service role full access" ON cart_items;
DROP POLICY IF EXISTS "Allow users full access to own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow users to manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow users to update own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow users to read own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow users to delete own cart" ON cart_items;
DROP POLICY IF EXISTS "Service role full access" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;

-- Create completely open policy for authenticated users
CREATE POLICY "Allow authenticated users full access" ON cart_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow service role too
CREATE POLICY "Allow service role full access" ON cart_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT ALL ON cart_items TO service_role;
GRANT ALL ON cart_items TO authenticated;
GRANT ALL ON cart_items TO anon;

-- Test query to see current user info
SELECT 
  auth.uid() as uid,
  auth.role() as role,
  auth.jwt() ->> 'role' as jwt_role,
  current_setting('request.jwt.claims', true) as all_claims;
