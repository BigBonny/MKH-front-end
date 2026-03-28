-- Create purchased_items table
CREATE TABLE IF NOT EXISTS purchased_items (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL, -- Clerk user ID
  stripe_payment_id VARCHAR(255) NOT NULL, -- Stripe payment/session ID
  items JSONB NOT NULL, -- Array of purchased items with details
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'eur',
  status VARCHAR(50) DEFAULT 'completed', -- completed, pending, failed, refunded
  customer_email VARCHAR(255),
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchased_items_user_id ON purchased_items(user_id);
CREATE INDEX IF NOT EXISTS idx_purchased_items_stripe_payment_id ON purchased_items(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_purchased_items_status ON purchased_items(status);
CREATE INDEX IF NOT EXISTS idx_purchased_items_created_at ON purchased_items(created_at);
CREATE INDEX IF NOT EXISTS idx_purchased_items_items ON purchased_items USING GIN(items);

-- Enable Row Level Security
ALTER TABLE purchased_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow service role to do everything
CREATE POLICY "Allow service role full access" ON purchased_items
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow authenticated users to read their own purchases
CREATE POLICY "Allow users to read own purchases" ON purchased_items
  FOR SELECT USING (auth.uid()::text = user_id);

-- Allow authenticated users to insert their own purchases
CREATE POLICY "Allow users to insert own purchases" ON purchased_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Grant permissions
GRANT ALL ON purchased_items TO service_role;
GRANT SELECT, INSERT ON purchased_items TO authenticated;

-- Add updated_at trigger
CREATE TRIGGER update_purchased_items_updated_at
  BEFORE UPDATE ON purchased_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data structure for items JSONB column:
-- [
--   {
--     "id": "item_1",
--     "name": "MKH T-Shirt",
--     "price": 29.99,
--     "quantity": 2,
--     "image": "/tshirt.jpg",
--     "size": "L",
--     "color": "Black"
--   }
-- ]
