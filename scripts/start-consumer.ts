import { startConsumer } from '../src/adapters/kafkaConsumer';
import '../src/audit-consumer/index';
import '../src/audit-consumer/health';
import '../src/audit-consumer/metrics';

startConsumer().catch((err) => {
  console.error('Kafka consumer error:', err);
  process.exit(1);
}); 