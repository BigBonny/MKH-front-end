-- Fix RLS policy for cart_items table
-- The issue is that auth.uid() returns UUID but user_id is VARCHAR

-- Drop existing policies
DROP POLICY IF EXISTS "Allow service role full access" ON cart_items;
DROP POLICY IF EXISTS "Allow users full access to own cart" ON cart_items;

-- Create new policies with proper type handling
-- Allow service role to do everything
CREATE POLICY "Allow service role full access" ON cart_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users to manage their own cart items
-- Convert both sides to text for proper comparison
CREATE POLICY "Allow users full access to own cart" ON cart_items
  FOR ALL USING (auth.uid()::text = user_id);

-- Alternative approach - allow any authenticated user to insert/update their own cart
-- This might be more permissive but should work
CREATE POLICY "Allow users to manage own cart" ON cart_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow users to update own cart" ON cart_items
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Allow users to read own cart" ON cart_items
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Allow users to delete own cart" ON cart_items
  FOR DELETE USING (auth.uid()::text = user_id);

-- Grant permissions
GRANT ALL ON cart_items TO service_role;
GRANT ALL ON cart_items TO authenticated;

-- Test the policy by checking current user
SELECT 
  auth.uid() as current_auth_uid,
  auth.uid()::text as current_auth_uid_text,
  'user_3AwO4gBinNztaVCIg0JNIMrL26v' as sample_user_id;
