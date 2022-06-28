import { trimSlash } from './trimSlash'

export type BatchUpdate = Record<string, { v: any; ts: number }[]>

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
