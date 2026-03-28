-- Create RLS policies that work with Clerk user IDs
-- The issue is that Clerk user IDs (like 'user_3AwO4gBinNztaVCIg0JNIMrL26v') 
-- are different from Supabase auth.uid() UUIDs

-- Re-enable RLS
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
DROP POLICY IF EXISTS "Allow authenticated users full access" ON cart_items;

-- Since we're using Clerk, not Supabase Auth, we need a different approach
-- The user_id in the table should match the Clerk user ID passed from the frontend
-- We'll use the JWT claims from Clerk to match

-- Allow service role to do everything
CREATE POLICY "Service role full access" ON cart_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- For Clerk integration, we need to check if the user_id matches
-- Clerk passes the user ID in the JWT sub claim or in metadata
-- This policy allows authenticated users to only access their own data
CREATE POLICY "Users can only access own cart" ON cart_items
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    user_id = COALESCE(
      auth.jwt() ->> 'sub',
      auth.jwt() -> 'user_metadata' ->> 'clerk_user_id',
      auth.uid()::text
    )
  );

CREATE POLICY "Users can only insert own cart" ON cart_items
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    user_id = COALESCE(
      auth.jwt() ->> 'sub',
      auth.jwt() -> 'user_metadata' ->> 'clerk_user_id',
      auth.uid()::text
    )
  );

CREATE POLICY "Users can only update own cart" ON cart_items
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    user_id = COALESCE(
      auth.jwt() ->> 'sub',
      auth.jwt() -> 'user_metadata' ->> 'clerk_user_id',
      auth.uid()::text
    )
  );

CREATE POLICY "Users can only delete own cart" ON cart_items
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    user_id = COALESCE(
      auth.jwt() ->> 'sub',
      auth.jwt() -> 'user_metadata' ->> 'clerk_user_id',
      auth.uid()::text
    )
  );

-- Grant permissions
GRANT ALL ON cart_items TO service_role;
GRANT ALL ON cart_items TO authenticated;

-- Debug query to see what Clerk sends in the JWT
SELECT 
  auth.uid() as supabase_uid,
  auth.jwt() ->> 'sub' as jwt_sub,
  auth.jwt() -> 'user_metadata' as user_metadata,
  auth.jwt() -> 'user_metadata' ->> 'clerk_user_id' as clerk_user_id,
  auth.jwt() ->> 'role' as jwt_role,
  auth.role() as auth_role;
