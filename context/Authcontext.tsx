'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const WP = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? 'http://coom-endem-server.local';
const KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY ?? '';
const SEC = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET ?? '';

export interface WCUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

interface AuthContextValue {
  user: WCUser | null;
  token: string | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WCUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Restore session from sessionStorage
  useEffect(() => {
    try {
      const t = sessionStorage.getItem('wc_token');
      const u = sessionStorage.getItem('wc_user');
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError('');
    try {
      // Requires: JWT Authentication for WP REST API plugin
      // https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
      const res = await fetch(`${WP}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'Invalid email or password'); return false; }

      const newToken: string = data.token;

      // Fetch WP user profile
      const me = await fetch(`${WP}/wp-json/wp/v2/users/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
      }).then(r => r.json());

      const newUser: WCUser = {
        id:          me.id,
        email:       me.email ?? email,
        firstName:   me.first_name ?? '',
        lastName:    me.last_name ?? '',
        displayName: me.name ?? email,
      };

      setToken(newToken);
      setUser(newUser);
      sessionStorage.setItem('wc_token', newToken);
      sessionStorage.setItem('wc_user', JSON.stringify(newUser));
      return true;
    } catch { setError('Connection error. Please try again.'); return false; }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    setError('');
    try {
      const url = new URL(`${WP}/wp-json/wc/v3/customers`);
      url.searchParams.set('consumer_key', KEY);
      url.searchParams.set('consumer_secret', SEC);
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, username: email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'Registration failed'); return false; }
      // Auto-login after registration
      return await login(email, password);
    } catch { setError('Connection error. Please try again.'); return false; }
  };

  const logout = () => {
    setUser(null); setToken(null);
    try { sessionStorage.removeItem('wc_token'); sessionStorage.removeItem('wc_user'); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}