export type ServiceName = 'orders' | 'payments' | 'jobs'

// Canonical, globally unique event names are scoped by service prefix.
// Example routing keys: 'orders.created', 'orders.failed', 'payments.succeeded'
export interface EventCatalog {
	'orders.created': {
		orderId: string
		userId: string
		amount: number
		items: Array<{ productId: string; quantity: number; price: number }>
		createdAt: string
	}
	'orders.failed': {
		orderId: string
		userId: string
		reason: string
		errorCode: string
		timestamp: string
	}
	'payments.succeeded': {
		paymentId: string
		orderId: string
		userId: string
		amount: number
		currency: string
		method: string
		timestamp: string
	}
}

export type EventName = keyof EventCatalog
export type EventPayload<E extends EventName> = EventCatalog[E]

export function eventName<S extends ServiceName, N extends string>(service: S, name: N): `${S}.${N}` {
	return `${service}.${name}` as const
}

export const SERVICES = {
	ORDERS: 'orders',
	PAYMENTS: 'payments',
	JOBS: 'jobs',
} as const satisfies Record<string, ServiceName>

export type RoutingKey = EventName

export interface EventHandler<E extends EventName = EventName> {
	readonly eventName: E
	handler(payload: EventPayload<E>): Promise<void>
}
