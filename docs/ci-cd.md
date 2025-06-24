# CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment, and Docker for containerization.

## Workflow Overview
- **Lint:** Ensures code style and quality
- **Type-check:** Validates TypeScript types
- **Unit & Integration Tests:** Runs all Jest tests
- **End-to-End Test:** Runs the audit logger e2e test
- **Build:** Compiles the project for production

## GitHub Actions Workflow
See `.github/workflows/ci.yml`:

```yaml
- name: Lint
  run: npm run lint --if-present
- name: Type check
  run: npm run typecheck --if-present
- name: Unit & Integration Tests
  run: npm test --if-present
- name: End-to-End Audit Logger Test
  run: npx ts-node scripts/test-audit-logger-e2e.ts
- name: Build
  run: npm run build
```

## Dockerfile
- Located at `src/audit-consumer/Dockerfile`
- Builds a production-ready image for the audit logger microservice

## Deployment
- Build and run with Docker:
  ```sh
  docker build -t audit-logger ./src/audit-consumer
  docker run -p 4001:4001 -p 4002:4002 --env-file .env audit-logger
  ```
- Configure environment variables for Kafka, DB, etc.

## AWP Alignment
- **Step 7:** CI/CD pipeline, containerization, and deployment
