import type { Batch } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Static } from '@sinclair/typebox'
import type { SensorMessage, Update } from './updateReported.js'

export const mergeBatch = (
	updates: Static<typeof Batch>,
	update: Update | SensorMessage,
): Static<typeof Batch> =>
	Object.entries(update).reduce(
		(updates, [k, v]) =>
			({
				...updates,
				[k]: [...(updates[k as keyof Static<typeof Batch>] ?? []), v],
			}) as Static<typeof Batch>,
		updates,
	)
