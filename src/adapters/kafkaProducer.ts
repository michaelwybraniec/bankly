import { Kafka, Producer } from 'kafkajs';

const brokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
const clientId = process.env.KAFKA_CLIENT_ID || 'bankly-api';

const kafka = new Kafka({
  clientId,
  brokers,
  // For production, add SSL/SASL config here if needed
  // ssl: true,
  // sasl: { mechanism: 'plain', username: '...', password: '...' },
});

const producer: Producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
}

export async function sendMoneyTransferredEvent(event: object) {
  await producer.send({
    topic: process.env.KAFKA_TOPIC_MONEY_TRANSFERRED || 'money-transferred',
    messages: [{ value: JSON.stringify(event) }],
  });
}

export { producer }; 