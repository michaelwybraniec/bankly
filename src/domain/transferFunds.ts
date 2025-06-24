import { Account, AccountSchema } from './Account';
import { Transaction, TransactionSchema } from './Transaction';
import { z } from 'zod';
import { Either, left, right } from 'fp-ts/Either';

export type TransferFundsError =
  | { type: 'InvalidAccount'; message: string }
  | { type: 'InactiveAccount'; message: string }
  | { type: 'InsufficientFunds'; message: string }
  | { type: 'InvalidAmount'; message: string }
  | { type: 'CurrencyMismatch'; message: string };

export interface TransferFundsInput {
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  currency?: string;
}

const TransferFundsInputShape = z.object({
  fromAccount: z.any(),
  toAccount: z.any(),
  amount: z.number(),
  currency: z.string().optional(),
});

export function transferFunds(
  input: TransferFundsInput,
): Either<
  TransferFundsError,
  { updatedFrom: Account; updatedTo: Account; transaction: Transaction }
> {
  // Only check shape, not business rules
  const parseResult = TransferFundsInputShape.safeParse(input);
  if (!parseResult.success) {
    return left({ type: 'InvalidAccount', message: 'Invalid input: ' + parseResult.error.message });
  }
  const { fromAccount, toAccount, amount, currency } = input;

  if (typeof fromAccount.status === 'string' && fromAccount.status !== 'active') {
    return left({ type: 'InactiveAccount', message: 'Source account is not active' });
  }
  if (typeof toAccount.status === 'string' && toAccount.status !== 'active') {
    return left({ type: 'InactiveAccount', message: 'Destination account is not active' });
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return left({ type: 'InvalidAmount', message: 'Amount must be positive' });
  }
  if (fromAccount.balance < amount) {
    return left({ type: 'InsufficientFunds', message: 'Insufficient funds' });
  }
  if (currency && (fromAccount.currency !== currency || toAccount.currency !== currency)) {
    return left({ type: 'CurrencyMismatch', message: 'Currency mismatch' });
  }

  // Update balances (immutably)
  const updatedFrom: Account = {
    ...fromAccount,
    balance: fromAccount.balance - amount,
    updatedAt: new Date(),
  };
  const updatedTo: Account = {
    ...toAccount,
    balance: toAccount.balance + amount,
    updatedAt: new Date(),
  };

  // Create transaction
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    fromAccountId: fromAccount.id,
    toAccountId: toAccount.id,
    amount,
    currency: currency ?? fromAccount.currency,
    createdAt: new Date(),
    status: 'completed',
    type: 'transfer',
  };

  return right({ updatedFrom, updatedTo, transaction });
}
