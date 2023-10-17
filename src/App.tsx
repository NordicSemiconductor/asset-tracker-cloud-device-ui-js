import { useEffect, useState } from 'react'
import { SelectEndpoint } from './SelectEndpoint.js'
import { UI } from './UI.js'
import { SettingsProvider } from './context/SettingsContext.js'

export const DeviceUIApp = () => {
	const [endpoint, setEndpoint] = useState<URL>()
	useEffect(() => {
		try {
			setEndpoint(
				new URL(
					new URLSearchParams(document.location.search).get('endpoint') ?? '',
				),
			)
		} catch {
			// pass
		}
	}, [setEndpoint])

	return (
		<>
			{endpoint === undefined && <SelectEndpoint onEndpoint={setEndpoint} />}
			{endpoint && (
				<SettingsProvider endpoint={endpoint}>
					<UI />
				</SettingsProvider>
			)}
		</>
	)
}
