import React, { useEffect, useState } from 'react'

export const Device = ({
	endpoint,
	children,
}: {
	endpoint: string
	children: (args: { deviceId?: string; config: any }) => JSX.Element | null
}): JSX.Element | null => {
	const [deviceId, setDeviceId] = useState<string>()
	const [config, setConfig] = useState()
	useEffect(() => {
		fetch(`${endpoint}/id`)
			.then(async (response) => {
				setDeviceId(await response.text())
			})
			.catch((err) => console.error(err))

		const connection = new WebSocket(endpoint.replace(/^https?/, 'ws'))
		connection.onopen = () => {
			console.debug('[ws]', 'open')
		}
		connection.onerror = (error) => {
			console.error('[ws]', error)
		}
		connection.onmessage = (message) => {
			console.debug('[ws]', 'message', message)
			setConfig(JSON.parse(message.data))
		}
	}, [endpoint])
	if (deviceId === undefined) {
		return <p>Connecting to {endpoint} ...</p>
	}
	return children({ deviceId, config })
}
