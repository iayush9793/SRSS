// Utility functions for managing user roles in Supabase
import { supabase } from "./supabase";

/**
 * Set user role in Supabase
 * @param {string} userId - Firebase Auth UID
 * @param {string} role - 'admin' or 'operator'
 */
export const setUserRole = async (userId, role) => {
  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        role: role
      }, {
        onConflict: 'id'
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error setting user role:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user role from Supabase
 * @param {string} userId - Firebase Auth UID
 */
export const getUserRole = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.role || "operator";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "operator";
  }
};

