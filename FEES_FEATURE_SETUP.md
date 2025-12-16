# Fees Feature Setup Guide

## Overview

The fees section has been added to the Student Management Dashboard with the following features:
- **View Fees**: Both admin and operator can view fees information
- **Edit Fees**: Only admin can edit fees
- **CSV Export**: Both admin and operator can download all student data (including fees) as CSV

## Database Migration

### Step 1: Run the Migration SQL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-fees-migration.sql`
6. Paste into the SQL editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for success message

### Step 2: Verify Migration

1. Go to **Table Editor** in left sidebar
2. Click on `students` table
3. You should see three new columns:
   - `total_amount` (DECIMAL)
   - `amount_paid` (DECIMAL)
   - `fee_status` (TEXT) - with values: 'Paid', 'Unpaid', 'Partial'

## Features

### 1. Fees Display

Each student row now shows:
- **Total Amount**: The total fee amount
- **Amount Paid**: How much has been paid
- **Amount Left**: Automatically calculated (Total - Paid)
- **Status**: Paid, Unpaid, or Partial (with color-coded badges)

### 2. Edit Fees (Admin Only)

- Only users with `admin` role can edit fees
- Click the edit icon (pencil) next to the fee status
- Modal opens with:
  - Total Amount input
  - Amount Paid input
  - Status dropdown (can be overridden)
  - Live preview of amount left
- Status is auto-calculated based on amounts:
  - If `amount_paid >= total_amount` → "Paid"
  - If `amount_paid > 0 && amount_paid < total_amount` → "Partial"
  - Otherwise → "Unpaid"

### 3. CSV Download

- **Download Button**: Located in the action bar (top right)
- **Available to**: Both admin and operator
- **Includes**: All student data including:
  - Serial No.
  - Roll No./Student ID
  - Contact No.
  - Batch Year
  - Course
  - Total Amount
  - Amount Paid
  - Amount Left
  - Fee Status
  - Documents Count
  - Created At
- **File Name**: `students_data_YYYY-MM-DD.csv`

## Permissions

| Feature | Admin | Operator |
|---------|-------|----------|
| View Fees | ✅ | ✅ |
| Edit Fees | ✅ | ❌ |
| Download CSV | ✅ | ✅ |

## Usage

### For Operators:
1. View fees information for all students
2. Download CSV reports
3. Cannot edit fees (only view)

### For Admins:
1. View fees information for all students
2. Edit fees by clicking the edit icon next to fee status
3. Download CSV reports
4. Full access to all features

## Status Colors

- **Paid**: Green badge
- **Partial**: Yellow badge
- **Unpaid**: Red badge

## CSV Export Format

The CSV file includes:
- Headers in the first row
- All filtered students (respects search and filter criteria)
- Properly formatted dates
- Quoted values to handle commas in data

## Troubleshooting

### Issue: Fees columns not showing
**Solution**: Run the migration SQL in Supabase Dashboard

### Issue: Cannot edit fees (even as admin)
**Solution**: 
1. Check your role in the dashboard header
2. Verify role is exactly "admin" (lowercase)
3. Clear localStorage and log in again

### Issue: CSV download not working
**Solution**:
1. Check browser console for errors
2. Ensure you have write permissions for downloads
3. Check if pop-up blocker is enabled

### Issue: Status not updating correctly
**Solution**: 
- Status is auto-calculated when you save
- You can manually override it using the dropdown
- Calculation: `amount_paid >= total_amount` → "Paid"

## Database Schema

The fees columns added to `students` table:

```sql
total_amount DECIMAL(10, 2) DEFAULT 0.00
amount_paid DECIMAL(10, 2) DEFAULT 0.00
fee_status TEXT DEFAULT 'Unpaid' CHECK (fee_status IN ('Paid', 'Unpaid', 'Partial'))
```

## Next Steps

1. ✅ Run the migration SQL
2. ✅ Test viewing fees as operator
3. ✅ Test editing fees as admin
4. ✅ Test CSV download
5. ✅ Verify permissions are working correctly

## Notes

- All amounts are stored in decimal format (supports up to 2 decimal places)
- Amount Left is calculated automatically (Total - Paid)
- Status can be manually set or auto-calculated
- CSV export respects current filters and search terms
- Fees data is included in all student queries

