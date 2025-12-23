import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { DsaService } from './dsa.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

const dsaService = new DsaService();

export const registerDsa = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone, city, state, address, pincode } = req.body;

  if (!email || !password || !firstName || !lastName || !phone || !city || !state) {
    throw new AppError('All required fields must be provided', 400);
  }

  const result = await dsaService.registerDsa({
    email,
    password,
    firstName,
    lastName,
    phone,
    city,
    state,
    address,
    pincode,
  });

  return sendSuccess(res, result, 'DSA registration initiated. Please verify your email.', 201);
});

export const createRegistrationPayment = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const order = await dsaService.createRegistrationPaymentOrder(email);
  return sendSuccess(res, order, 'Payment order created successfully', 200);
});

export const verifyRegistrationPayment = asyncHandler(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !email) {
    throw new AppError('All payment details are required', 400);
  }

  const result = await dsaService.verifyRegistrationPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    email,
  });

  return sendSuccess(res, result, 'DSA registration completed successfully', 200);
});

export const getDsaRequests = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { page = 1, limit = 20, status, sortBy = 'createdAt', includeUnassigned = 'false' } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const { requests, total, summary } = await dsaService.getDsaRequests(
    user.id,
    skip,
    take,
    status as string | undefined,
    sortBy as string,
    includeUnassigned === 'true'
  );

  return sendSuccess(res, {
    requests,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
      hasNext: skip + take < total,
    },
    summary,
  }, 'DSA requests retrieved successfully', 200);
});

export const updateDsaRequest = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const { status, notes, estimatedCompletion } = req.body;

  const updated = await dsaService.updateRequest(id, user.id, { status, notes, estimatedCompletion });
  return sendSuccess(res, updated, 'Request updated successfully', 200);
});

export const exportDsaRequests = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { format = 'csv', dateFrom, dateTo } = req.query;

  const data = await dsaService.exportRequests(
    user.id,
    format as string,
    dateFrom as string | undefined,
    dateTo as string | undefined
  );

  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=dsa-requests.csv');
    return res.send(data);
  }

  return sendSuccess(res, data, 'Requests exported successfully', 200);
});
