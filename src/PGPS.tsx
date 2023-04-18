import type { PGPSRequest } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Static } from '@sinclair/typebox'
import { useContext, useState } from 'react'
import { MessageContext } from './Device'
import { useSettings } from './context/SettingsContext'
import { sendMessage } from './sendMessage'

type Interval = 120 | 240 | 360 | 480

export const PGPS = () => {
	const { endpoint } = useSettings()
	const [numPredictions, setNumPredictions] = useState(42)
	const [interval, setInterval] = useState<Interval>(240)
	const { messages } = useContext(MessageContext)
	let url: URL | undefined = undefined
	const pgpsMessage = messages
		.filter(({ topic }) => topic.endsWith('/pgps'))
		.pop()

	if (pgpsMessage !== undefined) {
		try {
			const m = JSON.parse(pgpsMessage.payload)
			url = new URL(`https://${m.host}/${m.path}`)
		} catch {
			// pass
		}
	}

	return (
		<form className="card mt-4">
			<div className="card-header">Predicted GPS</div>
			<div className="card-body">
				<div className="mb-3">
					<label htmlFor="numPredictions">Number of predictions:</label>
					<input
						className="form-control"
						id="numPredictions"
						type="number"
						step={1}
						min={0}
						value={numPredictions}
						onChange={({ target: { value } }) =>
							setNumPredictions(parseInt(value, 10))
						}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="interval">
						Time between predictions, in minutes:
					</label>
					<input
						className="form-control"
						id="interval"
						type="number"
						step={120}
						min={120}
						max={480}
						value={interval}
						onChange={({ target: { value } }) =>
							setInterval(
								(Math.floor(parseInt(value, 10) / 120) * 120) as Interval,
							)
						}
					/>
				</div>
				{url !== undefined && (
					<ul>
						<li>
							<a href={url.toString()}>{url.toString()}</a>
						</li>
					</ul>
				)}
			</div>
			<div className="card-footer d-flex flex-row-reverse">
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => {
						const m: Static<typeof PGPSRequest> = {
							n: numPredictions,
							int: interval,
						}
						sendMessage({ endpoint })(m, 'pgps/get').catch(console.error)
					}}
				>
					Request P-GPS data
				</button>
			</div>
		</form>
	)
}
