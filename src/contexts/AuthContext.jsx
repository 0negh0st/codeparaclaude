import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Create AuthContext
const AuthContext = createContext(undefined);

// Export hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ REQUIRED: Separate async operations object
  const profileOperations = {
    async load(userId) {
      if (!userId) return;
      setProfileLoading(true);
      try {
        const { data, error } = await supabase
          ?.from('user_profiles')
          ?.select('*')
          ?.eq('id', userId)
          ?.single();
        if (!error) {
          setUserProfile(data);
        }
      } catch (error) {
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('NetworkError')) {
          // Network connectivity issue, not a code bug
          return;
        }
      } finally {
        setProfileLoading(false);
      }
    },
    
    clear() {
      setUserProfile(null);
      setProfileLoading(false);
    }
  };

  // ✅ REQUIRED: Protected auth handlers
  const authStateHandlers = {
    // CRITICAL: This MUST remain synchronous
    onChange: (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        profileOperations?.load(session?.user?.id); // Fire-and-forget
      } else {
        profileOperations?.clear();
      }
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase?.auth?.getSession();
        if (error) {
          setError('Session retrieval error');
        } else {
          authStateHandlers?.onChange(null, session);
        }
      } catch (err) {
        setError('Auth initialization error');
      }
    };

    initializeAuth();

    // PROTECTED: Never modify this callback signature
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      authStateHandlers?.onChange
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // Sign up function with profile creation
  const signUp = async (email, password, userData = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            role: userData?.role || 'participant'
          }
        }
      });
      
      if (error) {
        setError(error?.message);
        return { success: false, error: error?.message };
      }

      // Create user profile after successful signup
      if (data?.user) {
        const { error: profileError } = await supabase
          ?.from('user_profiles')
          ?.insert([
            {
              id: data?.user?.id,
              email: email,
              full_name: userData?.full_name || '',
              company: userData?.company || '',
              department: userData?.department || '',
              role: 'participant'
            }
          ]);

        if (profileError) {
          // Profile creation failed but user created
        }
      }

      return { success: true, data };
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('AuthRetryableFetchError')) {
        const errorMsg = 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      setError(err?.message);
      return { success: false, error: err?.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error?.message);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('AuthRetryableFetchError')) {
        const errorMsg = 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      setError(err?.message);
      return { success: false, error: err?.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        setError(error?.message);
        return { success: false, error: error?.message };
      }
      setUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('NetworkError')) {
        const errorMsg = 'Network error during sign out. Please try again.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
      setError(err?.message);
      return { success: false, error: err?.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setError(null);
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email);
      if (error) {
        setError(error?.message);
        return { success: false, error: error?.message };
      }
      return { success: true };
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Please check your connection.' 
        };
      }
      setError(err?.message);
      return { success: false, error: err?.message };
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    if (!user?.id) return { data: null, error: { message: 'No authenticated user' } };

    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', user?.id)
        ?.single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || 
          err?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { message: 'Cannot connect to database. Your Supabase project may be paused or deleted.' }
        };
      }
      return { data: null, error: err };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    profileLoading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    getUserProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};