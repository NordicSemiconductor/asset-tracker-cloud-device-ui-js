export const updateReported = ({ endpoint }: { endpoint: string }) => async ({
	property,
	v,
}: {
	property: string
	v: any
}) =>
	fetch(`${endpoint}/update`, {
		method: 'POST',
		body: JSON.stringify({
			[property]: {
				v: v,
				ts: new Date().toISOString(),
			},
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(response => {
		if (!response.ok) {
			throw new Error(`${response.status}: ${response.statusText}`)
		}
	})
