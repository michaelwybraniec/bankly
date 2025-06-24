import { Kafka, logLevel } from 'kafkajs';
import { MoneyTransferredSchema } from './types';
import { logAuditEvent } from './auditLogger';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  logLevel: logLevel.INFO,
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'audit-logger-group' });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC || 'money-transferred', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const raw = message.value?.toString();
        if (!raw) throw new Error('Empty message');
        const parsed = JSON.parse(raw);
        const event = MoneyTransferredSchema.parse(parsed);
        await logAuditEvent(event);
      } catch (err) {
        // Log error, optionally send to dead-letter topic
        console.error('Failed to process event:', err);
      }
    },
  });
}

export async function shutdownConsumer() {
  await consumer.disconnect();
} 