'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook to protect routes that require authentication
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're done loading AND user is not authenticated
    if (!loading && !user) {
      const currentPath = window.location.pathname + window.location.search;
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}

/**
 * Hook to restrict routes for authenticated users (e.g., login, register)
 */
export function useRequireGuest(redirectTo: string = '/') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}

/**
 * Hook to check if user has specific role
 */
export function useRequireRole(role: 'USER' | 'DSA' | 'EMPLOYEE', redirectTo: string = '/') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== role)) {
      router.push(redirectTo);
    }
  }, [user, loading, role, router, redirectTo]);

  return { user, loading };
}
