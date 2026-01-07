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

  res.cookie('dhanseva_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });

  return sendSuccess(res, user, 'Login successful', 200);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('dhanseva_token', { path: '/' });
  res.clearCookie('dhanseva.sid', { path: '/' });
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
