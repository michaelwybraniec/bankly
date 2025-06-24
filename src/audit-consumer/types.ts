import { z } from 'zod';

export const MoneyTransferredSchema = z.object({
  fromAccountId: z.string(),
  toAccountId: z.string(),
  amount: z.number(),
  transactionId: z.string(),
  timestamp: z.string(),
});

export type MoneyTransferred = z.infer<typeof MoneyTransferredSchema>; 