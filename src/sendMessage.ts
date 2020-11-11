import type { Update } from './updateReported'

export const sendMessage = ({ endpoint }: { endpoint: string }) => async ({
	property,
	v,
}: Update): Promise<void> =>
	fetch(`${endpoint}/message`, {
		method: 'POST',
		body: JSON.stringify({
			[property]: {
				v: v,
				ts: Date.now(),
			},
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then((response) => {
		console.log('sent message', property, v)
		if (!response.ok) {
			throw new Error(`${response.status}: ${response.statusText}`)
		}
	})
