import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { pipe } from 'fp-ts/function';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';
import { transferFunds } from './domain/transferFunds';
import { transferFundsPrisma } from './adapters/accountPersistence';
import { PrismaClient } from '@prisma/client';
import { connectProducer, sendMoneyTransferredEvent } from './adapters/kafkaProducer';
import jwt from 'jsonwebtoken';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import winston from 'winston';
import client from 'prom-client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'demo_secret_123';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'app.log', maxsize: 10485760, maxFiles: 5 }),
    new winston.transports.Console(),
  ],
});

// Prometheus metrics setup
const requestCounter = new client.Counter({
  name: 'graphql_requests_total',
  help: 'Total number of GraphQL requests',
});
const errorCounter = new client.Counter({
  name: 'graphql_errors_total',
  help: 'Total number of GraphQL errors',
});
const responseTimeHistogram = new client.Histogram({
  name: 'graphql_response_time_seconds',
  help: 'GraphQL response time in seconds',
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
});

// Express middleware for JWT auth (demo)
function jwtAuthMiddleware(req: any, res: any, next: any) {
  if (process.env.NODE_ENV === 'test') return next();
  if (req.method === 'POST' && req.body && req.body.operationName !== '_health') {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    try {
      jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
      return next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
  next();
}

// Express middleware for logging requests
function logRequests(req: any, res: any, next: any) {
  logger.info({
    msg: 'GraphQL request',
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    timestamp: new Date().toISOString(),
  });
  next();
}

// Express middleware for Prometheus metrics
function metricsMiddleware(req: any, res: any, next: any) {
  const end = responseTimeHistogram.startTimer();
  res.on('finish', () => {
    requestCounter.inc();
    end();
  });
  next();
}

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
  await server.start();

  const app = express();
  app.use(express.json());
  app.use(metricsMiddleware);
  app.use(logRequests);
  app.use(jwtAuthMiddleware);
  app.use('/graphql', expressMiddleware(server, {
    context: async () => ({ prisma }),
  }));
  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });
  app.listen(4000, () => {
    logger.info('🚀 GraphQL API with JWT auth and Prometheus metrics ready at http://localhost:4000/');
    console.log('🚀 GraphQL API with JWT auth and Prometheus metrics ready at http://localhost:4000/');
  });
  await connectProducer();
}

main().catch((err) => {
  errorCounter.inc();
  logger.error({ msg: 'Failed to start Apollo Server', error: err });
  console.error('Failed to start Apollo Server:', err);
  process.exit(1);
});
