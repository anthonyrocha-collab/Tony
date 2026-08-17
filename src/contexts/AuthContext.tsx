import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthUser {
  id: string;
  email: string;
  isLocalAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: string | null }>;
  signUp: (email: string, pass: string) => Promise<{ error: string | null; message?: string }>;
  signOut: () => Promise<void>;
  loginAsLocalAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'portfolio_autoral_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Verifica se há sessão no Supabase
    if (supabase && isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'autor@portfolio.com',
          });
        } else {
          // Checa local fallback
          checkLocalSession();
        }
        setIsLoading(false);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'autor@portfolio.com',
          });
        } else {
          checkLocalSession();
        }
      });

      return () => {
        listener.subscription.unsubscribe();
      };
    } else {
      checkLocalSession();
      setIsLoading(false);
    }
  }, []);

  const checkLocalSession = () => {
    try {
      const stored = localStorage.getItem(LOCAL_AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const signIn = async (email: string, pass: string): Promise<{ error: string | null }> => {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email || email });
      }
      return { error: null };
    }

    // Fallback local caso sem Supabase
    if (email && pass.length >= 6) {
      const localUser: AuthUser = { id: 'local-owner-id', email, isLocalAdmin: true };
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
      setUser(localUser);
      return { error: null };
    }
    return { error: 'A senha deve conter no mínimo 6 caracteres.' };
  };

  const signUp = async (email: string, pass: string): Promise<{ error: string | null; message?: string }> => {
    if (supabase && isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
      });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email || email });
        return { error: null, message: 'Conta criada com sucesso!' };
      }
      return { error: null, message: 'Verifique seu e-mail para confirmar o cadastro.' };
    }

    // Fallback local
    if (email && pass.length >= 6) {
      const localUser: AuthUser = { id: 'local-owner-id', email, isLocalAdmin: true };
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
      setUser(localUser);
      return { error: null, message: 'Conta local ativada com sucesso!' };
    }
    return { error: 'A senha deve conter no mínimo 6 caracteres.' };
  };

  const loginAsLocalAdmin = () => {
    const localUser: AuthUser = {
      id: 'local-owner-id',
      email: 'proprietario@portfolio.local',
      isLocalAdmin: true,
    };
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localUser));
    setUser(localUser);
  };

  const signOut = async (): Promise<void> => {
    if (supabase && isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        loginAsLocalAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
