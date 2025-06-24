// Make sure to install winston and @types/winston: npm install winston && npm install -D @types/winston
import { MoneyTransferred } from './types';
import winston from 'winston';
import { PrismaClient } from '@prisma/client';
import { eventCounter, errorCounter } from './metrics';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'audit.log', maxsize: 10485760, maxFiles: 5 }),
    new winston.transports.Console(),
  ],
});

const prisma = new PrismaClient();

export async function logAuditEvent(event: MoneyTransferred) {
  logger.info({ event, timestamp: new Date().toISOString() });
  try {
    await prisma.auditEvent.create({
      data: {
        fromAccountId: event.fromAccountId,
        toAccountId: event.toAccountId,
        amount: event.amount,
        transactionId: event.transactionId,
        timestamp: event.timestamp,
        raw: event,
      },
    });
    eventCounter.inc();
  } catch (err) {
    logger.error({ msg: 'Failed to persist audit event to DB', error: err, event });
    errorCounter.inc();
  }
} 