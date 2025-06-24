import { transferFunds } from '../../src/domain/transferFunds';
import { Account } from '../../src/domain/Account';

describe('transferFunds (AWP Step 8.1)', () => {
  const baseAccount: Account = {
    id: 'a1',
    ownerName: 'Alice',
    balance: 1000,
    currency: 'USD',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
  };
  const otherAccount: Account = {
    ...baseAccount,
    id: 'a2',
    ownerName: 'Bob',
  };

  it('should transfer funds successfully', () => {
    const result = transferFunds({
      fromAccount: baseAccount,
      toAccount: otherAccount,
      amount: 200,
      currency: 'USD',
    });
    expect(result._tag).toBe('Right');
    if (result._tag === 'Right') {
      expect(result.right.updatedFrom.balance).toBe(800);
      expect(result.right.updatedTo.balance).toBe(1200);
      expect(result.right.transaction.amount).toBe(200);
    }
  });

  it('should fail if insufficient funds', () => {
    const result = transferFunds({
      fromAccount: { ...baseAccount, balance: 100 },
      toAccount: otherAccount,
      amount: 200,
      currency: 'USD',
    });
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left.type).toBe('InsufficientFunds');
    }
  });

  it('should fail if fromAccount is inactive', () => {
    const result = transferFunds({
      fromAccount: { ...baseAccount, status: 'inactive' },
      toAccount: otherAccount,
      amount: 100,
      currency: 'USD',
    });
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left.type).toBe('InactiveAccount');
    }
  });

  it('should fail if toAccount is inactive', () => {
    const result = transferFunds({
      fromAccount: baseAccount,
      toAccount: { ...otherAccount, status: 'inactive' },
      amount: 100,
      currency: 'USD',
    });
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left.type).toBe('InactiveAccount');
    }
  });

  it('should fail if amount is not positive', () => {
    const result = transferFunds({
      fromAccount: baseAccount,
      toAccount: otherAccount,
      amount: 0,
      currency: 'USD',
    });
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left.type).toBe('InvalidAmount');
    }
  });

  it('should fail if currency mismatches', () => {
    const result = transferFunds({
      fromAccount: { ...baseAccount, currency: 'USD' },
      toAccount: { ...otherAccount, currency: 'EUR' },
      amount: 100,
      currency: 'USD',
    });
    expect(result._tag).toBe('Left');
    if (result._tag === 'Left') {
      expect(result.left.type).toBe('CurrencyMismatch');
    }
  });
}); 