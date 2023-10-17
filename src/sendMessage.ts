import { trimSlash } from './trimSlash.js'

export const sendMessage =
	({ endpoint }: { endpoint: URL }) =>
	async (m: Record<string, any>, topic: string): Promise<void> =>
		fetch(`${trimSlash(endpoint)}/${topic}`, {
			method: 'POST',
			body: JSON.stringify(m),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			console.log('sent message', topic, m)
			if (!response.ok) {
				throw new Error(`${response.status}: ${response.statusText}`)
			}
		})
