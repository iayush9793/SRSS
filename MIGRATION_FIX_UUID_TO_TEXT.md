# Migration: Fix Users Table ID Type

## Issue
The `users` table was created with `id` as `UUID` type, but Firebase Authentication UIDs are strings (not UUIDs), causing errors when inserting rows.

## Error Message
```
ERROR: 22P02: invalid input syntax for type uuid: "PqVJ7xyji8MhBxKorrEwA6mTL9w1"
```

## Solution
Change the `id` column type from `UUID` to `TEXT` to accommodate Firebase Auth UIDs.

## Migration SQL

### If Table is Empty (Recommended)
If you haven't added any users yet, drop and recreate:

```sql
-- Drop existing table
DROP TABLE IF EXISTS users CASCADE;

-- Recreate with TEXT id
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate trigger
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Recreate RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on users for authenticated users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);
```

### If Table Has Data
If you already have users in the table, use this migration:

```sql
-- Step 1: Drop primary key constraint
ALTER TABLE users DROP CONSTRAINT users_pkey;

-- Step 2: Change column type
ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::TEXT;

-- Step 3: Re-add primary key
ALTER TABLE users ADD PRIMARY KEY (id);
```

## Verification

After running the migration, verify the table structure:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'id';
```

Should return: `TEXT`

## Test Insert

Try inserting a test user with a Firebase UID:

```sql
INSERT INTO users (id, email, role)
VALUES (
  'PqVJ7xyji8MhBxKorrEwA6mTL9w1',  -- Example Firebase UID
  'test@example.com',
  'operator'
);
```

This should now work without errors!

