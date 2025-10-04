# 📊 RabbitMQ Topology example with multipe exchanges and bindings

```mermaid
flowchart TD
    %% =========================
    %% Publisher Service
    %% =========================
    PubService([🟢 Service Event Producer])

    %% =========================
    %% Order Domain
    %% =========================
    OX([order-exchange<br/>topic])
    OQue[order.queue]

    OX -->|order.*| OQue

    %% =========================
    %% Critical Notifications
    %% =========================
    NQ[notifications.queue]

    %% =========================
    %% Critical bindings & fanout bindings
    %% =========================
    OX -->|order.failed| NQ
    PX -->|payment.failed| NQ

    %% =========================
    %% Payment Domain
    %% =========================
    PX([payment-exchange<br/>topic])
    PQue[payment.queue]

    PX -->|payment.*| PQue

    %% =========================
    %% Publisher connections
    %% =========================
    PubService --> OX
    PubService --> PX
```
