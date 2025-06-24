import { startConsumer, shutdownConsumer } from './consumer';

startConsumer().catch((err) => {
  console.error('Fatal error in consumer:', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await shutdownConsumer();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await shutdownConsumer();
  process.exit(0);
}); 