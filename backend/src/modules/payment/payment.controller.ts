import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { PaymentService } from './payment.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

const paymentService = new PaymentService();

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { requestId, amount } = req.body;

  if (!requestId || !amount) {
    throw new AppError('Request ID and amount are required', 400);
  }

  const order = await paymentService.createOrder(user.id, requestId, amount);
  return sendSuccess(res, order, 'Payment order created successfully', 200);
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError('Payment verification details are required', 400);
  }

  const result = await paymentService.verifyPayment(
    user.id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  return sendSuccess(res, result, 'Payment verified and request marked as paid', 200);
});
