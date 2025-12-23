import { prisma } from '../../config/database';
import { hashPassword, comparePassword, generateToken } from '../../utils/auth';
import { AppError } from '../../middleware/errorHandler';

export class AuthService {
  async register(email: string, password: string, role: 'USER' | 'DSA' | 'EMPLOYEE') {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Validate password strength
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400);
    }
    if (!/[A-Z]/.test(password)) {
      throw new AppError('Password must contain at least one uppercase letter', 400);
    }
    if (!/[0-9]/.test(password)) {
      throw new AppError('Password must contain at least one number', 400);
    }
    if (!/[!@#$%^&*]/.test(password)) {
      throw new AppError('Password must contain at least one special character (!@#$%^&*)', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        emailVerified: false,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }

  async login(email: string, password: string) {
    // Find user with profile
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        dsaProfile: true,
        employeeProfile: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // DSA-specific checks
    if (user.role === 'DSA') {
      // Check email verification
      if (!user.emailVerified) {
        throw new AppError('Please verify your email first', 403, { 
          code: 'EMAIL_NOT_VERIFIED',
          email: user.email 
        });
      }
      
      // Check registration payment
      if (!user.dsaProfile?.registrationPaid) {
        throw new AppError('Please complete registration payment', 403, {
          code: 'PAYMENT_REQUIRED',
          email: user.email,
          userId: user.id,
        });
      }
      
      // Check if DSA is active
      if (!user.dsaProfile?.isActive) {
        throw new AppError('Your DSA account is pending activation', 403, {
          code: 'ACCOUNT_INACTIVE',
        });
      }
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        dsaProfile: user.dsaProfile,
        employeeProfile: user.employeeProfile,
      },
      token,
    };
  }

  async verifyEmail(email: string) {
    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }
}
