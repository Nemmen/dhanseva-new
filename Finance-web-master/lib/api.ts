import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth tokens here if needed (though we use httpOnly cookies)
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the data directly
    return response.data;
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      // Handle 401 Unauthorized - DON'T redirect, just throw the error
      // Let components handle authentication failures appropriately
      if (status === 401) {
        // Just log it, don't redirect
        //console.log('Authentication required:', data.message);
      }

      // Handle 403 Forbidden
      if (status === 403) {
        //console.error('Access forbidden:', data.message);
      }

      // Handle 404 Not Found
      if (status === 404) {
        //console.error('Resource not found:', data.message);
      }

      // Handle 500 Server Error
      if (status >= 500) {
        //console.error('Server error:', data.message);
      }

      // Throw error with backend message
      throw new Error(data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An error occurred');
    }
  }
);

export default api;

// Type-safe API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination interface
export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
