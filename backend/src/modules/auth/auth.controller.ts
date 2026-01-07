import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  console.log('[REGISTER] Attempt:', { email, role });

  if (!email || !password || !role) {
    throw new AppError('Email, password, and role are required', 400);
  }

  try {
    const user = await authService.register(email, password, role);
    console.log('[REGISTER] Success:', user.id);
    return sendSuccess(res, user, 'Registration successful', 201);
  } catch (error: any) {
    console.error('[REGISTER] Error:', error.message, error.stack);
    throw error;
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const { user, token } = await authService.login(email, password);

  // Cookie configuration for cross-origin setup (dhansevaindia.com <-> api.dhansevaindia.com)
  const cookieOptions: any = {
    httpOnly: true,
    secure: true, // Always true for production HTTPS
    sameSite: 'none', // Required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };

  // Set domain for cross-subdomain cookie sharing in production
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.domain = '.dhansevaindia.com';
  }

  res.cookie('dhanseva_token', token, cookieOptions);

  return sendSuccess(res, user, 'Login successful', 200);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Clear cookies with same configuration used when setting them
  const clearOptions: any = { path: '/' };
  
  if (process.env.NODE_ENV === 'production') {
    clearOptions.domain = '.dhansevaindia.com';
  }
  
  res.clearCookie('dhanseva_token', clearOptions);
  res.clearCookie('dhanseva.sid', clearOptions);
  return sendSuccess(res, null, 'Logout successful', 200);
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user) {
    throw new AppError('User not authenticated', 401);
  }
  
  // Return user data with emailVerified status
  return sendSuccess(res, {
    id: user.id,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified || false,
  }, 'User fetched successfully', 200);
});
