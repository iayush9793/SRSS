# Manual User Management Guide

This guide explains how to manually create users and assign roles (admin/operator) in the system.

## Overview

The system uses:
- **Firebase Authentication** for user authentication (email/password)
- **Supabase** for storing user roles (admin/operator)

## How to Add Manual Users

### Method 1: Using Firebase Console (Recommended)

1. **Go to Firebase Console**
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `fir-ms-project`
   - Navigate to **Authentication** → **Users**

2. **Add New User**
   - Click **"Add user"** button
   - Enter the user's **Email** address
   - Enter a **Password** (minimum 6 characters)
   - Click **"Add user"**
   - **Copy the User UID** (you'll need this for the next step)

3. **Add User to Supabase**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to **Table Editor** → `users` table
   - Click **"Insert row"** or **"New row"**
   - Fill in the fields:
     - **id**: Paste the Firebase User UID (from step 2)
     - **email**: Enter the user's email address
     - **role**: Select `operator` (default) or `admin`
   - Click **"Save"**

### Method 2: Using Supabase SQL Editor

1. **Create User in Firebase** (same as Method 1, steps 1-2)
   - Get the Firebase User UID

2. **Insert User in Supabase via SQL**
   ```sql
   INSERT INTO users (id, email, role)
   VALUES (
     'FIREBASE_USER_UID_HERE',  -- Replace with actual Firebase UID
     'user@example.com',        -- Replace with user's email
     'operator'                  -- or 'admin'
   );
   ```

   Example:
   ```sql
   INSERT INTO users (id, email, role)
   VALUES (
     'abc123xyz789',
     'operator@college.edu',
     'operator'
   );
   ```

### Method 3: Using Firebase Admin SDK (For Developers)

If you have access to Firebase Admin SDK, you can create users programmatically:

```javascript
const admin = require('firebase-admin');
const { supabase } = require('./lib/supabase');

async function createUserWithRole(email, password, role = 'operator') {
  try {
    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Add user to Supabase with role
    const { error } = await supabase
      .from('users')
      .insert({
        id: userRecord.uid,
        email: email,
        role: role
      });

    if (error) {
      console.error('Error adding user to Supabase:', error);
      // Optionally delete Firebase user if Supabase insert fails
      await admin.auth().deleteUser(userRecord.uid);
      return { success: false, error: error.message };
    }

    return { success: true, uid: userRecord.uid };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
}

// Usage
await createUserWithRole('newuser@college.edu', 'SecurePassword123', 'operator');
```

## How to Assign/Change User Roles

### Method 1: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Navigate to **Table Editor** → `users` table
   - Find the user by email or UID
   - Click on the row to edit
   - Change the `role` field to:
     - `admin` - Full access (can delete students)
     - `operator` - Limited access (cannot delete students)
   - Click **"Save"**

### Method 2: Using Supabase SQL Editor

```sql
-- Make a user an admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Make a user an operator
UPDATE users 
SET role = 'operator' 
WHERE email = 'user@example.com';

-- Update by Firebase UID
UPDATE users 
SET role = 'admin' 
WHERE id = 'FIREBASE_USER_UID_HERE';
```

### Method 3: Using Admin Utils (In Application)

If you have admin access, you can use the utility function:

```javascript
import { setUserRole } from '@/lib/admin-utils';

// Set user as admin
await setUserRole('FIREBASE_USER_UID', 'admin');

// Set user as operator
await setUserRole('FIREBASE_USER_UID', 'operator');
```

## Finding User Information

### Get Firebase User UID

1. **From Firebase Console**
   - Go to **Authentication** → **Users**
   - Find the user by email
   - Copy the **UID** column value

2. **From Browser Console (After Login)**
   ```javascript
   // In browser console after user logs in
   import { auth } from './lib/firebase';
   console.log(auth.currentUser.uid);
   ```

### Get User Role

```sql
-- In Supabase SQL Editor
SELECT id, email, role 
FROM users 
WHERE email = 'user@example.com';
```

## Role Permissions

| Action | Admin | Operator |
|--------|-------|----------|
| View Students | ✅ | ✅ |
| Add Student | ✅ | ✅ |
| Edit Student | ✅ | ✅ |
| Delete Student | ✅ | ❌ |
| Upload Documents | ✅ | ✅ |
| View Documents | ✅ | ✅ |
| Delete Documents | ✅ | ✅ |

## Important Notes

1. **Default Role**: New users are automatically assigned `operator` role by default
2. **Role Values**: Must be exactly `"admin"` or `"operator"` (case-sensitive)
3. **User Must Exist in Both**: 
   - User must exist in Firebase Authentication
   - User must exist in Supabase `users` table
4. **UID Matching**: The `id` in Supabase must match the Firebase Auth `uid`
5. **Email Consistency**: Keep email addresses consistent between Firebase and Supabase

## Troubleshooting

### User Can't Login
- **Check**: User exists in Firebase Authentication
- **Check**: Email and password are correct
- **Check**: User account is not disabled in Firebase

### User Has No Role / Default Role
- **Check**: User exists in Supabase `users` table
- **Check**: `id` in Supabase matches Firebase `uid`
- **Solution**: Add user to Supabase or update existing record

### Role Not Working
- **Check**: Role value is exactly `"admin"` or `"operator"` (lowercase)
- **Check**: User logged out and logged back in (role is cached)
- **Solution**: Clear browser cache or wait for session refresh

### User Created But Can't Access Dashboard
- **Check**: User exists in both Firebase and Supabase
- **Check**: Role is set correctly in Supabase
- **Solution**: Ensure `id` in Supabase matches Firebase `uid` exactly

## Quick Reference

### Create Admin User
```sql
-- Step 1: Create in Firebase Console (get UID)
-- Step 2: Run in Supabase SQL Editor
INSERT INTO users (id, email, role)
VALUES ('FIREBASE_UID', 'admin@college.edu', 'admin');
```

### Create Operator User
```sql
-- Step 1: Create in Firebase Console (get UID)
-- Step 2: Run in Supabase SQL Editor
INSERT INTO users (id, email, role)
VALUES ('FIREBASE_UID', 'operator@college.edu', 'operator');
```

### Change Existing User Role
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@college.edu';
```

## Security Best Practices

1. **Limit Admin Access**: Only assign `admin` role to trusted users
2. **Strong Passwords**: Ensure users have strong passwords (minimum 8 characters, mixed case, numbers)
3. **Regular Audits**: Periodically review user roles in Supabase
4. **Disable Unused Accounts**: Disable accounts in Firebase if users leave
5. **Monitor Access**: Check Supabase logs for unusual activity

