import { sendMessage } from './sendMessage'
import type { Update } from './updateReported'

export const sendSensorMessage =
	({ endpoint }: { endpoint: URL }) =>
	async ({ property, v }: Update): Promise<void> =>
		sendMessage({ endpoint })(
			{
				[property]: {
					v: v,
					ts: Date.now(),
				},
			},
			'message',
		)
