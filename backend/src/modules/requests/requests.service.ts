import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { emailTemplate } from '../email/template.service';

export class RequestsService {
  async createRequest(userId: string, serviceId: string, formData: any) {
    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    if (!service.isActive) {
      throw new AppError('Service is not active', 400);
    }

    // Check for duplicate unpaid/assigned requests
    const existingRequest = await prisma.serviceRequest.findFirst({
      where: {
        createdById: userId,
        serviceId,
        status: {
          in: ['UNPAID', 'PAID'],
        },
      },
    });

    if (existingRequest) {
      throw new AppError('You already have an active request for this service', 409);
    }

    // Create request
    const request = await prisma.serviceRequest.create({
      data: {
        serviceId,
        createdById: userId,
        status: 'UNPAID',
        paid: false,
        formData,
      },
      include: {
        service: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      id: request.id,
      serviceId: request.serviceId,
      createdById: request.createdById,
      status: request.status,
      paid: request.paid,
      filledByDsaId: request.filledByDsaId,
      createdAt: request.createdAt,
      formData: request.formData,
    };
  }

  async getMyRequests(userId: string, skip: number, take: number, filters: any) {
    const where: any = {
      createdById: userId,
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.serviceId) {
      where.serviceId = filters.serviceId;
    }

    const [requests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where,
        skip,
        take,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              category: true,
              price: true,
            },
          },
          filledByDsa: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.serviceRequest.count({ where }),
    ]);

    return {
      requests: requests.map(r => ({
        id: r.id,
        serviceId: r.serviceId,
        serviceName: r.service.name,
        status: r.status,
        paid: r.paid,
        filledByDsaId: r.filledByDsaId,
        createdAt: r.createdAt,
      })),
      total,
    };
  }

  async getRequestById(id: string, user: any) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        service: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        filledByDsa: {
          select: {
            id: true,
            email: true,
          },
        },
        auditLogs: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 20,
        },
      },
    });

    if (!request) {
      throw new AppError('Request not found', 404);
    }

    // Authorization check - DSA can view any PAID request (for assignment)
    const isOwner = request.createdById === user.id;
    const isAssignedDsa = request.filledByDsaId === user.id;
    const isDsa = user.role === 'DSA';
    const isEmployee = user.role === 'EMPLOYEE';

    if (!isOwner && !isAssignedDsa && !isEmployee && !isDsa) {
      throw new AppError('Unauthorized to view this request', 403);
    }

    return {
      id: request.id,
      serviceId: request.serviceId,
      service: {
        id: request.service.id,
        name: request.service.name,
        category: request.service.category,
        description: request.service.description,
        price: request.service.price,
      },
      createdById: request.createdById,
      createdBy: {
        id: request.createdBy.id,
        email: request.createdBy.email,
      },
      status: request.status,
      paid: request.paid,
      filledByDsaId: request.filledByDsaId,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      formData: request.formData,
      auditLogs: request.auditLogs,
      nextAction: request.paid ? 'DSA will be assigned soon' : 'Please proceed to payment',
    };
  }

  async updateRequest(id: string, user: any, updates: any) {
    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        createdBy: true,
        service: true,
      },
    });

    if (!request) {
      throw new AppError('Request not found', 404);
    }

    // Authorization check
    const isAssignedDsa = request.filledByDsaId === user.id && user.role === 'DSA';
    const isEmployee = user.role === 'EMPLOYEE';

    if (!isAssignedDsa && !isEmployee) {
      throw new AppError('Unauthorized to update this request', 403);
    }

    // Validate status transitions
    if (updates.status) {
      const allowedTransitions: any = {
        UNPAID: ['PAID'],
        PAID: ['IN_PROGRESS'],
        IN_PROGRESS: ['COMPLETED', 'ON_HOLD'],
        ON_HOLD: ['IN_PROGRESS'],
      };

      const allowed = allowedTransitions[request.status] || [];
      if (!allowed.includes(updates.status) && updates.status !== 'ON_HOLD') {
        throw new AppError(`Cannot transition from ${request.status} to ${updates.status}`, 400);
      }
    }

    // Update request
    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status: updates.status,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        requestId: id,
        performedBy: user.id,
        action: 'UPDATE_STATUS',
        oldValue: request.status as any,
        newValue: (updates.status || request.status) as any,
      },
    });

    // Send email notification if status changed
    if (updates.status && updates.status !== request.status) {
      try {
        await emailTemplate.sendRequestStatusUpdate(
          request.createdBy.email,
          request.createdBy.email.split('@')[0],
          request.service.name,
          updates.status,
          request.id,
          new Date().toISOString(),
          updates.estimatedCompletion || 'TBD',
          updates.notes
        );
      } catch (error) {
        console.error('Failed to send status update email:', error);
      }
    }

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }
}
