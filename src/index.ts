import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { pipe } from 'fp-ts/function';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';
import { transferFunds } from './domain/transferFunds';
import { transferFundsPrisma } from './adapters/accountPersistence';
import { PrismaClient } from '@prisma/client';
import { connectProducer, sendMoneyTransferredEvent } from './adapters/kafkaProducer';

const prisma = new PrismaClient();

// Minimal GraphQL schema for health check
const typeDefs = `#graphql
  type Account {
    id: ID!
    ownerName: String!
    balance: Int!
    currency: String
    createdAt: String!
    updatedAt: String!
    status: String
  }

  type Transaction {
    id: ID!
    fromAccountId: ID!
    toAccountId: ID!
    amount: Int!
    currency: String
    createdAt: String!
    status: String!
    type: String!
    reference: String
  }

  type TransferResult {
    transaction: Transaction
    error: String
  }

  type Query {
    _health: String!
  }

  type Mutation {
    transferMoney(fromAccountId: ID!, toAccountId: ID!, amount: Int!, currency: String): TransferResult!
    createAccount(ownerName: String!, balance: Int!, currency: String, status: String): Account!
  }
`;

const resolvers = {
  Query: {
    _health: () => 'OK',
  },
  Mutation: {
    transferMoney: async (_: any, { fromAccountId, toAccountId, amount, currency }: any) => {
      // Fetch accounts from DB
      const fromRaw = await prisma.account.findUnique({ where: { id: fromAccountId } });
      const toRaw = await prisma.account.findUnique({ where: { id: toAccountId } });
      if (!fromRaw || !toRaw) {
        return { transaction: null, error: 'Account not found' };
      }
      // Map null fields to undefined for domain compatibility
      const from = { ...fromRaw, currency: fromRaw.currency ?? undefined, status: fromRaw.status ?? undefined };
      const to = { ...toRaw, currency: toRaw.currency ?? undefined, status: toRaw.status ?? undefined };
      // Use domain logic for validation and business rules
      const domainResult = transferFunds({ fromAccount: from, toAccount: to, amount, currency });
      if (domainResult._tag === 'Left') {
        return { transaction: null, error: domainResult.left.message };
      }
      // Use persistence adapter for DB update
      try {
        const transaction = await transferFundsPrisma(fromAccountId, toAccountId, amount, currency);
        // Emit MoneyTransferred event to Kafka
        try {
          await sendMoneyTransferredEvent({
            fromAccountId,
            toAccountId,
            amount,
            currency,
            transactionId: transaction.id,
            timestamp: new Date().toISOString(),
          });
          console.log('[Kafka] MoneyTransferred event sent!');
        } catch (kafkaErr) {
          console.error('[Kafka] Failed to send MoneyTransferred event:', kafkaErr);
        }
        return { transaction, error: null };
      } catch (err: any) {
        return { transaction: null, error: err.message };
      }
    },
    createAccount: async (_: any, { ownerName, balance, currency, status }: any) => {
      const account = await prisma.account.create({
        data: {
          ownerName,
          balance,
          currency,
          status,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      // Map null fields to undefined for domain compatibility
      return { ...account, currency: account.currency ?? undefined, status: account.status ?? undefined };
    },
  },
};

async function main() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => ({ prisma }),
  });
  console.log(`🚀 Apollo Server ready at ${url}`);
  await connectProducer();
}

main().catch((err) => {
  console.error('Failed to start Apollo Server:', err);
  process.exit(1);
});
