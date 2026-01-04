import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from '@uploadthing/react';

import type { OurFileRouter } from './uploadthing.types';

// Get API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

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
