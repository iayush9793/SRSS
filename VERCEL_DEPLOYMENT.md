# Vercel Deployment Guide

## ✅ Build Issue Fixed!

The Supabase configuration has been updated to handle missing environment variables during build time. The build should now succeed on Vercel.

---

## 🔧 Required: Set Environment Variables in Vercel

For the application to work properly at runtime, you **must** add these environment variables in Vercel:

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your project

### Step 2: Add Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

#### Supabase Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://mrxaxrlyyesoexvitpic.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yeGF4cmx5eWVzb2V4dml0cGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MTgxNDgsImV4cCI6MjA3OTI5NDE0OH0.VMat_v34zA5NgHJmdguBEQ0tnXu_CVBQEHzjuQeXu2c
```

#### Cloudinary Variables:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dasbphmuc
CLOUDINARY_API_KEY=254177779152687
CLOUDINARY_API_SECRET=1anXIoycdMaJzGneTBtoBkgBU4k
```

### Step 3: Set Environment for All Environments
- Make sure to select **Production**, **Preview**, and **Development** for each variable
- Click **Save** after adding each variable

### Step 4: Redeploy
1. After adding all environment variables
2. Go to **Deployments** tab
3. Click the **three dots** (⋯) on the latest deployment
4. Click **Redeploy**
5. Or push a new commit to trigger a new deployment

---

## 📋 Environment Variables Checklist

Make sure these are set in Vercel:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`

---

## 🚀 Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Fix Supabase build errors"
   git push
   ```

2. **Vercel will auto-deploy** (if connected to repo)

3. **Or manually deploy:**
   - Go to Vercel Dashboard
   - Click **Deploy** → **Deploy Git Repository**
   - Select your repository
   - Add environment variables (if not already set)
   - Click **Deploy**

---

## ✅ Verification

After deployment:

1. **Check Build Logs:**
   - Should show "✓ Compiled successfully"
   - No errors about missing Supabase variables

2. **Test the Application:**
   - Visit your deployed URL
   - Try logging in
   - Try adding a student (if logged in)
   - Check browser console for errors

3. **If Errors Occur:**
   - Verify all environment variables are set in Vercel
   - Check that variables are available for the correct environment (Production/Preview)
   - Check Vercel deployment logs for runtime errors

---

## 🔍 Troubleshooting

### Issue: "Missing Supabase environment variables" at runtime
**Solution:** 
- Verify environment variables are set in Vercel
- Make sure they're set for the correct environment (Production/Preview)
- Redeploy after adding variables

### Issue: Build succeeds but app doesn't work
**Solution:**
- Check Vercel function logs for errors
- Verify Supabase database schema is set up (run `supabase-schema.sql`)
- Check browser console for client-side errors

### Issue: Can't connect to Supabase
**Solution:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check Supabase project is active
- Check Supabase dashboard for any service issues

---

## 📝 Important Notes

1. **Environment Variables:**
   - Variables starting with `NEXT_PUBLIC_` are exposed to the browser
   - Variables without `NEXT_PUBLIC_` are server-side only
   - Never commit `.env.local` to git (it's in `.gitignore`)

2. **Supabase Database:**
   - Make sure you've run the SQL schema in Supabase Dashboard
   - Tables `users` and `students` must exist

3. **Build vs Runtime:**
   - Build will succeed even without env vars (for static generation)
   - Runtime will fail if env vars are missing when Supabase is actually used
   - Always set environment variables in Vercel before deploying

---

## 🎉 Success!

Once all environment variables are set and the deployment succeeds:
- ✅ Build will complete without errors
- ✅ Application will work at runtime
- ✅ All features (auth, dashboard, uploads) will function properly

---

**Next Steps:**
1. Add environment variables in Vercel
2. Redeploy
3. Test the deployed application

