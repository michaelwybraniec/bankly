import { startConsumer } from '../src/adapters/kafkaConsumer';

startConsumer().catch((err) => {
  console.error('Kafka consumer error:', err);
  process.exit(1);
}); 