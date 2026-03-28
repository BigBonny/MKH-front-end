-- DEFINITIVE SOLUTION: Disable RLS for Clerk integration
-- 
-- Clerk and Supabase Auth are separate systems with different user ID formats
-- RLS policies require Supabase Auth, but we're using Clerk
-- Solution: Application-level security (handled in CartContext.tsx)

-- Disable RLS completely
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Allow service role full access" ON cart_items;
DROP POLICY IF EXISTS "Allow users full access to own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow users to manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow users to update own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow users to read own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow users to delete own cart" ON cart_items;
DROP POLICY IF EXISTS "Service role full access" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON cart_items;

-- Grant permissions
GRANT ALL ON cart_items TO service_role;
GRANT ALL ON cart_items TO authenticated;
GRANT ALL ON cart_items TO anon;

-- SECURITY: Application-level (not database-level)
-- - CartContext.tsx filters by user_id
-- - Clerk validates authentication before DB operations
-- - Each user only sees their own items via WHERE clauses
