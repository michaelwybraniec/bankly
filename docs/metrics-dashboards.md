# Metrics, Dashboards & Alerting

This project exposes Prometheus metrics and is ready for integration with Grafana dashboards and Prometheus Alertmanager.

## Prometheus Metrics
- **Endpoint:** `http://localhost:4002/metrics`
- **Metrics:**
  - `audit_events_total`: Number of audit events processed
  - `audit_errors_total`: Number of errors encountered

## Example Prometheus Scrape Config
```yaml
scrape_configs:
  - job_name: 'audit-logger'
    static_configs:
      - targets: ['host.docker.internal:4002']
```

## Example Grafana Panel (JSON)
```json
{
  "type": "stat",
  "title": "Audit Events Processed",
  "targets": [
    { "expr": "audit_events_total", "format": "time_series" }
  ]
}
```

## Example Alert Rule (Prometheus)
```yaml
groups:
- name: audit-logger-alerts
  rules:
  - alert: AuditLoggerErrors
    expr: increase(audit_errors_total[5m]) > 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Audit logger errors detected"
      description: "Errors have occurred in the audit logger in the last 5 minutes."
```

## Slack/Email Integration
- Use Prometheus Alertmanager to route alerts to Slack/email/webhook.
- See [Prometheus Alertmanager docs](https://prometheus.io/docs/alerting/latest/alertmanager/) for setup.

## AWP Alignment
- **Step 10.5:** Dashboards and alerting for production readiness
