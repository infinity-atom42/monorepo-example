import { Elysia } from 'elysia'

import { cron } from '@packages/elysia-cron'
import { Patterns } from '@packages/utils/cron-patterns'

import { runCleanup } from './jobs/cleanup'
import { runHeartbeat } from './jobs/heartbeat'
import * as CronModel from './model'
import * as CronService from './service'

/**
 * Cron Management Controller
 *
 * Provides API endpoints to manage and monitor cron jobs.
 * Self-aware: only registers cron jobs in non-test environments.
 */
export const cronController = new Elysia({ prefix: '/cron' })
	.use(
		cron({
			name: 'heartbeat',
			pattern: Patterns.EVERY_MINUTE,
			run() {
				runHeartbeat()
			},
		})
	)
	.use(
		cron({
			name: 'cleanup',
			pattern: Patterns.EVERY_5_MINUTES,
			run() {
				runCleanup()
			},
		})
	)
	.get('/', ({ store: { cron } }) => CronService.listCronJobs(cron), {
		detail: {
			tags: ['Cron'],
			summary: 'List all cron jobs',
			description: 'Get status of all registered cron jobs',
		},
	})
	.get('/:name', ({ store: { cron }, params: { name } }) => CronService.getCronJobStatus(cron, name), {
		params: CronModel.cronJobNameParam,
		detail: {
			tags: ['Cron'],
			summary: 'Get cron job status',
			description: 'Get detailed status of a specific cron job',
		},
	})
	.post('/:name/stop', ({ store: { cron }, params: { name } }) => CronService.stopCronJob(cron, name), {
		params: CronModel.cronJobNameParam,
		detail: {
			tags: ['Cron'],
			summary: 'Stop cron job',
			description: 'Stop a running cron job',
		},
	})
	.post('/:name/start', ({ store: { cron }, params: { name } }) => CronService.startCronJob(cron, name), {
		params: CronModel.cronJobNameParam,
		detail: {
			tags: ['Cron'],
			summary: 'Start cron job',
			description: 'Start a stopped cron job',
		},
	})
	.post('/:name/trigger', ({ store: { cron }, params: { name } }) => CronService.triggerCronJob(cron, name), {
		params: CronModel.cronJobNameParam,
		detail: {
			tags: ['Cron'],
			summary: 'Trigger cron job manually',
			description: 'Manually trigger a cron job to run immediately',
		},
	})
