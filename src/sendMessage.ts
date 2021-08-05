import { trimSlash } from './trimSlash'

export const sendMessage =
	({ endpoint }: { endpoint: URL }) =>
	async (m: Record<string, any>, t: string): Promise<void> =>
		fetch(`${trimSlash(endpoint)}/${t}`, {
			method: 'POST',
			body: JSON.stringify(m),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then((response) => {
			console.log('sent message', t, m)
			if (!response.ok) {
				throw new Error(`${response.status}: ${response.statusText}`)
			}
		})
