import api, { ApiResponse } from '@/lib/api';
import { LoginData, RegisterData, OTPData, User, AuthResponse } from '@/types/auth.types';

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return api.post('/auth/register', data);
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    return api.post('/auth/login', data);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse> => {
    return api.post('/auth/logout');
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response: ApiResponse<User> = await api.get('/auth/me');
    return response.data!;
  },

  /**
   * Check if user is authenticated
   */
  checkAuth: async (): Promise<boolean> => {
    try {
      await api.get('/auth/me');
      return true;
    } catch (error) {
      return false;
    }
  },
};
