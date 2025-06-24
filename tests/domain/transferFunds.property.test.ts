import { transferFunds } from '../../src/domain/transferFunds';
import { Account } from '../../src/domain/Account';
import fc from 'fast-check';

describe('transferFunds property-based tests (AWP Step 8.3)', () => {
  const baseAccount = (balance: number, status: string = 'active'): Account => ({
    id: 'a1',
    ownerName: 'Alice',
    balance,
    currency: 'USD',
    createdAt: new Date(),
    updatedAt: new Date(),
    status,
  });
  const otherAccount = (balance: number, status: string = 'active'): Account => ({
    id: 'a2',
    ownerName: 'Bob',
    balance,
    currency: 'USD',
    createdAt: new Date(),
    updatedAt: new Date(),
    status,
  });

  it('should preserve total balance on successful transfer', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 1000 }),
        (fromBal, toBal, amount) => {
          const from = baseAccount(fromBal);
          const to = otherAccount(toBal);
          if (fromBal >= amount) {
            const result = transferFunds({ fromAccount: from, toAccount: to, amount, currency: 'USD' });
            if (result._tag === 'Right') {
              const totalBefore = fromBal + toBal;
              const totalAfter = result.right.updatedFrom.balance + result.right.updatedTo.balance;
              expect(totalAfter).toBe(totalBefore);
            }
          }
        }
      )
    );
  });

  it('should never result in negative balances', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 1000 }),
        (fromBal, toBal, amount) => {
          const from = baseAccount(fromBal);
          const to = otherAccount(toBal);
          const result = transferFunds({ fromAccount: from, toAccount: to, amount, currency: 'USD' });
          if (result._tag === 'Right') {
            expect(result.right.updatedFrom.balance).toBeGreaterThanOrEqual(0);
            expect(result.right.updatedTo.balance).toBeGreaterThanOrEqual(0);
          }
        }
      )
    );
  });

  it('should only succeed for active accounts', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 1000 }),
        fc.constantFrom('active', 'inactive', 'suspended'),
        fc.constantFrom('active', 'inactive', 'suspended'),
        (fromBal, toBal, amount, fromStatus, toStatus) => {
          const from = baseAccount(fromBal, fromStatus);
          const to = otherAccount(toBal, toStatus);
          const result = transferFunds({ fromAccount: from, toAccount: to, amount, currency: 'USD' });
          if (result._tag === 'Right') {
            expect(fromStatus).toBe('active');
            expect(toStatus).toBe('active');
          }
        }
      )
    );
  });
}); 