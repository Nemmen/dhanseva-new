import { prisma } from '../../config/database';
import { razorpayInstance } from '../../config/razorpay';
import { AppError } from '../../middleware/errorHandler';
import { emailTemplate } from '../email/template.service';
import crypto from 'crypto';
import { config } from '../../config';

export class PaymentService {
  async createOrder(userId: string, requestId: string, amount: number) {
    // Verify request exists and belongs to user
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

    if (request.createdById !== userId) {
      throw new AppError('Unauthorized to pay for this request', 403);
    }

    if (request.paid) {
      throw new AppError('Request is already paid', 400);
    }

    // Verify amount matches service price
    if (amount !== request.service.price) {
      throw new AppError('Amount does not match service price', 400);
    }

    // Create Razorpay order
    // Receipt max length is 40 chars, so we use a shortened format
    const shortReceipt = `rcpt_${requestId.replace(/-/g, '').substring(0, 32)}`;
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: shortReceipt,
      notes: {
        requestId,
        serviceId: request.serviceId,
        serviceName: request.service.name,
        userId,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    // Store order details in database
    await prisma.payment.create({
      data: {
        requestId,
        userId,
        razorpayOrderId: order.id,
        amount: amount * 100,
        currency: 'INR',
        status: 'PENDING',
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.razorpay.keyId,
      customerId: userId,
      notes: order.notes,
      createdAt: new Date().toISOString(),
    };
  }

  async verifyPayment(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string
  ) {
    // Verify signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new AppError('Invalid payment signature', 400);
    }

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: {
        request: {
          include: {
            service: true,
            createdBy: true,
          },
        },
      },
    });

    if (!payment) {
      throw new AppError('Payment record not found', 404);
    }

    // Check if already verified (idempotency)
    if (payment.status === 'SUCCESS') {
      return {
        requestId: payment.requestId,
        paymentId: payment.razorpayPaymentId,
        amount: payment.amount,
        status: 'PAID',
        message: 'Payment already verified',
      };
    }

    // Verify request belongs to user
    if (payment.request.createdById !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    // Update payment and request
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          status: 'SUCCESS',
        },
      }),
      prisma.serviceRequest.update({
        where: { id: payment.requestId },
        data: {
          paid: true,
          status: 'PAID',
        },
      }),
    ]);

    // Send confirmation email
    try {
      await emailTemplate.sendPaymentSuccess(
        payment.request.createdBy.email,
        payment.request.createdBy.email.split('@')[0],
        payment.request.service.name,
        paymentId,
        (payment.amount / 100).toString(),
        new Date().toLocaleString('en-IN'),
        'Online',
        payment.requestId,
        `${config.corsOrigin}/requests/${payment.requestId}`
      );
    } catch (error) {
      //console.error('Failed to send payment confirmation email:', error);
    }

    return {
      requestId: payment.requestId,
      paymentId,
      amount: payment.amount,
      status: 'PAID',
      verifiedAt: new Date().toISOString(),
      message: 'DSA will be assigned within 24 hours',
    };
  }
}
