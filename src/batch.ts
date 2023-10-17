import type { Batch } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Static } from '@sinclair/typebox'
import { trimSlash } from './trimSlash.js'

export type BatchUpdate = Static<typeof Batch>

export const batch =
	({ endpoint }: { endpoint: URL }) =>
	async (update: BatchUpdate): Promise<void> =>
		fetch(`${trimSlash(endpoint)}/batch`, {
			method: 'POST',
			body: JSON.stringify(update),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			console.log('batch update succeeded', update)
			if (!response.ok) {
				throw new Error(`${response.status}: ${response.statusText}`)
			}
		})
