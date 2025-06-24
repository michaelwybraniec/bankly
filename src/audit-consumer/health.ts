import express from 'express';

const app = express();
const port = process.env.HEALTH_PORT ? parseInt(process.env.HEALTH_PORT) : 4001;

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`[AuditLogger] Health check listening on port ${port}`);
}); 