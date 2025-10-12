# Events

Type-safe message bus event contracts for RabbitMQ.

## Purpose

Ensures all services publish and consume events with the same structure.

Provides type-safe constants for:

- RabbitMQ exchanges and queues
- Event routing keys
- Event payload validation schemas

No more typos in queue names, no mismatched event payloads across services.

## Usage

```typescript
import { event, exchange, queue, type OrderCreated } from '@packages/schemas/events'

// Setup: Type-safe infrastructure
await ch.assertExchange(exchange.ORDER, 'topic', { durable: true })
await ch.assertQueue(queue.ORDER, { durable: true })

// Publish: Type-safe routing key and validated payload
const data: OrderCreated = { orderId: '123', total: 99.99 }
await channel.publish(exchange.ORDER, event.ORDER_CREATED.key, data)

// Consume: Type-safe routing and parsing
switch (msg.fields.routingKey) {
  case event.ORDER_CREATED.key:
    const data = event.ORDER_CREATED.payload.parse(json)
}
```
