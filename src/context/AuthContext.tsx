
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to clean up auth state
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'no user');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully:', session?.user?.email);
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        cleanupAuthState();
      }
      
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
      } else {
        console.log('Initial session:', initialSession?.user?.email || 'no user');
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      }
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      setLoading(true);
      
      // Clean up auth state first
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
        setUser(null);
        setSession(null);
        // Force page reload for clean state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut: handleSignOut
      }}
    >
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
