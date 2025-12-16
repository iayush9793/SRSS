-- Migration: Add Fees Columns to Students Table
-- Run this SQL in Supabase Dashboard > SQL Editor

-- Add fees columns to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS fee_status TEXT DEFAULT 'Unpaid' CHECK (fee_status IN ('Paid', 'Unpaid', 'Partial'));

-- Create index for fee status for faster queries
CREATE INDEX IF NOT EXISTS idx_students_fee_status ON students(fee_status);

-- Update existing records to have default values
UPDATE students 
SET 
  total_amount = COALESCE(total_amount, 0.00),
  amount_paid = COALESCE(amount_paid, 0.00),
  fee_status = COALESCE(fee_status, 'Unpaid')
WHERE total_amount IS NULL OR amount_paid IS NULL OR fee_status IS NULL;

