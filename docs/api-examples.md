# API Usage Examples

This document provides usage examples for the main API, event bus, and microservice endpoints.

## GraphQL API (Main App)

### Query: Get Health
```graphql
query {
  _health
}
```

### Mutation: Transfer Money
```graphql
mutation {
  transferMoney(fromAccountId: "a1", toAccountId: "a2", amount: 100, currency: "USD") {
    transaction {
      id
      fromAccountId
      toAccountId
      amount
      status
      createdAt
    }
    error
  }
}
```

### Mutation: Create Account
```graphql
mutation {
  createAccount(ownerName: "Alice", balance: 1000, currency: "USD", status: "active") {
    id
    ownerName
    balance
    currency
    status
    createdAt
    updatedAt
  }
}
```

## Kafka Event: money-transferred

```json
{
  "fromAccountId": "a1",
  "toAccountId": "a2",
  "amount": 100,
  "transactionId": "tx-123",
  "timestamp": "2025-06-24T22:05:20.436Z"
}
```

## Audit Logger Endpoints

### Health Check
```
GET http://localhost:4001/health
Response: { "status": "ok" }
```

### Prometheus Metrics
```
GET http://localhost:4002/metrics
Response: Prometheus metrics text format
```

## AWP Alignment
- **Step 4:** GraphQL API
- **Step 5:** Kafka event emission
- **Step 6:** Audit logger consumer
- **Step 8:** Testable API and event flows
