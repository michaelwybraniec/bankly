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
```

## Slack/Email Integration
- Use Prometheus Alertmanager to route alerts to Slack/email/webhook.
- See [Prometheus Alertmanager docs](https://prometheus.io/docs/alerting/latest/alertmanager/) for setup.

## AWP Alignment
- **Step 10.5:** Dashboards and alerting for production readiness

# Dashboards & Alerting (Prometheus, Grafana, Alertmanager)

## Prometheus Alert Rules Example

Create a file `prometheus/alert.rules.yml`:

```yaml
groups:
  - name: bankly-alerts
    rules:
      - alert: HighGraphQLRequestRate
        expr: increase(graphql_requests_total[1m]) > 100
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "High GraphQL request rate (>100/min)"

      - alert: HighGraphQLErrorRate
        expr: increase(graphql_errors_total[5m]) > 10
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High GraphQL error rate (>10/5min)"

      - alert: AuditLoggerErrors
        expr: increase(audit_errors_total[5m]) > 0
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Audit logger errors detected"
```

## Example Grafana Dashboard Panels (JSON)

Import this JSON into Grafana for a quick dashboard:

```json
{
  "panels": [
    {
      "type": "graph",
      "title": "GraphQL Requests",
      "targets": [{"expr": "sum(rate(graphql_requests_total[1m]))"}]
    },
    {
      "type": "graph",
      "title": "GraphQL Errors",
      "targets": [{"expr": "sum(rate(graphql_errors_total[1m]))"}]
    },
    {
      "type": "graph",
      "title": "Audit Logger Errors",
      "targets": [{"expr": "sum(rate(audit_errors_total[1m]))"}]
    },
    {
      "type": "heatmap",
      "title": "GraphQL Response Time",
      "targets": [{"expr": "histogram_quantile(0.95, sum(rate(graphql_response_time_seconds_bucket[5m])) by (le))"}]
    }
  ]
}
```

## Alertmanager Slack Integration Example

Add to your `alertmanager.yml`:

```yaml
receivers:
  - name: 'slack-notifications'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#alerts'
        send_resolved: true
route:
  receiver: 'slack-notifications'
```

## Alertmanager Email Integration Example

```yaml
receivers:
  - name: 'email-notifications'
    email_configs:
      - to: 'your-team@example.com'
        from: 'alertmanager@example.com'
        smarthost: 'smtp.example.com:587'
        auth_username: 'alertmanager@example.com'
        auth_password: 'yourpassword'
        send_resolved: true
route:
  receiver: 'email-notifications'
```

## Setup Instructions

1. **Prometheus:**
   - Add `alert.rules.yml` to your Prometheus config and reference it in `prometheus.yml`:
     ```yaml
     rule_files:
       - "alert.rules.yml"
     ```
2. **Grafana:**
   - Import the dashboard JSON above or create your own panels for the metrics.
3. **Alertmanager:**
   - Configure Slack/email as shown above and link Alertmanager to Prometheus.
4. **Test:**
   - Trigger alerts by simulating errors or high request rates.

---

For more, see the [Prometheus docs](https://prometheus.io/docs/alerting/latest/alertmanager/), [Grafana docs](https://grafana.com/docs/), and [Alertmanager config](https://prometheus.io/docs/alerting/latest/configuration/).
