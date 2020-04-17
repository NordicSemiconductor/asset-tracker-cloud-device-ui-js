export const sendMessage = ({ endpoint }: { endpoint: string }) => async ({
	property,
	v,
}: {
	property: string
	v: any
}) =>
	fetch(`${endpoint}/message`, {
		method: 'POST',
		body: JSON.stringify({
			[property]: {
				v: v,
				ts: new Date().getTime(),
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
