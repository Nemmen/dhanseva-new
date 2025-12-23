import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export class ServicesService {
  async getAllServices(skip: number, take: number) {
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        skip,
        take,
        include: {
          _count: {
            select: { requests: true },
          },
        },
      }),
      prisma.service.count(),
    ]);

    return { services, total };
  }

  async getServiceById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: { requests: true },
        },
      },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    return service;
  }

  async getServicesByCategory(category: string, skip: number, take: number) {
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where: { category: category as any },
        skip,
        take,
        include: {
          _count: {
            select: { requests: true },
          },
        },
      }),
      prisma.service.count({
        where: { category: category as any },
      }),
    ]);

    return { services, total };
  }
}
