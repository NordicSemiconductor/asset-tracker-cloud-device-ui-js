import { useEffect, useState } from 'react'
import { SettingsProvider } from './context/SettingsContext'
import { SelectEndpoint } from './SelectEndpoint'
import { UI } from './UI'

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
