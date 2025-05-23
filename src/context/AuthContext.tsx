
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getCurrentUser, getProfile } from '@/lib/supabase';

type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};

type User = {
  id: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the current session
    const initAuth = async () => {
      try {
        setLoading(true);
        const { user: currentUser } = await getCurrentUser();
        
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email
          });
          
          // Fetch user profile
          const { profile: userProfile } = await getProfile(currentUser.id);
          if (userProfile) {
            setProfile(userProfile as Profile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email
        });
        
        // Fetch user profile
        const { profile: userProfile } = await getProfile(session.user.id);
        if (userProfile) {
          setProfile(userProfile as Profile);
        }
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
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
