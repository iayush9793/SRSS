// lib/manual-auth.js

// Manual user credentials - Change these to your desired credentials
const MANUAL_USERS = {
  admin: {
    email: "admin@college.edu",
    password: "Admin@123456", // Change this password
    role: "admin",
    id: "admin-001"
  },
  operator: {
    email: "operator@college.edu",
    password: "Operator@123456", // Change this password
    role: "operator",
    id: "operator-001"
  }
};

// You can also use environment variables for better security
// Uncomment the section below and comment out the MANUAL_USERS above if you want to use env vars
// const MANUAL_USERS = {
//   admin: {
//     email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@college.edu",
//     password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin@123456",
//     role: "admin",
//     id: "admin-001"
//   },
//   operator: {
//     email: process.env.NEXT_PUBLIC_OPERATOR_EMAIL || "operator@college.edu",
//     password: process.env.NEXT_PUBLIC_OPERATOR_PASSWORD || "Operator@123456",
//     role: "operator",
//     id: "operator-001"
//   }
// };

export function validateCredentials(email, password) {
  // Check admin credentials
  if (email === MANUAL_USERS.admin.email && password === MANUAL_USERS.admin.password) {
    return {
      success: true,
      user: {
        id: MANUAL_USERS.admin.id,
        email: MANUAL_USERS.admin.email,
        role: MANUAL_USERS.admin.role
      }
    };
  }
  
  // Check operator credentials
  if (email === MANUAL_USERS.operator.email && password === MANUAL_USERS.operator.password) {
    return {
      success: true,
      user: {
        id: MANUAL_USERS.operator.id,
        email: MANUAL_USERS.operator.email,
        role: MANUAL_USERS.operator.role
      }
    };
  }
  
  return {
    success: false,
    error: "Invalid email or password"
  };
}

export function getUserById(userId) {
  if (userId === MANUAL_USERS.admin.id) {
    return {
      id: MANUAL_USERS.admin.id,
      email: MANUAL_USERS.admin.email,
      role: MANUAL_USERS.admin.role
    };
  }
  
  if (userId === MANUAL_USERS.operator.id) {
    return {
      id: MANUAL_USERS.operator.id,
      email: MANUAL_USERS.operator.email,
      role: MANUAL_USERS.operator.role
    };
  }
  
  return null;
}

