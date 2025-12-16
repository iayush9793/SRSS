-- Migration: Add Name Column to Students Table
-- Run this SQL in Supabase Dashboard > SQL Editor

-- Add name column to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing records to have a default name (optional - you can remove this if you want NULL)
-- UPDATE students SET name = roll_no WHERE name IS NULL;

-- Create index for name for faster searches
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);

-- Note: If you want to make name required for new records, you can add a constraint:
-- ALTER TABLE students ALTER COLUMN name SET NOT NULL;
-- But this will fail if there are existing NULL values, so update them first.

