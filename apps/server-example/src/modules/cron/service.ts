import type { CronStore } from '@packages/elysia-cron'

import { NotFoundError } from '@se/errors'

import type * as CronModel from './model'

/**
 * List all registered cron jobs
 */
export function listCronJobs(cron: CronStore) {
	return Object.entries(cron).map(([name, job]) => ({
		name,
		isRunning: job.isRunning(),
		isBusy: job.isBusy(),
		nextRun: job.nextRun()?.toISOString(),
		previousRun: job.previousRun()?.toISOString(),
	}))
}

/**
 * Get detailed status of a specific cron job
 */
export function getCronJobStatus(cron: CronStore, name: CronModel.CronJobName) {
	const job = cron[name]
	if (!job) {
		throw new NotFoundError(`Cron job '${name}' not found`)
	}

	return {
		name,
		isRunning: job.isRunning(),
		isBusy: job.isBusy(),
		nextRun: job.nextRun()?.toISOString(),
		previousRun: job.previousRun()?.toISOString(),
	}
}

/**
 * Stop a cron job
 */
export function stopCronJob(cron: CronStore, name: CronModel.CronJobName) {
	const job = cron[name]
	if (!job) {
		throw new NotFoundError(`Cron job '${name}' not found`)
	}

	job.stop()
	return { success: true, message: `Cron job '${name}' stopped` }
}

/**
 * Start/resume a cron job
 */
export function startCronJob(cron: CronStore, name: CronModel.CronJobName) {
	const job = cron[name]
	if (!job) {
		throw new NotFoundError(`Cron job '${name}' not found`)
	}

	job.resume()
	return { success: true, message: `Cron job '${name}' started` }
}

/**
 * Manually trigger a cron job to run immediately
 */
export function triggerCronJob(cron: CronStore, name: CronModel.CronJobName) {
	const job = cron[name]
	if (!job) {
		throw new NotFoundError(`Cron job '${name}' not found`)
	}

	job.trigger()
	return { success: true, message: `Cron job '${name}' triggered` }
}
