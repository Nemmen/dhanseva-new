'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth.types';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialCheckDone: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'USER' | 'DSA' | 'EMPLOYEE') => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // First, try to load from sessionStorage for immediate availability
      if (typeof window !== 'undefined') {
        const storedUser = sessionStorage.getItem('dhanseva_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
          } catch (e) {
            sessionStorage.removeItem('dhanseva_user');
          }
        }
      }
      
      // Then verify with backend
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Update sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('dhanseva_user', JSON.stringify(currentUser));
      }
    } catch (error) {
      setUser(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('dhanseva_user');
      }
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
    }
  };

  const login = async (email: string, password: string) => {
    const response: any = await authService.login({ email, password });
    // API interceptor returns the full response object with { success, message, data }
    const userData = response.data;
    setUser(userData);
    
    // Store user in sessionStorage for immediate persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dhanseva_user', JSON.stringify(userData));
    }
    
    return userData;
  };

  const register = async (email: string, password: string, role: 'USER' | 'DSA' | 'EMPLOYEE') => {
    const response: any = await authService.register({ email, password, role });
    // API interceptor returns the full response object with { success, message, data }
    const userData = response.data;
    setUser(userData);
    
    // Store user in sessionStorage for immediate persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dhanseva_user', JSON.stringify(userData));
    }
    
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    
    // Clear sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dhanseva_user');
    }
    
    router.push('/');
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    initialCheckDone,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
