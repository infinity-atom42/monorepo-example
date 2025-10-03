import { onOrderCreated } from './order-created'
import { onOrderFailed } from './order-failed'

export const consumers = [onOrderCreated, onOrderFailed]
