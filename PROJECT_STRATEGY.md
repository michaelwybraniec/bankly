# Project Strategy: Bankly Backend

> The Visual Roadmap below provides a high-level, color-coded overview of the project phases. The Steps & Checklist section contains detailed, actionable items for tracking progress.

## 🗺️ Visual Roadmap

🟢 **Step 1: Setup & Tooling**
- Initialize project with TypeScript, ESLint, Prettier, and Prisma
- Install all dependencies
- Create folder structure and config files

🟠 **Step 2: Domain Logic**
- Model Account and Transaction types
- Implement pure, functional logic for transferFunds using fp-ts
- Add runtime validation (io-ts or zod)

🔵 **Step 3: Database (PostgreSQL + Prisma)**
- Define schema: accounts and transactions
- Setup Prisma migrations
- Create persistence adapters with transaction-safe updates

🟣 **Step 4: GraphQL API**
- Setup Apollo Server
- Add mutation: transferMoney(from, to, amount)
- Use functional resolver pipelines (TaskEither, pipe)

🟤 **Step 5: Kafka Integration**
- Setup Kafka producer with KafkaJS
- Emit MoneyTransferred event after successful transfers

🟡 **Step 6: Consumer Service (Audit Logger)**
- Build a separate Kafka consumer
- Log or process incoming events
- Demonstrate microservice readiness

🟧 **Step 7: CI/CD Pipeline**
- Configure GitHub Actions
- Steps: install, lint, test, build
- Auto-run on push & PR

🔴 **Step 8: Testing**
- Unit test domain logic
- Integration test GraphQL + DB + Kafka
- Use mocks and property-based tests optionally

🟩 **Step 9: Documentation**
- Write README.md (overview, setup, usage)
- Create /docs/ for:
  - Architecture
  - GraphQL schema
  - Kafka event schema
  - CI/CD pipeline

⚪ **Step 10: Optional Enhancements**
- Docker Compose (DB + Kafka)
- Auth (JWT or API keys)
- Monitoring/logging
- REST bridge (optional)

✅ **Final Outcome**
A fully-tested, documented, event-driven banking backend, showcasing senior-level skills in architecture, functional programming, CI/CD, and clean API design.

---

## 🎯 Goal
Initialize and develop a production-grade, functional banking backend with best practices, automation, and clear documentation.

---

## 🗂️ Steps & Checklist

1. 🟢 **Setup & Tooling**
   - [x] 1.1 Initialize project with `yarn init -y`
   - [x] 1.2 Add `.gitignore` and `README.md`
   - [x] 1.3 Install dependencies:
     - [x] 1.3.1 `fp-ts`, `io-ts`, `zod`, `graphql`, `@apollo/server`, `graphql-scalars`, `kafkajs`, `pg`, `prisma`, `dotenv`
     - [x] 1.3.2 Dev: `typescript`, `ts-node`, `jest`, `ts-jest`, `eslint`, `prettier`, `tsc-alias`
   - [ ] 1.4 Add and configure:
     - [ ] 1.4.1 `tsconfig.json` (strict mode, path aliases)
     - [ ] 1.4.2 `.eslintrc`, `.prettierrc`
     - [ ] 1.4.3 `.env`, `.env.example`
     - [ ] 1.4.4 Initialize Prisma: `npx prisma init`
     - [ ] 1.4.5 Initialize Jest: `npx ts-jest config:init`
   - [ ] 1.5 Create folder structure:
     - [ ] 1.5.1 `src/` (main code)
     - [ ] 1.5.2 `tests/` (unit/integration tests)
     - [ ] 1.5.3 `prisma/` (Prisma schema/migrations)
     - [ ] 1.5.4 `config/` (configuration files)

2. 🟠 **Domain Logic**
   - [ ] 2.1 Model `Account` and `Transaction` types
   - [ ] 2.2 Implement pure, functional logic for `transferFunds` using fp-ts
   - [ ] 2.3 Add runtime validation (io-ts or zod)

3. 🔵 **Database (PostgreSQL + Prisma)**
   - [ ] 3.1 Define Prisma schema for accounts and transactions
   - [ ] 3.2 Setup and run Prisma migrations
   - [ ] 3.3 Create persistence adapters with transaction-safe updates

4. 🟣 **GraphQL API**
   - [ ] 4.1 Setup Apollo Server
   - [ ] 4.2 Add mutation: `transferMoney(from, to, amount)`
   - [ ] 4.3 Use functional resolver pipelines (TaskEither, pipe)
   - [ ] 4.4 Expose GraphQL Playground for API exploration

5. 🟤 **Kafka Integration**
   - [ ] 5.1 Setup Kafka producer with KafkaJS
   - [ ] 5.2 Emit `MoneyTransferred` event after successful transfers

6. 🟡 **Consumer Service (Audit Logger)**
   - [ ] 6.1 Build a separate Kafka consumer
   - [ ] 6.2 Log or process incoming events
   - [ ] 6.3 Demonstrate microservice readiness

7. 🟧 **CI/CD Pipeline**
   - [ ] 7.1 Configure GitHub Actions workflow
   - [ ] 7.2 Add steps: install, lint, test, build
   - [ ] 7.3 Auto-run on push & PR
   - [ ] 7.4 (Optional) Add release automation (e.g., version update script, semantic release)
   - [ ] 7.5 Add Dockerfile and `.dockerignore` for containerization

8. 🔴 **Testing**
   - [ ] 8.1 Write unit tests for domain logic
   - [ ] 8.2 Write integration tests for GraphQL + DB + Kafka
   - [ ] 8.3 Use mocks and property-based tests (fast-check)

9. 🟩 **Documentation**
   - [ ] 9.1 Write/expand `README.md` (overview, setup, usage)
   - [ ] 9.2 Create `/docs/` for:
     - [ ] 9.2.1 Architecture
     - [ ] 9.2.2 GraphQL schema
     - [ ] 9.2.3 Kafka event schema
     - [ ] 9.2.4 CI/CD pipeline
     - [ ] 9.2.5 API usage examples

10. ⚪ **Optional Enhancements**
    - [ ] 10.1 Add Docker Compose for DB + Kafka
    - [ ] 10.2 Add authentication (JWT or API keys)
    - [ ] 10.3 Add monitoring/logging
    - [ ] 10.4 Add REST bridge (optional)

---

## 📌 Notes
- Follow Conventional Commits for all commit messages
- Update this file as the project progresses
- Check off each item as you complete it

---

## AWC - Agent Workflow Commands

- **update doc**: Review README.md and PROJECT_STRATEGY.md after each step. For README.md check if it needs update entirely or document new feature. For PROJECT_STRATEGY.md make sure everything is aligned with the context and steps checkboxes match the progress. Update as needed to reflect the current state and next actions.
- **commit**: Use the Conventional Commits standard for messages, then commit and push changes to the repository.

_This workflow ensures documentation and code always stay in sync, and project history remains clear and professional._

---

Happy building !