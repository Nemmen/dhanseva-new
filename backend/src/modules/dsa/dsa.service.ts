import { prisma } from '../../config/database';
import { hashPassword } from '../../utils/auth';
import { AppError } from '../../middleware/errorHandler';
import { emailTemplate } from '../email/template.service';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../../config';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

const DSA_REGISTRATION_FEE = 29900; // ₹299 in paise

export class DsaService {
  async registerDsa(data: any) {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        role: 'DSA',
        emailVerified: false,
        dsaProfile: {
          create: {
            fullName: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
            whatsapp: data.phone,
            address: data.address || 'N/A',
            city: data.city,
            state: data.state,
            pincode: data.pincode || '000000',
            registrationPaid: false,
            isActive: false, // Activate after payment
          },
        },
      },
      include: {
        dsaProfile: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: {
        fullName: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        city: data.city,
        state: data.state,
      },
      nextStep: 'VERIFY_EMAIL',
      message: 'Please verify your email to continue',
    };
  }

  // Create payment order for DSA registration
  async createRegistrationPaymentOrder(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { dsaProfile: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role !== 'DSA') {
      throw new AppError('Invalid user type', 400);
    }

    if (!user.emailVerified) {
      throw new AppError('Please verify your email first', 400);
    }

    if (user.dsaProfile?.registrationPaid) {
      throw new AppError('Registration fee already paid', 400);
    }

    // Create Razorpay order
    const receiptId = `dsa_${user.id.replace(/-/g, '').substring(0, 20)}`;
    
    const order = await razorpay.orders.create({
      amount: DSA_REGISTRATION_FEE,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        type: 'DSA_REGISTRATION',
        userId: user.id,
        email: user.email,
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.razorpay.keyId,
      userId: user.id,
      email: user.email,
      notes: {
        type: 'DSA_REGISTRATION',
        userId: user.id,
      },
    };
  }

  // Verify and complete DSA registration payment
  async verifyRegistrationPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    email: string;
  }) {
    // Verify signature
    const body = data.razorpay_order_id + '|' + data.razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== data.razorpay_signature) {
      throw new AppError('Invalid payment signature', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { dsaProfile: true },
    });

    if (!user || !user.dsaProfile) {
      throw new AppError('User not found', 404);
    }

    // Update DSA profile
    await prisma.dsaProfile.update({
      where: { userId: user.id },
      data: {
        registrationPaid: true,
        isActive: true, // Activate immediately after payment
      },
    });

    // Send welcome email
    try {
      await emailTemplate.sendRegistrationSuccess(
        user.email,
        user.dsaProfile.fullName,
        'DSA',
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dsa`,
        new Date().toLocaleDateString('en-IN')
      );
    } catch (error) {
      //console.error('Failed to send welcome email:', error);
    }

    return {
      success: true,
      message: 'DSA registration completed successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        dsaProfile: {
          ...user.dsaProfile,
          registrationPaid: true,
          isActive: true,
        },
      },
    };
  }

  async getDsaRequests(dsaId: string, skip: number, take: number, status?: string, sortBy: string = 'createdAt', includeUnassigned: boolean = false) {
    const where: any = includeUnassigned 
      ? {
          OR: [
            { filledByDsaId: dsaId },
            { filledByDsaId: null, status: 'PAID' }, // Unassigned paid requests
          ],
        }
      : { filledByDsaId: dsaId };

    if (status) {
      if (includeUnassigned) {
        where.AND = [{ status }];
      } else {
        where.status = status;
      }
    }

    const [requests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        skip,
        take,
        include: {
          service: {
            select: {
              name: true,
            },
          },
          createdBy: {
            select: {
              email: true,
            },
          },
        },
        orderBy: {
          [sortBy]: 'desc',
        },
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    // Get summary statistics
    const summary = {
      totalAssigned: await prisma.serviceRequest.count({
        where: { filledByDsaId: dsaId },
      }),
      inProgress: await prisma.serviceRequest.count({
        where: { filledByDsaId: dsaId, status: 'IN_PROGRESS' },
      }),
      completed: await prisma.serviceRequest.count({
        where: { filledByDsaId: dsaId, status: 'COMPLETED' },
      }),
      onHold: await prisma.serviceRequest.count({
        where: { filledByDsaId: dsaId, status: 'CANCELLED' as any },
      }),
    };

    return {
      requests: requests.map(r => ({
        id: r.id,
        serviceName: r.service.name,
        userName: r.createdBy.email.split('@')[0],
        userEmail: r.createdBy.email,
        status: r.status,
        createdAt: r.createdAt,
        formSummary: this.extractFormSummary(r.formData),
      })),
      total,
      summary,
    };
  }

  async updateRequest(requestId: string, dsaId: string, updates: any) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        createdBy: true,
        service: true,
      },
    });

    if (!request) {
      throw new AppError('Request not found', 404);
    }

    if (request.filledByDsaId !== dsaId) {
      throw new AppError('You are not assigned to this request', 403);
    }

    // Update request
    const updated = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: updates.status,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        requestId,
        performedBy: dsaId,
        action: 'UPDATE_STATUS',
        oldValue: request.status as any,
        newValue: (updates.status || request.status) as any,
      },
    });

    // Send email notification
    if (updates.status && updates.status !== request.status) {
      try {
        await emailTemplate.sendRequestStatusUpdate(
          request.createdBy.email,
          request.createdBy.email.split('@')[0],
          request.service.name,
          updates.status,
          requestId,
          new Date().toLocaleString('en-IN'),
          updates.estimatedCompletion || 'TBD',
          updates.notes
        );
      } catch (error) {
        //console.error('Failed to send email:', error);
      }
    }

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }

  async exportRequests(dsaId: string, format: string, dateFrom?: string, dateTo?: string) {
    const where: any = {
      filledByDsaId: dsaId,
      status: 'COMPLETED',
    };

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        service: true,
        createdBy: {
          select: {
            email: true,
          },
        },
      },
    });

    if (format === 'csv') {
      let csv = 'id,serviceName,userName,userEmail,status,amount,completedAt\n';
      requests.forEach(r => {
        csv += `${r.id},${r.service.name},${r.createdBy.email.split('@')[0]},${r.createdBy.email},${r.status},${r.service.price * 100},${r.updatedAt.toISOString()}\n`;
      });
      return csv;
    }

    return requests;
  }

  private extractFormSummary(formData: any): any {
    if (!formData) return {};
    
    const summary: any = {};
    
    if (formData.personal?.purposeDescription) {
      summary.purpose = formData.personal.purposeDescription.substring(0, 50);
    }
    
    if (formData.business?.businessName) {
      summary.businessName = formData.business.businessName;
    }
    
    if (formData.base) {
      summary.documents = Object.keys(formData.base).filter(k => k.includes('Url')).length;
    }
    
    return summary;
  }
}
