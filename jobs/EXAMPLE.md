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
    OCrea[order.created.queue]
    OFail[order.failed.queue]

    OX -->|order.created| OCrea
    OX -->|order.failed| OFail

    %% =========================
    %% Critical Notifications
    %% =========================
    NQ[notifications.queue]

    %% =========================
    %% Fanout: Promotions Example
    %% =========================
    FX([promo-exchange<br/>fanout])
    FEmail[email.queue]
    FPush[push.queue]
    FAnalytics[analytics.queue]

    FX --> FEmail
    FX --> FPush
    FX --> FAnalytics

    %% =========================
    %% Critical bindings & fanout bindings
    %% =========================
    OX --->|order.created| FX
    OX -->|order.failed| NQ
    PX -->|payment.failed| NQ
    PX --->|payment.succeeded| FX

    %% =========================
    %% Payment Domain
    %% =========================
    PX([payment-exchange<br/>topic])
    PCreated[payment.created.queue]
    PSucceeded[payment.succeeded.queue]

    PX -->|payment.created| PCreated
    PX -->|payment.succeeded| PSucceeded

    %% =========================
    %% Publisher connections
    %% =========================
    PubService -->|order.*| OX
    PubService -->|payment*| PX
    PubService -->|billing<br>security| AX

    %% =========================
    %% Direct: Audit Example
    %% =========================
    AX([audit-exchange<br/>direct])
    ABill[audit.billing.queue]
    ASec[audit.security.queue]

    AX -->|billing| ABill
    AX -->|security| ASec
```
