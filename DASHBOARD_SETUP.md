# Student Management Dashboard Setup Guide

## ✅ What's Been Implemented

### 1. **Database Setup**
- ✅ Firebase Firestore configured
- ✅ Firebase Storage configured
- ✅ User roles system in Firestore

### 2. **Dashboard Features**
- ✅ Student data table with all required fields:
  - Serial No. (auto-generated)
  - Roll No./Student ID
  - Contact No.
  - Batch Year
  - Course Enrolled
  - Documents Upload/View
- ✅ Add/Edit student functionality
- ✅ Delete student (Admin only)
- ✅ Document upload to Firebase Storage
- ✅ Document viewer in popup
- ✅ Search and filter functionality
- ✅ Role-based access control

### 3. **Role-Based Access**
- ✅ **Admin**: Full access (View, Add, Edit, Delete)
- ✅ **Operator**: View and Edit (No Delete)

---

## 🔧 Setup Instructions

### Step 1: Enable Firebase Services

1. **Enable Firestore Database:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `fir-ms-project`
   - Navigate to **Firestore Database**
   - Click **Create Database**
   - Choose **Start in test mode** (for development)
   - Select a location and click **Enable**

2. **Enable Firebase Storage:**
   - Navigate to **Storage** in Firebase Console
   - Click **Get Started**
   - Start in **test mode** (for development)
   - Click **Next** and **Done**

### Step 2: Set Up Firestore Security Rules

Go to **Firestore Database > Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read their own data, admins can write
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Students collection - operators and admins can read/write
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Step 3: Set Up Storage Security Rules

Go to **Storage > Rules** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /students/{studentId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 4: Assign Admin Role

**Method 1: Using Firebase Console**
1. Go to **Firestore Database**
2. Create a collection named `users`
3. Create a document with ID = your Firebase Auth User UID
4. Add field: `role` = `"admin"` (string)
5. Add field: `email` = your email (string)

**Method 2: Using Browser Console (After Login)**
1. Login to the dashboard
2. Open browser console (F12)
3. Run this code (replace USER_ID with your Firebase Auth UID):

```javascript
import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

// Replace 'YOUR_USER_ID' with your actual Firebase Auth UID
await setDoc(doc(db, 'users', 'YOUR_USER_ID'), {
  role: 'admin',
  email: 'your-email@example.com'
});
```

**Method 3: Create Admin Setup Page (Optional)**
I can create a simple admin setup page if needed.

---

## 📋 Dashboard Features

### Student Management
- **Add Student**: Click "Add Student" button (Admin/Operator)
- **Edit Student**: Click edit icon (Admin/Operator)
- **Delete Student**: Click delete icon (Admin only)
- **View Documents**: Click eye icon next to documents

### Document Management
- **Upload**: Click upload icon next to student row
- **View**: Click eye icon to view in popup
- **Download**: Click download button in document viewer

### Search & Filter
- **Search**: By Roll No or Contact No
- **Filter**: By Batch Year and Course
- **Real-time**: Updates as you type

---

## 🎨 UI Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Interactive animations
- ✅ Loading states
- ✅ Success/Error notifications
- ✅ Modal dialogs for forms
- ✅ Document viewer popup

---

## 🔐 Role Permissions

| Action | Admin | Operator |
|--------|-------|----------|
| View Students | ✅ | ✅ |
| Add Student | ✅ | ✅ |
| Edit Student | ✅ | ✅ |
| Delete Student | ✅ | ❌ |
| Upload Documents | ✅ | ✅ |
| View Documents | ✅ | ✅ |
| Delete Documents | ✅ | ✅ |

---

## 📝 Data Structure

### Firestore Collections

**`users` Collection:**
```javascript
{
  email: "user@example.com",
  role: "admin" | "operator",
  createdAt: Timestamp
}
```

**`students` Collection:**
```javascript
{
  rollNo: "STU001",
  contactNo: "+1234567890",
  batchYear: "2024",
  course: "Computer Science",
  documents: ["url1", "url2"], // Firebase Storage URLs
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🚀 Next Steps

1. ✅ Enable Firestore Database
2. ✅ Enable Firebase Storage
3. ✅ Set up security rules
4. ✅ Assign admin role to your user
5. ✅ Test the dashboard!

---

## 💡 Tips

- **Default Role**: New users are assigned "operator" role by default
- **Admin Access**: Only admins can delete students
- **Document Storage**: All documents are stored in Firebase Storage under `students/{studentId}/`
- **Serial Numbers**: Auto-generated based on creation order

---

## 🐛 Troubleshooting

**Issue**: Can't see "Add Student" button
- **Solution**: Check your user role in Firestore `users` collection

**Issue**: Can't delete students
- **Solution**: Only admins can delete. Check your role is set to "admin"

**Issue**: Documents not uploading
- **Solution**: Check Firebase Storage is enabled and rules are set correctly

**Issue**: Can't view documents
- **Solution**: Check Storage security rules allow read access

---

## 📞 Support

If you encounter any issues, check:
1. Firebase Console for errors
2. Browser console for JavaScript errors
3. Network tab for failed requests

