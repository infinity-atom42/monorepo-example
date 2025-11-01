// This is a copy of the @elysiajs/cron plugin
import { Cron, type CronOptions } from 'croner'
import type { Elysia } from 'elysia'

export type CronStore<Name extends string = string> = Record<Name, Cron>

/**
 * Represents the Elysia singleton store structure with cron support
 */
export type ElysiaStoreWithCron = Record<string, unknown> & {
	cron?: CronStore
}

export interface CronConfig<Name extends string = string> extends CronOptions {
	/**
	 * Input pattern, input date, or input ISO 8601 time string
	 *
	 * ---
	 * ```plain
	 * ┌────────────── second (optional)
	 * │ ┌──────────── minute
	 * │ │ ┌────────── hour
	 * │ │ │ ┌──────── day of month
	 * │ │ │ │ ┌────── month
	 * │ │ │ │ │ ┌──── day of week
	 * │ │ │ │ │ │
	 * * * * * * *
	 * ```
	 */
	pattern: string
	/**
	 * Cronjob name to registered to `store`
	 */
	name: Name
	/**
	 * Function to execute on time
	 * @param store - The Elysia singleton store containing all registered stores (including cron)
	 */
	run: (store: ElysiaStoreWithCron) => void | Promise<void>
}

export const cron =
	<Name extends string = string>({ pattern, name, run, ...options }: CronConfig<Name>) =>
	(app: Elysia) => {
		return app.state((store) => {
			// @ts-expect-error - accessing private singleton.store property
			const prevCron = app.singleton.store?.cron ?? {}

			return {
				...store,
				cron: {
					...prevCron,
					[name]: new Cron(pattern, options, () => {
						// @ts-expect-error - accessing private singleton.store property
						run(app.singleton.store)
					}),
				} as CronStore<Name>,
			}
		})
	}
