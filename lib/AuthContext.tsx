'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import type { AuthResponse, AuthUser } from '@/types';
import { apiGetMe, apiLogout } from './api';
import { getStoredUser, signOut, storeAuth } from './auth';

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  setSession: (data: AuthResponse) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  setSession: () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const u = await apiGetMe();
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  }, []);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      setLoading(false);
      return;
    }
    setUser(stored);
    apiGetMe()
      .then((u) => setUser(u))
      .catch(() => {
        signOut();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const setSession = (data: AuthResponse) => {
    storeAuth(data);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      /* ignore */
    }
    signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setSession, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
