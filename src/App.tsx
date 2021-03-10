import React, { useEffect, useState } from 'react'
import { SelectEndpoint } from './SelectEndpoint'
import { GlobalStyle } from './Styles'
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
			<GlobalStyle />
			{endpoint === undefined && <SelectEndpoint onEndpoint={setEndpoint} />}
			{endpoint && <UI endpoint={endpoint} />}
		</>
	)
}
