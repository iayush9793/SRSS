# Manual Authentication Setup Guide

This application now uses **manual authentication** instead of Firebase/Supabase for login. Credentials are stored directly in the code.

## Default Login Credentials

### Admin Account
- **Email**: `admin@college.edu`
- **Password**: `Admin@123456`
- **Role**: `admin` (Full access - can delete students)

### Operator Account
- **Email**: `operator@college.edu`
- **Password**: `Operator@123456`
- **Role**: `operator` (Limited access - cannot delete students)

## How to Change Credentials

### Method 1: Edit Code Directly (Simple)

1. Open `lib/manual-auth.js`
2. Update the `MANUAL_USERS` object with your desired credentials:

```javascript
const MANUAL_USERS = {
  admin: {
    email: "your-admin@college.edu",      // Change this
    password: "YourSecurePassword123",     // Change this
    role: "admin",
    id: "admin-001"
  },
  operator: {
    email: "your-operator@college.edu",   // Change this
    password: "YourSecurePassword456",     // Change this
    role: "operator",
    id: "operator-001"
  }
};
```

3. Save the file and restart your development server

### Method 2: Use Environment Variables (Recommended for Production)

1. Create or update `.env.local` file:

```env
NEXT_PUBLIC_ADMIN_EMAIL=admin@college.edu
NEXT_PUBLIC_ADMIN_PASSWORD=YourSecurePassword123
NEXT_PUBLIC_OPERATOR_EMAIL=operator@college.edu
NEXT_PUBLIC_OPERATOR_PASSWORD=YourSecurePassword456
```

2. Update `lib/manual-auth.js` to use environment variables:

```javascript
const MANUAL_USERS = {
  admin: {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@college.edu",
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin@123456",
    role: "admin",
    id: "admin-001"
  },
  operator: {
    email: process.env.NEXT_PUBLIC_OPERATOR_EMAIL || "operator@college.edu",
    password: process.env.NEXT_PUBLIC_OPERATOR_PASSWORD || "Operator@123456",
    role: "operator",
    id: "operator-001"
  }
};
```

3. Restart your development server

## Features

- ✅ Simple manual authentication (no external services required)
- ✅ Session persistence using localStorage
- ✅ "Remember Me" functionality
- ✅ Role-based access control (admin/operator)
- ✅ No signup required (credentials are pre-configured)

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Passwords**: Immediately change the default passwords in production
2. **Use Environment Variables**: For production, use environment variables instead of hardcoded credentials
3. **Don't Commit Credentials**: Never commit `.env.local` to version control
4. **Strong Passwords**: Use strong passwords (min 8 characters, mixed case, numbers, symbols)
5. **HTTPS Only**: Always use HTTPS in production

## How It Works

1. User enters email and password on login page
2. Credentials are validated against `MANUAL_USERS` in `lib/manual-auth.js`
3. If valid, user session is stored in localStorage
4. User role (admin/operator) is retrieved and used for authorization
5. Session persists until user logs out or clears browser data

## Troubleshooting

### Can't Login
- Verify credentials match exactly (case-sensitive)
- Check browser console for errors
- Clear browser cache and localStorage
- Restart development server

### Session Not Persisting
- Check if localStorage is enabled in browser
- Verify "Remember Me" checkbox is checked
- Check browser console for errors

### Role Not Working
- Verify role is exactly `"admin"` or `"operator"` (lowercase)
- Clear localStorage and log in again
- Check `lib/manual-auth.js` for correct role assignment

## Files Modified

- `lib/manual-auth.js` - Manual authentication logic
- `lib/auth-context.jsx` - Updated to use manual auth (removed Firebase/Supabase)
- `app/login/page.tsx` - Updated login form (removed signup)

## Migration from Firebase/Supabase

If you were previously using Firebase/Supabase authentication:

1. ✅ Firebase/Supabase dependencies removed from auth flow
2. ✅ Manual authentication implemented
3. ✅ Signup functionality removed
4. ✅ Password reset disabled (manual auth doesn't support it)

**Note**: Firebase and Supabase may still be used for other features (like database storage), but authentication is now manual.

