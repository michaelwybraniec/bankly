import express from 'express';
import client from 'prom-client';

const app = express();
const port = process.env.METRICS_PORT ? parseInt(process.env.METRICS_PORT) : 4002;

const eventCounter = new client.Counter({
  name: 'audit_events_total',
  help: 'Total number of audit events processed',
});
const errorCounter = new client.Counter({
  name: 'audit_errors_total',
  help: 'Total number of errors in audit logger',
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`[AuditLogger] Prometheus metrics listening on port ${port}`);
});

export { eventCounter, errorCounter }; 