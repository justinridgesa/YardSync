'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  contactNumber?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('yard_sync_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    console.log('🔐 [AuthContext] Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('yard_sync_user', JSON.stringify(userData));
  };

  const updateUser = (userData: Partial<User>) => {
    console.log('🔐 [AuthContext] updateUser called with:', userData);
    setUser(prev => {
      if (!prev) {
        console.error('🔐 [AuthContext] ERROR: No existing user to update!');
        return null;
      }
      const updated = { ...prev, ...userData };
      console.log('🔐 [AuthContext] Merged user object:', updated);
      localStorage.setItem('yard_sync_user', JSON.stringify(updated));
      
      // Verify localStorage was written
      const storedData = localStorage.getItem('yard_sync_user');
      console.log('🔐 [AuthContext] Verified localStorage contains:', JSON.parse(storedData || '{}'));
      
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yard_sync_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
