import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  plan: 'free' | 'basic' | 'pro' | 'premium';
  credits: number;
  credits_reset_at: string;
}

const DEMO_PROFILE: Profile = {
  id: 'demo',
  user_id: 'demo',
  full_name: 'Usuário Demo',
  plan: 'free',
  credits: 5,
  credits_reset_at: new Date().toISOString(),
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deductCredit: (amount?: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', currentUser.id)
      .single();

    if (data) {
      setProfile(data as Profile);
      return;
    }

    const fullName =
      currentUser.user_metadata?.full_name ||
      currentUser.user_metadata?.name ||
      currentUser.email?.split('@')[0] ||
      'Usuário';

    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        user_id: currentUser.id,
        full_name: fullName,
        plan: 'free',
        credits: 5,
        credits_reset_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (newProfile) {
      setProfile(newProfile as Profile);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  const deductCredit = async (amount: number = 1): Promise<boolean> => {
    if (!profile || profile.credits < amount) return false;

    if (!user) {
      setProfile({ ...profile, credits: profile.credits - amount });
      return true;
    }

    const newCredits = profile.credits - amount;

    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('user_id', profile.user_id);

    if (!error) {
      setProfile({ ...profile, credits: newCredits });
      return true;
    }

    return false;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(() => fetchProfile(session.user), 0);
      } else {
        setProfile(DEMO_PROFILE);
      }

      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(DEMO_PROFILE);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signOut,
        refreshProfile,
        deductCredit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}