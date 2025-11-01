/* eslint-disable @typescript-eslint/no-explicit-any */
// This is a copy of the @elysiajs/cron plugin

import { Cron, type CronOptions } from 'croner'
import type { Elysia } from 'elysia'

export type CronStore<Name extends string = string> = Record<Name, Cron>
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
	 */
	run: (store: Cron) => any | Promise<any>
}

export const cron =
	<Name extends string = string>({ pattern, name, run, ...options }: CronConfig<Name>) =>
	(app: Elysia) => {
		if (!pattern) throw new Error('pattern is required')
		if (!name) throw new Error('name is required')

		return app.state((store) => {
			// @ts-expect-error private property
			const prevCron = (app.singleton.store?.cron ?? {}) as CronStore

			return {
				...store,
				cron: {
					...prevCron,
					[name]: new Cron(pattern, options, () =>
						// @ts-expect-error private property
						run(app.singleton.store as any)
					),
				} as Record<Name, Cron>,
			}
		})
	}

export default cron
