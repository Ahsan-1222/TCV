import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tcv_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('tcv_user', JSON.stringify(user));
    else localStorage.removeItem('tcv_user');
  }, [user]);

  const login = async (email: string, password: string) => {
    // Demo auth - in production would use Firebase Auth
    if (email === 'crownvault' && password === 'Admin@123') {
      setUser({ id: '1', email, role: 'admin', name: 'Admin' });
      return true;
    }
    if (password.length >= 6) {
      setUser({ id: '2', email, role: 'customer', name: email.split('@')[0] });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

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
