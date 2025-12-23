import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { ServicesService } from './services.service';
import { sendSuccess } from '../../utils/response';

const servicesService = new ServicesService();

export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const { services, total } = await servicesService.getAllServices(skip, take);

  return sendSuccess(res, {
    services,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  }, 'Services fetched successfully', 200);
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = await servicesService.getServiceById(id);
  return sendSuccess(res, service, 'Service fetched successfully', 200);
});

export const getServicesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const { services, total } = await servicesService.getServicesByCategory(category, skip, take);

  return sendSuccess(res, {
    services,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  }, 'Services fetched successfully', 200);
});
