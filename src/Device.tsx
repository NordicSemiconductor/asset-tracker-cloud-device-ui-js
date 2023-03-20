import React, { useEffect, useState } from 'react'
import { useSettings } from './context/SettingsContext'
import { trimSlash } from './trimSlash'

export const MessageContext = React.createContext<{
	messages: {
		topic: string
		payload: any
	}[]
}>({ messages: [] })

export const Device = ({
	children,
}: {
	children: (args: { deviceId?: string; config: any }) => JSX.Element | null
}): JSX.Element | null => {
	const { endpoint } = useSettings()
	const [deviceId, setDeviceId] = useState<string>()
	const [config, setConfig] = useState()
	const [messages, setMessages] = useState<
		{
			topic: string
			payload: any
		}[]
	>([])
	useEffect(() => {
		fetch(`${trimSlash(endpoint)}/id`)
			.then(async (response) => {
				setDeviceId(await response.text())
			})
			.catch((err) => console.error(err))

		const connection = new WebSocket(
			endpoint.toString().replace(/^https?/, 'ws'),
		)
		connection.onopen = () => {
			console.debug('[ws]', 'open')
		}
		connection.onerror = (error) => {
			console.error('[ws]', error)
		}
		connection.onmessage = (message) => {
			const data = JSON.parse(message.data)
			console.debug('[ws]', 'message', data)
			if ('config' in data) setConfig(data.config)
			if ('message' in data)
				setMessages((messages) => [...messages, data.message])
		}
	}, [endpoint])
	if (deviceId === undefined) {
		return <p>Connecting to {endpoint.toString()} ...</p>
	}
	return (
		<MessageContext.Provider value={{ messages }}>
			{children({ deviceId, config })}
		</MessageContext.Provider>
	)
}
