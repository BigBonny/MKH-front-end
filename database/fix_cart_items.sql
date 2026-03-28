-- Add missing image column to cart_items table
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS image VARCHAR(500);

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cart_items' 
ORDER BY ordinal_position;
