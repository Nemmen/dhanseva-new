'use client';

import { createContext, useContext, ReactNode } from 'react';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';

// UploadThing configuration
const UPLOADTHING_URL = process.env.NEXT_PUBLIC_API_BASE_URL 
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/uploadthing`
  : 'http://localhost:5000/api/upload/uploadthing';

interface UploadContextType {
  uploadUrl: string;
}

const UploadContext = createContext<UploadContextType>({
  uploadUrl: UPLOADTHING_URL,
});

export function useUploadContext() {
  return useContext(UploadContext);
}

interface UploadProviderProps {
  children: ReactNode;
}

export function UploadProvider({ children }: UploadProviderProps) {
  return (
    <UploadContext.Provider value={{ uploadUrl: UPLOADTHING_URL }}>
      {children}
    </UploadContext.Provider>
  );
}
