import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { RequestsService } from './requests.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

const requestsService = new RequestsService();

export const createRequest = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { serviceId, formData } = req.body;

  if (!serviceId || !formData) {
    throw new AppError('Service ID and form data are required', 400);
  }

  const request = await requestsService.createRequest(user.id, serviceId, formData);
  return sendSuccess(res, request, 'Service request created successfully', 201);
});

export const getMyRequests = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { page = 1, limit = 10, status, serviceId } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const filters = {
    status: status as string | undefined,
    serviceId: serviceId as string | undefined,
  };

  const { requests, total } = await requestsService.getMyRequests(user.id, skip, take, filters);

  return sendSuccess(res, {
    requests,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
      hasNext: skip + take < total,
      hasPrevious: Number(page) > 1,
    },
  }, 'Requests retrieved successfully', 200);
});

export const getRequestById = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;

  const request = await requestsService.getRequestById(id, user);
  return sendSuccess(res, request, 'Request retrieved successfully', 200);
});

export const updateRequest = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { status, notes, estimatedCompletion } = req.body;

  const updated = await requestsService.updateRequest(id, user, { status, notes, estimatedCompletion });
  return sendSuccess(res, updated, 'Request updated successfully', 200);
});
