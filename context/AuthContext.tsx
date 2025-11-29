import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState, Profile } from '../types';

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    isAdmin: false,
  });

  // Memoized fetch to prevent recreating function on every render
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        // If the row doesn't exist yet (race condition on signup), don't crash
        if (error.code === 'PGRST116') return null;
        console.warn('Error fetching profile:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.warn('Failed to fetch profile (connection issue likely)');
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        let profile: Profile | null = null;
        
        if (session?.user) {
          profile = await fetchProfile(session.user.id);
        }

        if (mounted) {
          setState({ 
            user: session?.user ?? null, 
            session, 
            profile,
            loading: false, // Stop loading immediately after initial check
            isAdmin: profile?.is_admin || false
          });
        }
      } catch (error) {
        console.error("Auth init error:", error);
        if (mounted) setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();

    // 2. Listen for changes (Login, Logout, Auto-refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // We only need to react if the session ID actually changed or if it's a SIGN_IN event
      // This prevents some redundant fetches
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setState({ 
          user: null, 
          session: null, 
          profile: null, 
          loading: false,
          isAdmin: false
        });
        return;
      }

      // If we already have the user and profile, and it's just a token refresh, skip fetching profile
      if (event === 'TOKEN_REFRESHED' && state.user?.id === session?.user.id) {
         setState(prev => ({ ...prev, session }));
         return;
      }

      if (session?.user) {
        // Only fetch profile if we don't have it or if the user changed
        const profile = await fetchProfile(session.user.id);
        
        if (mounted) {
          setState({ 
            user: session.user, 
            session, 
            profile,
            loading: false,
            isAdmin: profile?.is_admin || false
          });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]); // Removed 'state.user' dependency to avoid loops

  const signOut = async () => {
    await supabase.auth.signOut();
    // State update is handled by onAuthStateChange('SIGNED_OUT')
  };

  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile, isAdmin: profile?.is_admin || false }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};