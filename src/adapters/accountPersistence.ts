import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Transfer funds between two accounts in a transaction-safe way.
 * Throws if accounts are missing or insufficient funds.
 * Only handles persistence, not business logic.
 */
export async function transferFundsPrisma(
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  currency?: string,
) {
  return await prisma.$transaction(async (tx: any) => {
    const from = await tx.account.findUnique({ where: { id: fromAccountId } });
    const to = await tx.account.findUnique({ where: { id: toAccountId } });

    if (!from || !to) throw new Error('Account not found');
    if (from.balance < amount) throw new Error('Insufficient funds');
    if (currency && (from.currency !== currency || to.currency !== currency)) {
      throw new Error('Currency mismatch');
    }

    await tx.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } },
    });

    await tx.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } },
    });

    const transaction = await tx.transaction.create({
      data: {
        fromAccountId,
        toAccountId,
        amount,
        currency: currency ?? from.currency,
        status: 'completed',
        type: 'transfer',
      },
    });

    return transaction;
  });
}

// Example usage:
type Account = typeof prisma.account extends { findUnique: (args: any) => Promise<infer T> }
  ? T
  : never;
type Transaction = typeof prisma.transaction extends { create: (args: any) => Promise<infer T> }
  ? T
  : never;
