
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type Profile = {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && event === 'SIGNED_IN') {
        console.log('User signed in, fetching profile...');
        // Defer profile fetching to avoid potential issues
        setTimeout(async () => {
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (error) {
              console.error('Error fetching profile:', error);
            } else if (profileData) {
              console.log('Profile found:', profileData);
              setProfile(profileData as Profile);
            } else {
              console.log('No profile found for user');
            }
          } catch (error) {
            console.error('Error in profile fetch:', error);
          }
        }, 100);
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setProfile(null);
      }
      
      setLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
      } else {
        console.log('Initial session:', initialSession?.user?.email);
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
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
        setUser(null);
        setProfile(null);
        setSession(null);
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
        profile,
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
