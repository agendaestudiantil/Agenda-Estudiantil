import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for development without Supabase
const DEMO_USER: UserProfile = {
  id: 'demo-user-1',
  name: 'Jane Doe',
  email: 'jane.doe@email.com',
  avatar_url: null,
  role: 'Estudiante',
  points: 150,
  streak: 7,
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Demo mode when Supabase is not configured
  const isDemoMode = !import.meta.env.VITE_SUPABASE_URL;
  const [user, setUser] = useState<UserProfile | null>(isDemoMode ? DEMO_USER : null);
  const [loading, setLoading] = useState(!isDemoMode);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser(data as UserProfile);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode, fetchProfile]);

  async function signUp(email: string, password: string, name: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  }

  function updateProfile(updates: Partial<UserProfile>) {
    if (user) {
      setUser({ ...user, ...updates });
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
