import { z } from 'zod';

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  currency?: string;
  createdAt: Date;
  status: string;
  type: string;
  reference?: string;
}

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  fromAccountId: z.string().uuid(),
  toAccountId: z.string().uuid(),
  amount: z.number().int().positive(),
  currency: z.string().optional(),
  createdAt: z.date(),
  status: z.string(),
  type: z.string(),
  reference: z.string().optional(),
}); 