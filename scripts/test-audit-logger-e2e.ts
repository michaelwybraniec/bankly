// Automated E2E test for Audit Logger (AWP Step 8.2)
// This script verifies end-to-end event flow, DB persistence, and health check.
// Exits 0 on success, 1 on failure. Configurable via env. Safe for CI/CD.

import { Kafka } from 'kafkajs';
import { Client } from 'pg';
import axios from 'axios';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const TEST_EVENT = {
  fromAccountId: process.env.TEST_FROM_ACCOUNT || 'test-from-account-e2e',
  toAccountId: process.env.TEST_TO_ACCOUNT || 'test-to-account-e2e',
  amount: Number(process.env.TEST_AMOUNT) || 456,
  transactionId: 'awp-e2e-' + Date.now(), // Mark as automated test
  timestamp: new Date().toISOString(),
};

const WAIT_TIME = Number(process.env.TEST_WAIT_TIME) || 3000;
const RETRIES = Number(process.env.TEST_RETRIES) || 5;
const CLEANUP = process.env.TEST_CLEANUP === 'true';
const HEALTH_URL = process.env.HEALTH_URL || 'http://localhost:4001/health';

async function sendTestEvent() {
  const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    clientId: 'test-producer-e2e',
  });
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: process.env.KAFKA_TOPIC || 'money-transferred',
    messages: [{ value: JSON.stringify(TEST_EVENT) }],
  });
  await producer.disconnect();
  console.log('✅ Test event sent to Kafka:', TEST_EVENT.transactionId);
}

async function retry(fn: () => Promise<boolean>, name: string) {
  for (let i = 0; i < RETRIES; i++) {
    if (await fn()) return true;
    if (i < RETRIES - 1) {
      console.log(`Retrying ${name} in ${WAIT_TIME}ms...`);
      await new Promise((r) => setTimeout(r, WAIT_TIME));
    }
  }
  return false;
}

async function checkHealth() {
  try {
    const res = await axios.get(HEALTH_URL);
    if (res.data.status === 'ok') {
      console.log('✅ Health check passed');
      return true;
    }
  } catch (err: any) {
    console.error('❌ Health check failed:', err.message);
  }
  return false;
}

async function checkDatabase() {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const { rows } = await client.query(
      `SELECT * FROM "AuditEvent" WHERE "transactionId" = $1 ORDER BY "createdAt" DESC LIMIT 1`,
      [TEST_EVENT.transactionId]
    );
    await client.end();
    if (rows.length > 0) {
      console.log('✅ Event found in AuditEvent table:', rows[0]);
      return true;
    } else {
      console.error('❌ Event NOT found in AuditEvent table');
      return false;
    }
  } catch (err: any) {
    console.error('❌ DB check failed:', err.message);
    return false;
  }
}

async function checkLogFile() {
  try {
    const log = await fs.readFile('audit.log', 'utf8');
    if (log.includes(TEST_EVENT.transactionId)) {
      console.log('✅ Event found in audit.log');
      return true;
    } else {
      console.error('❌ Event NOT found in audit.log');
      return false;
    }
  } catch (err: any) {
    console.error('❌ Could not read audit.log:', err.message);
    return false;
  }
}

async function cleanupDatabase() {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(
      `DELETE FROM "AuditEvent" WHERE "transactionId" = $1`,
      [TEST_EVENT.transactionId]
    );
    await client.end();
    console.log('🧹 Cleaned up test event from DB');
  } catch (err: any) {
    console.error('⚠️ Cleanup failed:', err.message);
  }
}

async function main() {
  console.log('---\nAWP Step 8.2: Automated E2E Test for Audit Logger\n---');
  let success = true;
  try {
    await sendTestEvent();
    await new Promise((r) => setTimeout(r, WAIT_TIME));
    const health = await retry(checkHealth, 'health check');
    const db = await retry(checkDatabase, 'database check');
    const log = await retry(checkLogFile, 'log file check');
    success = health && db && log;
    if (success) {
      console.log('\n🎉 All checks passed! Audit logger is working end-to-end.');
    } else {
      console.log('\n❌ Some checks failed. See above for details.');
    }
  } catch (err: any) {
    console.error('❌ Fatal error:', err);
    success = false;
  }
  if (CLEANUP) {
    await cleanupDatabase();
  }
  process.exit(success ? 0 : 1);
}

main(); 