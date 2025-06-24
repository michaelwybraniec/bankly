import { Kafka } from 'kafkajs';

const brokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
const clientId = process.env.KAFKA_CLIENT_ID || 'bankly-consumer';

const kafka = new Kafka({ clientId, brokers });
const consumer = kafka.consumer({ groupId: 'bankly-group' });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_MONEY_TRANSFERRED || 'money-transferred', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`\n[Kafka] Received event on topic ${topic}:`);
      console.log(message.value?.toString());
    },
  });
} 