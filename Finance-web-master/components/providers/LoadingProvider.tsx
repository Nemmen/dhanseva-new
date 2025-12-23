'use client';

import LoadingBar from '@/components/ui/LoadingBar';

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingBar />
      {children}
    </>
  );
}
