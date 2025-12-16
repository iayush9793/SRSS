"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { validateCredentials, getUserById } from "./manual-auth";

const AuthContext = createContext({
  user: null,
  userRole: null,
  loading: true,
  signIn: async (email, password) => Promise.resolve({ success: false }),
  signOut: async () => Promise.resolve({ success: false }),
  resetPassword: async (email) => Promise.resolve({ success: false }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage (for "Remember Me" functionality)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("manualAuthUser");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const user = getUserById(userData.id);
          if (user) {
            setUser(user);
            setUserRole(user.role);
          } else {
            localStorage.removeItem("manualAuthUser");
          }
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("manualAuthUser");
        }
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const result = validateCredentials(email, password);
      
      if (result.success) {
        setUser(result.user);
        setUserRole(result.user.role);
        
        // Store user in localStorage for session persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("manualAuthUser", JSON.stringify(result.user));
        }
        
        return { success: true, user: result.user };
      } else {
        return { 
          success: false, 
          error: result.error || "Invalid email or password"
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || "An error occurred during login"
      };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setUserRole(null);
      
      // Remove user from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("manualAuthUser");
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const resetPassword = async (email) => {
    // Manual auth doesn't support password reset
    // You can implement this manually if needed
    return { 
      success: false, 
      error: "Password reset is not available in manual authentication mode. Please contact administrator." 
    };
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
