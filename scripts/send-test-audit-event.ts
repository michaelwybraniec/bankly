import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  clientId: 'test-producer',
});

const producer = kafka.producer();

async function sendTestEvent() {
  await producer.connect();
  const event = {
    fromAccountId: 'test-from-account',
    toAccountId: 'test-to-account',
    amount: 123,
    transactionId: 'test-tx-' + Date.now(),
    timestamp: new Date().toISOString(),
  };
  await producer.send({
    topic: process.env.KAFKA_TOPIC || 'money-transferred',
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log('Test money-transferred event sent:', event);
  await producer.disconnect();
}

sendTestEvent().catch((err) => {
  console.error('Failed to send test event:', err);
  process.exit(1);
}); 