# 1. Bankly

> **AWP-Driven Project**  
> This project uses [Agentic Workflow Protocol](./awp.yml) as its single source of truth for all workflow, strategy, and progress tracking. The legacy PROJECT_STRATEGY.md has been fully replaced by the Agentic Workflow Protocol. This is a candidate for a new standard for collaborative, agentic, and transparent project management—machine- and human-readable, always in sync with code and docs.

**Version:** <!-- VERSION_PLACEHOLDER -->

Bankly is a self tech testing project, scaled up by strategic acceleration using a configured environment of multiple agents and MCP. The security layer ensures that using agents or MCP is not a security or GDPR risk: all sensitive data and operations remain within secure, controlled boundaries, with no external data exposure or unauthorized access. Agents and MCP operate only within the trusted environment, with strict access controls and auditability, so there is no risk of data leakage or non-compliance.

> **Note:** The security and GDPR guarantees described above apply when Bankly is deployed in a properly secured production environment. For local development or testing, always use mock or anonymized data and ensure your environment is configured to prevent unauthorized access or data leakage.

```mermaid
flowchart TD
    subgraph Trusted_Environment["Trusted Environment (Bankly Infrastructure)"]
        DB[("PostgreSQL / Data Store")]
        API["GraphQL API Layer"]
        Agents["Agents"]
        MCP["MCP (Multi-Component Platform)"]
        Security["Security Layer\n(Access Control, Audit, Validation)"]
        User["User/API Client"]
        
        User -->|"Secure Request"| API
        API -->|"Validated Ops"| Security
        Security -->|"Permitted Ops"| Agents
        Security -->|"Permitted Ops"| MCP
        Agents -->|"Domain Logic"| DB
        MCP -->|"Domain Logic"| DB
        Security -.->|"Audit Logs"| DB
    end
    
    External["External World"]
    External -.->|"No Data Exposure"| Trusted_Environment
    
    classDef trusted fill:#e0f7fa,stroke:#00796b,stroke-width:2px;
    class Trusted_Environment trusted;
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
    class External external;
```

Built with Node.js, TypeScript, and functional programming principles using fp-ts, Bankly supports secure money transfers between user accounts, tracks transaction history, and publishes domain events via Kafka — all wrapped with robust CI/CD pipelines and comprehensive documentation.

## 1.1 Summary
Bankly is a functional, event-driven banking backend built with modern TypeScript, designed to demonstrate senior software engineering capabilities — from architecture and validation to event processing and CI/CD automation.

It simulates real-world financial use cases and shows expertise in building scalable, reliable, and testable back-end systems — suitable for fintech companies, startups, and enterprise APIs.

---
For a detailed roadmap and workflow, see [awp.yml](./awp.yml).
The project follows a modular, scalable structure for maintainability and growth.

## 2. Key Features

| Area                | Feature                                                                 |
|---------------------|-------------------------------------------------------------------------|
| 💼 Banking Domain   | Transfer money, validate accounts, and track balances                   |
| ✅ Functional Core  | Built using fp-ts, io-ts, and TaskEither for pure, composable logic     |
| 📦 GraphQL API      | Exposes typed operations with runtime validation                        |
| 🛢️ PostgreSQL + Prisma | ACID-safe persistence layer for accounts and transactions           |
| 📣 Kafka Events     | Emits MoneyTransferred events for external systems (logging, auditing, notifications) |
| 🔬 Testing Suite    | Includes unit tests, integration tests, and type-safe mocks             |
| ⚙️ CI/CD            | GitHub Actions pipeline with linting, tests, and build checks           |
| 📚 Documentation    | Full API schema, architectural overview, and event contracts            |
| 🛡️ Security Focus   | Immutable domain objects, strict type validation, no unsafe casting     |

## 5. Using the GraphQL API: Creating Accounts and Transferring Money

You can interact with Bankly's API using the built-in GraphQL Playground at [http://localhost:4000/](http://localhost:4000/).

### 5.1 Create Accounts
Use the following mutation to create an account:

```graphql
mutation {
  createAccount(ownerName: "Alice", balance: 1000, currency: "USD", status: "active") {
    id
    ownerName
    balance
    currency
    status
  }
}
```
Repeat for a second account (e.g., "Bob").

### 5.2 Get Account IDs
- The mutation response will include the new account's `id`.
- You can also view all accounts and their IDs using Prisma Studio:
  ```sh
  yarn prisma studio
  ```

### 5.3 Transfer Money
Use the real account IDs in the following mutation:

```graphql
mutation {
  transferMoney(
    fromAccountId: "REAL_ID_1"
    toAccountId: "REAL_ID_2"
    amount: 100
    currency: "USD"
  ) {
    transaction {
      id
      fromAccountId
      toAccountId
      amount
      currency
      createdAt
      status
      type
    }
    error
  }
}
```

### 5.4 Error Handling
- If you use invalid IDs, insufficient balance, or mismatched currencies, the API will return a helpful error message.

### 5.5 Health Check
Test the server with:
```graphql
query {
  _health
}
```

---

For more advanced usage, see the rest of this README and the schema in `src/index.ts`.

## 3. Technologies Used
- **Language:** Node.js + TypeScript
- **Functional Tools:** fp-ts, io-ts, zod
- **Database:** PostgreSQL (via Prisma ORM)
- **API Layer:** Apollo GraphQL Server
- **Messaging:** KafkaJS
- **CI/CD:** GitHub Actions + Docker
- **Testing:** Jest, Supertest, Fast-check
- **Architecture:** Hexagonal (Ports & Adapters), Domain-Driven Design

---

## 4. Architecture & Design Decisions

This project is a self technical test, designed to showcase my approach to building robust, maintainable, and scalable backend systems. Below, I explain the key architectural and design decisions:

### 4.1 Domain-Driven Design (DDD) & Hexagonal Architecture
- **Why:** DDD ensures the business logic is at the core, with clear boundaries and ubiquitous language. Hexagonal (Ports & Adapters) architecture decouples the domain from infrastructure, making the system testable and adaptable to change.
- **How:** All business rules are implemented in the domain layer, with adapters for persistence (PostgreSQL/Prisma), messaging (Kafka), and API (GraphQL).

### 4.2 Functional Programming with fp-ts
- **Why:** Functional programming (FP) brings composability, type safety, and predictability. fp-ts and io-ts enable pure business logic, error handling with TaskEither, and runtime validation.
- **How:** All core logic is written using fp-ts constructs, with no unsafe casting or mutation. Domain objects are immutable.

### 4.3 Type Safety & Validation
- **Why:** Financial systems require strong guarantees. TypeScript, io-ts, and zod provide both compile-time and runtime validation.
- **How:** All API inputs/outputs and domain events are validated at runtime, and types are enforced throughout the stack.

### 4.4 Event-Driven Design with Kafka
- **Why:** Event streaming enables real-time integrations, auditability, and decoupling of services.
- **How:** Money transfer operations emit `MoneyTransferred` events to Kafka, which can be consumed by external systems for logging, notifications, or analytics.

### 4.5 Testing & CI/CD
- **Why:** Reliability and confidence in changes are critical. Automated tests and pipelines catch issues early.
- **How:** The project includes unit tests, integration tests, and property-based tests (Fast-check). GitHub Actions run linting, tests, and build checks on every push.

### 4.6 Security
- **Why:** Banking systems must be secure by default.
- **How:** All domain objects are immutable, validation is strict, and no unsafe type assertions are used. Sensitive operations are protected by design.

### 4.7 Domain Model & Core Logic

#### Account
- **id**: Unique identifier (UUID or string)
- **ownerName**: Name of the account holder
- **balance**: Numeric value (integer, e.g., cents)
- **currency**: (optional, for multi-currency)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp
- **status**: (optional, e.g., active, frozen, closed)

#### Transaction
- **id**: Unique identifier (UUID or string)
- **fromAccountId**: Reference to source account
- **toAccountId**: Reference to destination account
- **amount**: Numeric value (positive, in smallest currency unit)
- **currency**: (optional, for multi-currency)
- **createdAt**: Timestamp
- **status**: (pending, completed, failed, reversed)
- **type**: (transfer, deposit, withdrawal, etc.)
- **reference**: (optional, for external systems or audit)

#### transferFunds Logic
- **Inputs**: fromAccount, toAccount, amount
- **Validations**:
  - Both accounts exist and are active
  - Sufficient balance in fromAccount
  - Amount is positive and non-zero
  - (Optional) Currency matches
- **Effects**:
  - Debit fromAccount, credit toAccount
  - Create a Transaction record
  - Emit MoneyTransferred event
- **Error Handling**: Use fp-ts `Either` or `TaskEither` for functional error management

**All domain logic is pure and side-effect free. Side effects (DB, Kafka) are handled in adapters. Runtime validation is performed with io-ts or zod.**

#### Entity-Relationship Diagram

```mermaid
erDiagram
    Account {
      string id PK
      string ownerName
      int balance
      string currency
      datetime createdAt
      datetime updatedAt
      string status
    }
    Transaction {
      string id PK
      string fromAccountId FK
      string toAccountId FK
      int amount
      string currency
      datetime createdAt
      string status
      string type
      string reference
    }
    Account ||--o{ Transaction : fromAccount
    Account ||--o{ Transaction : toAccount
```

#### Prisma Schema (see prisma/schema.prisma)

```prisma
model Account {
  id         String        @id @default(uuid())
  ownerName  String
  balance    Int
  currency   String?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
  status     String?
  sentTransactions     Transaction[] @relation("FromAccount")
  receivedTransactions Transaction[] @relation("ToAccount")
}

model Transaction {
  id            String   @id @default(uuid())
  fromAccount   Account  @relation("FromAccount", fields: [fromAccountId], references: [id])
  fromAccountId String
  toAccount     Account  @relation("ToAccount", fields: [toAccountId], references: [id])
  toAccountId   String
  amount        Int
  currency      String?
  createdAt     DateTime @default(now())
  status        String
  type          String
  reference     String?
}
```

### 4.8 Persistence Adapters
- **Why:** To ensure all database updates (such as money transfers) are atomic, ACID-compliant, and separated from business logic.
- **How:** All persistence operations are performed through adapters using Prisma transactions. This keeps the domain logic pure and side-effect free.
- **Where:** See `src/adapters/accountPersistence.ts` for the implementation of transaction-safe fund transfers.

---

## 5. Getting Started

### 5.1 Dependencies
Run the following to install all required dependencies (already listed in package.json):

```sh
yarn install
```

### 5.2 Project Structure
- Source code lives in the `src/` directory.
- The entry point is `src/index.ts`.
- Tests are placed in the `tests/` directory.
- Configuration files (non-env) go in the `config/` directory.

### 5.3 TypeScript Build
To compile the project:

```sh
yarn tsc
```

This will output compiled files to the `dist/` directory.

### 5.1 Local Testing User Story

As a developer, you can test the full flow locally as follows:

1. **Install all dependencies**
   ```sh
   yarn install
   ```
2. **Start required services (PostgreSQL, Kafka, Zookeeper)**
   ```sh
   docker compose up -d
   ```
3. **Run database migrations**
   ```sh
   yarn prisma:migrate
   ```
4. **Start the API server**
   ```sh
   yarn dev
   ```
   - The server will be available at [http://localhost:4000/](http://localhost:4000/).
5. **Start the Kafka consumer (in a separate terminal)**
   ```sh
   yarn ts-node scripts/start-consumer.ts
   ```
6. **Create two accounts using the GraphQL Playground**
   - Go to [http://localhost:4000/](http://localhost:4000/)
   - Run:
     ```graphql
     mutation {
       createAccount(ownerName: "Alice", balance: 1000, currency: "USD", status: "active") { id }
     }
     ```
     and
     ```graphql
     mutation {
       createAccount(ownerName: "Bob", balance: 1000, currency: "USD", status: "active") { id }
     }
     ```
   - Copy the returned `id` values.
7. **Transfer money between accounts**
   - Use the real IDs:
     ```graphql
     mutation {
       transferMoney(
         fromAccountId: "ID_OF_ALICE"
         toAccountId: "ID_OF_BOB"
         amount: 100
         currency: "USD"
       ) {
         transaction { id amount }
         error
       }
     }
     ```
8. **See the event in the consumer terminal**
   - You should see:
     ```
     [Kafka] Received event on topic money-transferred:
     {"fromAccountId":"...","toAccountId":"...","amount":100,...}
     ```

### Local Testing Flow Diagram

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant Terminal as Terminal
  participant Docker as Docker Compose
  participant API as GraphQL API
  participant DB as PostgreSQL
  participant Kafka as Kafka
  participant Consumer as Kafka Consumer

  Dev->>Terminal: yarn install
  Dev->>Docker: docker compose up -d
  Dev->>Terminal: yarn prisma:migrate
  Dev->>API: yarn dev
  Dev->>Consumer: yarn ts-node scripts/start-consumer.ts
  Dev->>API: createAccount (GraphQL Playground)
  API->>DB: Insert Account
  Dev->>API: createAccount (GraphQL Playground)
  API->>DB: Insert Account
  Dev->>API: transferMoney (GraphQL Playground)
  API->>DB: Update balances, insert Transaction
  API->>Kafka: Emit MoneyTransferred event
  Kafka->>Consumer: Deliver event
  Consumer->>Dev: Log event in terminal
```

---

## 6. Documentation
- Full API schema, event contracts, and architectural diagrams will be provided as the project evolves.

---

## 7. Contributing
This project is a technical showcase and not open for external contributions at this time.

---

## 8. License
MIT

---

## 9. Commit Message Standard

This project uses the **Conventional Commits** standard for all commit messages. This enables automated changelogs, semantic releases, and a clear project history.

**Format:**
```
type(scope step): subject
```
- `type`: chore, feat, fix, docs, refactor, test, ci, build, etc.
- `scope`: (optional) area of codebase affected
- `step`: (required) the step from PROJECT_STRATEGY.md (e.g., 1.4.2)
- `subject`: short, imperative description

**Examples:**
- `feat(api 4.2): add money transfer mutation`
- `fix(domain 2.2): correct balance calculation`
- `chore(setup 1.4.2): add ESLint and Prettier config`
- `docs(readme 9.1): add architecture diagram`

**Rules:**
- Reference the step being followed in PROJECT_STRATEGY.md in every commit.
- Use lower case and imperative mood for the subject.
- Keep messages concise and descriptive.

**Why?**
- Enables automated changelogs and semantic releases
- Makes git history easier to read and search
- Encourages clear, consistent communication
- Ensures traceability to project strategy steps

For more details, see [Conventional Commits](https://www.conventionalcommits.org/).

## 6. Kafka Integration: Emitting and Consuming Events

Bankly emits a `MoneyTransferred` event to Kafka after every successful money transfer. This enables event-driven integrations, audit logging, and more.

### 6.1 Running Kafka Locally
Kafka and Zookeeper are provided via Docker Compose:

```sh
docker compose up -d
```

### 6.2 Event Emission
After a successful `transferMoney` mutation, an event is published to the `money-transferred` topic. The event payload includes:
- `fromAccountId`
- `toAccountId`
- `amount`
- `currency`
- `transactionId`
- `timestamp`

### 6.3 Consuming Events
A simple Kafka consumer is provided to log these events:

```sh
yarn ts-node scripts/start-consumer.ts
```

You should see output like:
```
[Kafka] Received event on topic money-transferred:
{"fromAccountId":"...","toAccountId":"...","amount":100,...}
```

### 6.4 Testing the Integration
1. Start your app (`yarn dev`).
2. Start the consumer as above.
3. Perform a `transferMoney` mutation via GraphQL Playground.
4. Watch the consumer terminal for the event log.

---

## 7. System Architecture Diagram

```mermaid
flowchart TD
  subgraph API["GraphQL API (Apollo Server)"]
    A1["User/Client"]
    A2["createAccount / transferMoney mutation"]
  end
  subgraph DB["PostgreSQL Database"]
    D1["Account Table"]
    D2["Transaction Table"]
  end
  subgraph Kafka["Kafka Cluster"]
    K1["money-transferred topic"]
  end
  subgraph Consumer["Kafka Consumer"]
    C1["Audit Logger / Event Processor"]
  end

  A1 -->|GraphQL Mutation| A2
  A2 -->|DB Read/Write| D1
  A2 -->|DB Read/Write| D2
  A2 -- Event: MoneyTransferred --> K1
  K1 -- Event --> C1

  style API fill:#e0f7fa,stroke:#00796b,stroke-width:2px
  style DB fill:#fffde7,stroke:#fbc02d,stroke-width:2px
  style Kafka fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px
  style Consumer fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
```

This diagram shows how users interact with the API, how the API reads/writes to the database, emits events to Kafka, and how consumers process those events for further use (e.g., audit logging).

---

## 📝 Audit Logger Kafka Consumer (AWP Step 6.1–6.3)

This service consumes `money-transferred` events from Kafka and logs them for audit purposes. It is designed to be production-ready, with validation, structured logging, database persistence, and a health check endpoint.

### 📦 Features
- Consumes events from Kafka (`money-transferred` topic)
- Validates event structure (using zod)
- Logs events to `audit.log` (file) and console (using winston)
- **Persists audit events to the database** (PostgreSQL, Prisma)
- Health check endpoint at `/health` (port 4001)
- Graceful shutdown on SIGINT/SIGTERM
- Configurable via environment variables

### ⚙️ Configuration
Copy `.env.example` to `.env` and set the following:
```
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC=money-transferred
KAFKA_GROUP_ID=audit-logger-group
```

### 🚀 Running the Consumer
```
npx ts-node scripts/start-consumer.ts
```

### 🧪 Testing
1. Start the main app and the audit logger consumer.
2. Trigger a money transfer in the main app.
3. Check the console, `audit.log`, and the `AuditEvent` table in the database for the event.

### 📂 Log File
- All audit events are appended to `audit.log` in the project root.
- To rotate or persist logs elsewhere, adjust `src/audit-consumer/auditLogger.ts`.

### 🗄️ Database Persistence
- Events are stored in the `AuditEvent` table (see `prisma/schema.prisma`).
- To query audit events, use Prisma or direct SQL.

### 🩺 Health Check
- The consumer exposes a health check endpoint at `http://localhost:4001/health`.
- Returns `{ "status": "ok" }` if running.

### 🛠️ Extending
- For metrics or advanced health checks, extend `src/audit-consumer/health.ts`.

---

## 🧪 Automated End-to-End Testing (AWP Step 8.2)

A production-ready script (`scripts/test-audit-logger-e2e.ts`) verifies the full event flow, DB persistence, and health check for the Audit Logger microservice. This test is CI/CD-friendly and aligns with AWP step 8.2 (integration tests for GraphQL + DB + Kafka).

### How it works
- Sends a test event to Kafka
- Waits and retries for event propagation
- Checks the health endpoint
- Verifies the event in the `AuditEvent` table
- Checks `audit.log` for the event
- Optionally cleans up test data
- Exits 0 on success, 1 on failure (for CI)

### Usage
```sh
npx ts-node scripts/test-audit-logger-e2e.ts
```

### Configuration (via `.env` or CI env)
- `KAFKA_BROKER`, `KAFKA_TOPIC`, `DATABASE_URL` (required)
- `TEST_WAIT_TIME` (ms, default 3000)
- `TEST_RETRIES` (default 5)
- `TEST_CLEANUP` (`true` to delete test event from DB)
- `HEALTH_URL` (default `http://localhost:4001/health`)
- `TEST_FROM_ACCOUNT`, `TEST_TO_ACCOUNT`, `TEST_AMOUNT` (optional test event values)

### Example for CI/CD
Add as a step in your pipeline. The build will fail if the audit logger is not working end-to-end.

### AWP Alignment
- **Step 8.2:** This script fulfills the requirement for integration tests covering event-driven flows.
- **Traceability:** Test events are clearly marked and can be cleaned up automatically.
- **Documentation:** This section and the script are referenced in your AWP workflow and README.

---

## 🚀 Audit Logger Microservice: Production-Ready Features

- **Dockerfile**: Provided for containerized deployment (see `src/audit-consumer/Dockerfile`).
- **Prometheus metrics**: Exposed at `/metrics` on port 4002 (event and error counters).
- **Health check**: `/health` on port 4001.
- **CI/CD**: Automated via GitHub Actions (`.github/workflows/ci.yml`).
- **Automated e2e test**: See [Automated End-to-End Testing (AWP Step 8.2)](#-automated-end-to-end-testing-awp-step-82).
- **AWP alignment**: Steps 6, 7, and 8.2 are fully covered.

### Metrics Example
- `audit_events_total`: Number of audit events processed
- `audit_errors_total`: Number of errors encountered

### Docker Usage
```sh
docker build -t audit-logger ./src/audit-consumer
# Set env vars for Kafka, DB, etc.
docker run -p 4001:4001 -p 4002:4002 --env-file .env audit-logger
```

### CI/CD
- On every push/PR, the workflow lints, type-checks, tests, runs the e2e test, and builds the project.
- Fails the build if any check fails.

---

## 🧑‍💻 Onboarding Guide

1. Clone the repo and install dependencies (`npm install`)
2. Copy `.env.example` to `.env` and configure Kafka, DB, etc.
3. Start PostgreSQL and Kafka (see Docker Compose in `awp.yml`)
4. Run the main app and the audit logger consumer (`npx ts-node scripts/start-consumer.ts`)
5. Use the e2e test script to verify everything works
6. For metrics, visit `http://localhost:4002/metrics`
7. For health, visit `http://localhost:4001/health`

---

## 🗺️ Architecture Diagram

```mermaid
flowchart TD
    User["User/API Client"] -->|GraphQL| API["Main App (GraphQL API)"]
    API -->|DB| DB[(PostgreSQL)]
    API -->|Kafka Event| Kafka[(Kafka)]
    Kafka -->|money-transferred| AuditLogger["Audit Logger (Consumer)"]
    AuditLogger -->|/health| Health["Health Endpoint (4001)"]
    AuditLogger -->|/metrics| Metrics["Prometheus Metrics (4002)"]
    AuditLogger -->|DB| AuditDB[(PostgreSQL: AuditEvent)]
    AuditLogger -->|File| LogFile["audit.log"]
```

---

## 📈 Dashboards & Alerting (Next Steps)
- Integrate with Prometheus/Grafana for dashboards
- Add Slack/email/webhook alerting for failures (see AWP optional enhancements)

---

## 🔖 Release Automation (AWP Step 7.4)

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning, changelogs, and GitHub releases.

- Releases are triggered on every push to `main` with a Conventional Commit message.
- Changelog is generated and published automatically.
- See `.releaserc.json` for configuration.

To run locally (dry run):
```sh
npx semantic-release --dry-run
```

## Automated Release Management

This project uses **semantic-release** for fully automated, production-grade release management:

- **Versioning**: Follows semantic versioning, automatically bumps version based on commit messages.
- **Changelog**: Updates `CHANGELOG.md` with each release.
- **GitHub Releases**: Publishes release notes and tags to GitHub.
- **No manual version bumps or changelog edits required.**

### How it works
- On every merge to `main`, the CI pipeline runs `npm run release` (or `yarn release`).
- If there are new commits since the last release, a new version is published, changelog is updated, and a GitHub release is created.
- No NPM publish is performed (this is a backend service).

### Local Release (for testing)
```sh
npm run release
# or
yarn release
```

### Commit Message Format
Semantic-release uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
- Example: `feat(api 4.2): add money transfer mutation`
- See `awp.yml` for commit standards.

### CI/CD Integration
- The release step is included in the GitHub Actions workflow for `main` branch.
- Ensure your repo has a `GH_TOKEN` secret for GitHub releases.

---
