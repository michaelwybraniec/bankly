import { z } from 'zod';

export interface Account {
  id: string;
  ownerName: string;
  balance: number;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
}

export const AccountSchema = z.object({
  id: z.string().uuid(),
  ownerName: z.string(),
  balance: z.number().int(),
  currency: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.string().optional(),
}); 