import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';

import type { OurFileRouter } from './uploadthing.types';

// Get API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Override global fetch to include credentials for UploadThing requests
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Add credentials for UploadThing API requests
    if (url.includes('/upload/uploadthing') || url.includes('uploadthing.com')) {
      return originalFetch(input, {
        ...init,
        credentials: 'include',
      });
    }
    
    return originalFetch(input, init);
  };
}

// Generate React components with custom URL
export const UploadButton = generateUploadButton<OurFileRouter>({
  url: `${API_BASE_URL}/upload/uploadthing`,
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: `${API_BASE_URL}/upload/uploadthing`,
});

// Generate hooks with custom URL
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>({
  url: `${API_BASE_URL}/upload/uploadthing`,
});