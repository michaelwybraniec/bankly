# Makefile for common dev tasks (AWP-aligned)

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm test

e2e:
	npx ts-node scripts/test-audit-logger-e2e.ts

docs:
	@echo "See /docs/ for architecture, API, CI/CD, metrics, and AWP protocol."

build:
	npm run build

start-consumer:
	npx ts-node scripts/start-consumer.ts 