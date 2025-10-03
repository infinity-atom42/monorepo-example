import amqp from 'amqp-connection-manager'

export function createConnection(url: string) {
	return amqp.connect([url], { heartbeatIntervalInSeconds: 5 })
}
