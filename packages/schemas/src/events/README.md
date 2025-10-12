# Events

Event schemas and routing keys for message bus communication.

## Purpose

Defines the contract for events published and consumed across different services via message bus (RabbitMQ).

Ensures all services publish and consume events with the same structure and routing keys.

## Available Events

### Order Events

- `ORDER_CREATED` - Triggered when a new order is created
- `ORDER_FAILED` - Triggered when order processing fails

### Payment Events

- `PAYMENT_SUCCEEDED` - Triggered when payment is processed successfully
- `PAYMENT_FAILED` - Triggered when payment processing fails

## Usage

```typescript
import { 
  ORDER_CREATED, 
  OrderCreatedSchema,
  type OrderCreated 
} from '@packages/schemas/events'

// Publishing an event
const payload: OrderCreated = { orderId: '123', total: 99.99 }
await publishEvent(ORDER_CREATED, payload)

// Consuming an event
function handleMessage(msg: ConsumeMessage) {
  if (msg.properties.type === ORDER_CREATED) {
    const payload = OrderCreatedSchema.parse(JSON.parse(msg.content.toString()))
    // payload is now type-safe: OrderCreated
  }
}
```

## Adding New Events

1. Add routing key constant: `export const EVENT_NAME = 'domain.action' as const`
2. Add Zod schema: `export const EventNameSchema = z.object({ ... })`
3. Export type: `export type EventName = z.infer<typeof EventNameSchema>`
4. Update this README with the new event
