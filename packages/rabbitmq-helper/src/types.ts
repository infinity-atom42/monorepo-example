export const EXCHANGE_TYPES = {
	DIRECT: 'direct',
	TOPIC: 'topic',
	HEADERS: 'headers',
	FANOUT: 'fanout',
} as const

export type ExchangeType = (typeof EXCHANGE_TYPES)[keyof typeof EXCHANGE_TYPES]