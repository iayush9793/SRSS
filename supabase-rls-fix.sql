-- Fix RLS Policies for Firebase Auth Integration
-- Since we're using Firebase Auth (not Supabase Auth), we need to allow anonymous access
-- Authentication is handled at the application level
-- Run this SQL in Supabase Dashboard > SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on students for authenticated users" ON students;
DROP POLICY IF EXISTS "Allow all operations on users for authenticated users" ON users;

-- Create new policies that allow all operations (since auth is handled in app)
-- WARNING: This allows anonymous access. Make sure your app handles authentication properly!
CREATE POLICY "Allow all operations on students"
  ON students FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Alternative: If you want to keep RLS enabled but allow service role access,
-- you can disable RLS entirely (not recommended for production):
-- ALTER TABLE students DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

