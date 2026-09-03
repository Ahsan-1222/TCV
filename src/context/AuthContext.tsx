import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'Admin@@1122';
const DEFAULT_ADMIN: User = { id: '1', email: 'admin@thecrownvault.com', role: 'admin', name: 'Admin' };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Always require password authentication whenever opening the admin page
  const [user, setUser] = useState<User | null>(null);

  // Clear any existing stored admin session data to enforce strict password check
  try {
    localStorage.removeItem('tcv_admin_user');
    localStorage.removeItem('tcv_admin_logged_in');
    sessionStorage.removeItem('tcv_admin_user');
    if (typeof document !== 'undefined') {
      document.cookie = 'tcv_admin_session=; path=/; max-age=0; SameSite=Lax';
    }
  } catch {}

  const login = async (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setUser(DEFAULT_ADMIN);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
