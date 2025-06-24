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

check:
	@echo "Checking main app health..."
	@curl -s http://localhost:4000/graphql -H 'Content-Type: application/json' -d '{"query":"{_health}"}' | jq
	@echo "\nChecking main app metrics..."
	@curl -s http://localhost:4000/metrics | head -20
	@echo "\nChecking audit logger health..."
	@curl -s http://localhost:4001/health | jq
	@echo "\nChecking audit logger metrics..."
	@curl -s http://localhost:4002/metrics | head -20
	@echo "\nTailing app.log... (Ctrl+C to stop)"
	tail -n 20 -f app.log
	@echo "\nTailing audit.log... (Ctrl+C to stop)"
	tail -n 20 -f audit.log 