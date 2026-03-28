-- Drop and recreate cart_items table with user_id as VARCHAR to match Clerk user IDs
DROP TABLE IF EXISTS cart_items CASCADE;

-- Create cart_items table for persistent cart storage
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Clerk user ID as string
  product_id VARCHAR(255) NOT NULL, -- Product identifier
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure user can't have duplicate items in cart
  UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_cart_items_created_at ON cart_items(created_at);

-- Enable Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow service role to do everything
CREATE POLICY "Allow service role full access" ON cart_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users to manage their own cart items
CREATE POLICY "Allow users full access to own cart" ON cart_items
  FOR ALL USING (auth.uid()::text = user_id);

-- Grant permissions
GRANT ALL ON cart_items TO service_role;
GRANT ALL ON cart_items TO authenticated;

-- Add updated_at trigger
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify the table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;
