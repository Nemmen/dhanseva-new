import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { emailTemplate } from '../email/template.service';
import { generateInviteToken } from '../../utils/generators';

export class EmployeeService {
  async getAllRequests(skip: number, take: number, filters: any) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.assignedDsa) {
      if (filters.assignedDsa === 'null') {
        where.filledByDsaId = null;
      } else {
        where.filledByDsaId = filters.assignedDsa;
      }
    }

    if (filters.city) {
      where.formData = {
        path: ['base', 'city'],
        equals: filters.city,
      };
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
          filledByDsa: {
            select: {
              email: true,
              dsaProfile: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    // Get analytics
    const analytics = {
      totalRequests: await prisma.serviceRequest.count(),
      unpaid: await prisma.serviceRequest.count({ where: { paid: false } }),
      assigned: await prisma.serviceRequest.count({ where: { status: 'PAID' } }),
      inProgress: await prisma.serviceRequest.count({ where: { status: 'IN_PROGRESS' } }),
      completed: await prisma.serviceRequest.count({ where: { status: 'COMPLETED' } }),
    };

    return {
      requests: requests.map(r => ({
        id: r.id,
        serviceName: r.service.name,
        userName: r.createdBy.email.split('@')[0],
        userEmail: r.createdBy.email,
        userCity: (r.formData as any)?.base?.city || 'N/A',
        status: r.status,
        paid: r.paid,
        filledByDsaId: r.filledByDsaId,
        createdAt: r.createdAt,
        urgency: 'NORMAL',
        documents: this.countDocuments(r.formData),
        assignedDsa: r.filledByDsa ? {
          name: r.filledByDsa.dsaProfile?.fullName || r.filledByDsa.email.split('@')[0],
          email: r.filledByDsa.email,
        } : null,
      })),
      total,
      analytics,
    };
  }

  async assignDsa(requestId: string, dsaId: string, employeeId: string) {
    // Verify request exists
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        service: true,
        createdBy: true,
      },
    });

    if (!request) {
      throw new AppError('Request not found', 404);
    }

    if (!request.paid) {
      throw new AppError('Request must be paid before assigning DSA', 400);
    }

    // Verify DSA exists and is active
    const dsa = await prisma.user.findUnique({
      where: { id: dsaId },
      include: {
        dsaProfile: true,
      },
    });

    if (!dsa || dsa.role !== 'DSA') {
      throw new AppError('DSA not found', 404);
    }

    if (!dsa.dsaProfile?.isActive) {
      throw new AppError('DSA is not active', 400);
    }

    // Assign DSA
    await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        filledByDsaId: dsaId,
        status: 'PAID',
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        requestId,
        performedBy: employeeId,
        action: 'ASSIGN_DSA',
        oldValue: request.filledByDsaId as any,
        newValue: dsaId as any,
      },
    });

    // Send emails
    try {
      // Email to customer
      await emailTemplate.sendRequestStatusUpdate(
        request.createdBy.email,
        request.createdBy.email.split('@')[0],
        request.service.name,
        'ASSIGNED',
        requestId,
        new Date().toLocaleString('en-IN'),
        'Within 2-3 days',
        `Your request has been assigned to ${dsa.dsaProfile?.fullName}`,
        dsa.dsaProfile?.fullName || 'Legal Expert',
        dsa.email,
        dsa.dsaProfile?.phone,
        'Professional Experience'
      );

      // Email to DSA - using registration success template as placeholder
      await emailTemplate.sendRegistrationSuccess(
        dsa.email,
        dsa.dsaProfile?.fullName || 'DSA',
        'DSA',
        'http://localhost:5000/dsa/dashboard',
        new Date().toLocaleString('en-IN')
      );
    } catch (error) {
      console.error('Failed to send assignment emails:', error);
    }

    return {
      requestId,
      dsaName: dsa.dsaProfile?.fullName || dsa.email.split('@')[0],
      dsaEmail: dsa.email,
      status: 'ASSIGNED',
      assignedAt: new Date().toISOString(),
    };
  }

  async inviteDsa(data: any) {
    // Check if already invited
    const existing = await prisma.dsaInvite.findFirst({
      where: {
        email: data.email,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (existing) {
      throw new AppError('An active invite already exists for this email', 409);
    }

    // Generate invite token
    const token = generateInviteToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invite
    await prisma.dsaInvite.create({
      data: {
        email: data.email,
        token,
        expiresAt,
      },
    });

    // Send invite email
    const registrationLink = `http://localhost:5000/dsa/register?token=${token}`;
    
    try {
      await emailTemplate.sendDsaInvitation(
        data.email,
        data.firstName,
        data.regions.join(', '),
        registrationLink,
        expiresAt.toLocaleDateString('en-IN')
      );
    } catch (error) {
      console.error('Failed to send DSA invitation email:', error);
    }

    return {
      inviteToken: token,
      sentTo: data.email,
      expiresAt: expiresAt.toISOString(),
      registrationLink,
    };
  }

  async updateRequest(requestId: string, employeeId: string, updates: any) {
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
        performedBy: employeeId,
        action: 'UPDATE_STATUS',
        oldValue: request.status as any,
        newValue: (updates.status || request.status) as any,
      },
    });

    // Send completion email if status is COMPLETED
    if (updates.status === 'COMPLETED') {
      try {
        await emailTemplate.sendRequestCompletion(
          request.createdBy.email,
          request.createdBy.email.split('@')[0],
          request.service.name,
          requestId,
          new Date().toLocaleString('en-IN'),
          'N/A',
          `http://localhost:5000/download/${requestId}`,
          'Legal Expert',
          'Professional',
          '5+ years',
          'expert@dhanseva.com',
          `http://localhost:5000/rate/${requestId}`,
          'http://localhost:5000/services'
        );
      } catch (error) {
        console.error('Failed to send completion email:', error);
      }
    }

    return {
      id: updated.id,
      status: updated.status,
      completedAt: updates.status === 'COMPLETED' ? new Date().toISOString() : null,
    };
  }

  /**
   * Get request by ID with full details
   */
  async getRequestById(requestId: string) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        service: true,
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
        filledByDsa: {
          select: {
            id: true,
            email: true,
            dsaProfile: {
              select: {
                fullName: true,
                phone: true,
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            razorpayOrderId: true,
            razorpayPaymentId: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        auditLogs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!request) {
      throw new AppError('Request not found', 404);
    }

    return request;
  }

  /**
   * Get all DSAs with assignment stats
   */
  async getAllDsas(skip: number, take: number, filters: any) {
    const where: any = {
      role: 'DSA',
      dsaProfile: {
        isNot: null,
      },
    };

    if (filters.isActive !== undefined) {
      where.dsaProfile = {
        ...where.dsaProfile,
        isActive: filters.isActive,
      };
    }

    const [dsas, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        include: {
          dsaProfile: true,
          _count: {
            select: {
              dsaRequests: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Get completed counts
    const dsaIds = dsas.map(d => d.id);
    const completedCounts = await prisma.serviceRequest.groupBy({
      by: ['filledByDsaId'],
      where: {
        filledByDsaId: { in: dsaIds },
        status: 'COMPLETED',
      },
      _count: true,
    });

    const completedMap = new Map(
      completedCounts.map(c => [c.filledByDsaId, c._count])
    );

    return {
      dsas: dsas.map(dsa => ({
        id: dsa.id,
        email: dsa.email,
        emailVerified: dsa.emailVerified,
        createdAt: dsa.createdAt,
        dsaProfile: dsa.dsaProfile ? {
          id: dsa.dsaProfile.id,
          fullName: dsa.dsaProfile.fullName,
          phone: dsa.dsaProfile.phone,
          whatsapp: dsa.dsaProfile.whatsapp,
          city: dsa.dsaProfile.city,
          state: dsa.dsaProfile.state,
          isActive: dsa.dsaProfile.isActive,
          registrationPaid: dsa.dsaProfile.registrationPaid,
        } : null,
        assignedCount: dsa._count.dsaRequests,
        completedCount: completedMap.get(dsa.id) || 0,
      })),
      total,
    };
  }

  /**
   * Get active DSAs for assignment dropdown
   */
  async getActiveDsas() {
    const dsas = await prisma.user.findMany({
      where: {
        role: 'DSA',
        dsaProfile: {
          isActive: true,
          registrationPaid: true,
        },
      },
      include: {
        dsaProfile: true,
        _count: {
          select: {
            dsaRequests: true,
          },
        },
      },
      orderBy: {
        dsaProfile: {
          fullName: 'asc',
        },
      },
    });

    return dsas.map(dsa => ({
      id: dsa.id,
      name: dsa.dsaProfile?.fullName || dsa.email.split('@')[0],
      email: dsa.email,
      city: dsa.dsaProfile?.city || 'N/A',
      assignedCount: dsa._count.dsaRequests,
    }));
  }

  async bulkCreateEmployees(employees: Array<{ email: string; fullName: string; password: string }>) {
    const bcrypt = require('bcryptjs');
    const results = {
      created: [] as string[],
      failed: [] as { email: string; reason: string }[],
    };

    for (const emp of employees) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: emp.email },
        });

        if (existingUser) {
          results.failed.push({ email: emp.email, reason: 'User already exists' });
          continue;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(emp.password, 10);

        // Create user and employee profile
        await prisma.user.create({
          data: {
            email: emp.email,
            passwordHash,
            role: 'EMPLOYEE',
            emailVerified: true,
            employeeProfile: {
              create: {
                fullName: emp.fullName,
              },
            },
          },
        });

        results.created.push(emp.email);
        console.log(`✅ Employee created: ${emp.email}`);
      } catch (error: any) {
        console.error(`❌ Failed to create employee ${emp.email}:`, error.message);
        results.failed.push({ email: emp.email, reason: error.message || 'Unknown error' });
      }
    }

    return {
      success: results.created.length,
      failed: results.failed.length,
      results,
    };
  }

  private countDocuments(formData: any): number {
    if (!formData?.base) return 0;
    return Object.keys(formData.base).filter(k => k.includes('Url') && formData.base[k]).length;
  }
}
