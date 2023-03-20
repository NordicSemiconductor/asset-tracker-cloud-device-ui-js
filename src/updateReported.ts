import type {
	AWSReported,
	Message,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Static } from '@sinclair/typebox'
import { trimSlash } from './trimSlash'

export type Update = Static<typeof AWSReported>
export type SensorMessage = Static<typeof Message>

export const updateReported =
	({ endpoint }: { endpoint: URL }) =>
	async (update: Update): Promise<void> =>
		fetch(`${trimSlash(endpoint)}/update`, {
			method: 'POST',
			body: JSON.stringify(update),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			console.log('updated reported', update)
			if (!response.ok) {
				throw new Error(`${response.status}: ${response.statusText}`)
			}
		})
