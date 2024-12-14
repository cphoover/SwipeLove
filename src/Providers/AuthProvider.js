import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // // State variables for user authentication
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch session on app start
  const fetchSession = useCallback(async () => {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching session:', error.message);
    } else {
      setUser(session?.user || null);
      setSession(session);
    }
    setLoading(false);
  }, []);

  // Login with phone OTP
  const loginWithPhone = async (phone) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      console.error('Error sending OTP:', error.message);
    } else {
      console.log('OTP sent successfully');
    }
  };

  // Verify OTP and login
  const verifyOtp = async (phone, otp) => {
    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    if (error) {
      console.error('Error verifying OTP:', error.message);
    } else {
      setUser(data.user);
      setSession(data.session);
      console.log('Logged in successfully');
    }
  };

  // Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setUser(null);
      setSession(null);
      console.log('Logged out successfully');
    }
  };

  // // Check if the user is logged in
  const isLoggedIn = () => !!user;

  // // Refresh session manually
  const refreshSession = async () => {
    await fetchSession();
    console.log('Session refreshed');
  };

  // Listen for session changes
  useEffect(() => {
    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        } else if (session) {
          setUser(session.user);
          setSession(session);
        }
      }
    );

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        loginWithPhone,
        verifyOtp,
        logout,
        isLoggedIn,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
