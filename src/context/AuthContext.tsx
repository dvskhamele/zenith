'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  user: any;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing');
    const checkUser = async () => {
      try {
        console.log('AuthProvider: Checking current user');
        // First check if we have tokens from OAuth flow
        const supabaseToken = localStorage.getItem('supabase_access_token');
        const facebookAuthCompleted = localStorage.getItem('facebook_auth_completed');
        
        if (supabaseToken && facebookAuthCompleted) {
          console.log('AuthProvider: Found OAuth tokens, setting session');
          // Set the session with the stored token
          const { data, error } = await supabase.auth.setSession({
            access_token: supabaseToken,
            refresh_token: localStorage.getItem('supabase_refresh_token') || ''
          });
          
          if (error) {
            console.error('AuthProvider: Error setting session', error);
            // Don't throw error, continue with other checks
          }
          
          if (data?.session?.user) {
            console.log('AuthProvider: User authenticated from OAuth tokens', data.session.user);
            setUser(data.session.user);
            setLoading(false);
            return;
          }
        }
        
        // If no OAuth tokens, check regular auth
        try {
          const currentUser = await getCurrentUser();
          console.log('AuthProvider: Current user result:', currentUser);
          setUser(currentUser);
        } catch (authError) {
          console.log('AuthProvider: No authenticated user found', authError);
          // Even if there's no Supabase user, check if we have a Facebook token
          const facebookToken = localStorage.getItem('facebook_access_token');
          if (facebookToken) {
            console.log('AuthProvider: Found Facebook token, creating mock user');
            // Create a mock user object for Facebook-only authentication
            setUser({
              id: 'facebook-user',
              email: 'facebook-user@zenith.local',
              user_metadata: {
                provider: 'facebook'
              }
            });
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        // User is not logged in
        console.log('AuthProvider: User not logged in', error);
        // Even if there's an error, check if we have a Facebook token
        const facebookToken = localStorage.getItem('facebook_access_token');
        if (facebookToken) {
          console.log('AuthProvider: Found Facebook token, creating mock user');
          // Create a mock user object for Facebook-only authentication
          setUser({
            id: 'facebook-user',
            email: 'facebook-user@zenith.local',
            user_metadata: {
              provider: 'facebook'
            }
          });
        } else {
          setUser(null);
        }
      } finally {
        console.log('AuthProvider: Finished checking user');
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Listen for auth state changes
    console.log('AuthProvider: Setting up auth state listener');
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthProvider: Auth state changed:', event, session);
      if (session?.user) {
        console.log('AuthProvider: User authenticated', session.user);
        setUser(session.user);
      } else {
        console.log('AuthProvider: No user in session');
        // Even if there's no Supabase user, check if we have a Facebook token
        const facebookToken = localStorage.getItem('facebook_access_token');
        if (facebookToken) {
          console.log('AuthProvider: Found Facebook token, creating mock user');
          // Create a mock user object for Facebook-only authentication
          setUser({
            id: 'facebook-user',
            email: 'facebook-user@zenith.local',
            user_metadata: {
              provider: 'facebook'
            }
          });
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });
    
    // Cleanup listener
    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      console.log('AuthProvider: Logging out user');
      await logoutUser();
      // Clear OAuth tokens as well
      localStorage.removeItem('facebook_access_token');
      localStorage.removeItem('facebook_auth_completed');
      localStorage.removeItem('supabase_access_token');
      localStorage.removeItem('supabase_refresh_token');
      setUser(null);
    } catch (error) {
      console.error('AuthProvider: Error logging out:', error);
      // Even if there's an error, clear the user state and tokens
      localStorage.removeItem('facebook_access_token');
      localStorage.removeItem('facebook_auth_completed');
      localStorage.removeItem('supabase_access_token');
      localStorage.removeItem('supabase_refresh_token');
      setUser(null);
    }
  };

  console.log('AuthProvider: Rendering with state', { user, loading });
  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('useAuth: Returning context', context);
  return context;
}