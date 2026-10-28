import { z } from 'npm:zod@3.23.8';

export const paymentRowSchema = z.object({
  id: z.string().uuid(), user_id: z.string().uuid(), order_id: z.string().uuid(), request_key: z.string().uuid(),
  phone: z.string(), amount: z.coerce.number().int(), provider: z.enum(['mtn', 'airtel']),
  transaction_id: z.string().nullable(), status: z.enum(['CREATED', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED', 'REVERSED']),
  created_at: z.string(), updated_at: z.string(),
});
export const transactionSchema = z.object({
  transactionId: z.string().min(1).max(160), status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED', 'REVERSED']),
  amount: z.coerce.number().int().positive(), currency: z.literal('UGX'), phoneNumber: z.string(),
  provider: z.enum(['mtn', 'airtel']), reference: z.string(), type: z.literal('COLLECTION').optional(),
});
export type PaymentRow = z.infer<typeof paymentRowSchema>;
export type GatewayTransaction = z.infer<typeof transactionSchema>;
export const isPendingPayment = (status: string) => ['CREATED', 'PENDING', 'PROCESSING'].includes(status);
export const publicPayment = (payment: PaymentRow) => ({ id: payment.id, orderId: payment.order_id, phone: payment.phone, amount: payment.amount, provider: payment.provider, status: payment.status, createdAt: payment.created_at, transactionId: payment.transaction_id });
export class PaymentError extends Error {
  constructor(message: string, public readonly status = 502) { super(message); }
}
