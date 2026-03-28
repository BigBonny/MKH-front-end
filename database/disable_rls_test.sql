-- Temporarily disable RLS to test basic functionality
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Test basic insert without RLS
-- This should work if the table structure is correct

-- Check if we can insert a test record
INSERT INTO cart_items (user_id, product_id, name, price, quantity)
VALUES ('test_user', 'test_product', 'Test Item', 29.99, 1)
ON CONFLICT (user_id, product_id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity,
  updated_at = NOW();

-- Check if the test record was inserted
SELECT * FROM cart_items WHERE user_id = 'test_user';

-- Clean up test record
DELETE FROM cart_items WHERE user_id = 'test_user';
