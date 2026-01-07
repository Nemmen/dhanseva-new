'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook to protect routes that require authentication
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { user, loading, initialCheckDone } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if initial auth check is done AND user is not authenticated
    // This prevents redirecting while still checking sessionStorage/backend
    if (initialCheckDone && !loading && !user) {
      const currentPath = window.location.pathname + window.location.search;
      router.replace(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, initialCheckDone, router, redirectTo]);

  // Return loading as true if initial check hasn't completed
  return { user, loading: loading || !initialCheckDone };
}

/**
 * Hook to restrict routes for authenticated users (e.g., login, register)
 */
export function useRequireGuest(redirectTo: string = '/') {
  const { user, loading, initialCheckDone } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once initial auth check is done
    if (initialCheckDone && !loading && user) {
      router.push(redirectTo);
    }
  }, [user, loading, initialCheckDone, router, redirectTo]);

  return { user, loading: loading || !initialCheckDone };
}

/**
 * Hook to check if user has specific role
 */
export function useRequireRole(role: 'USER' | 'DSA' | 'EMPLOYEE', redirectTo: string = '/') {
  const { user, loading, initialCheckDone } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once initial auth check is done
    if (initialCheckDone && !loading && (!user || user.role !== role)) {
      router.push(redirectTo);
    }
  }, [user, loading, initialCheckDone, role, router, redirectTo]);

  return { user, loading: loading || !initialCheckDone };
}
