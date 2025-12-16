-- Supabase Database Schema for Student Management System
-- Run this SQL in Supabase Dashboard > SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,  -- Changed from UUID to TEXT (for Firebase Auth UIDs)
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_no SERIAL,
  name TEXT,
  roll_no TEXT NOT NULL,
  contact_no TEXT NOT NULL,
  batch_year TEXT NOT NULL,
  course TEXT NOT NULL,
  documents TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_batch_year ON students(batch_year);
CREATE INDEX IF NOT EXISTS idx_students_course ON students(course);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Note: Since we're using Firebase Auth,
-- RLS policies will be handled in application code, but we enable RLS for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (allow all for now since we handle auth in app)
-- Note: Since we're using Firebase Auth (not Supabase Auth), we allow anonymous access
-- Authentication is handled at the application level
CREATE POLICY "Allow all operations on users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for students table
-- Note: Since we're using Firebase Auth (not Supabase Auth), we allow anonymous access
-- Authentication is handled at the application level
CREATE POLICY "Allow all operations on students"
  ON students FOR ALL
  USING (true)
  WITH CHECK (true);
  