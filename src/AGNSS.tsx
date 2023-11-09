import type { AGNSSRequest } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Static } from '@sinclair/typebox'
import { useContext, useState } from 'react'
import { MessageContext } from './Device.js'
import { useSettings } from './context/SettingsContext.js'
import { sendMessage } from './sendMessage.js'

const AGNSSDataTypes = {
	1: 'UTC parameters',
	2: 'Ephemerides',
	3: 'Almanac',
	4: 'Klobuchar ionospheric correction parameters',
	6: 'GPS time of week',
	7: 'GPS system clock and time of week',
	8: 'Approximate location',
	9: 'Satellite integrity data',
}

export const AGNSS = ({
	mcc,
	mnc,
	cell,
	area,
}: {
	mcc: number
	mnc: number
	cell: number
	area: number
}) => {
	const { endpoint } = useSettings()
	const [types, setTypes] = useState<number[]>([1, 2, 3, 4, 6, 7, 8, 9])
	const { messages } = useContext(MessageContext)
	const agnssMessages = messages.filter(({ topic }) => topic.endsWith('/agnss'))

	return (
		<form className="card mt-4">
			<div className="card-header">Assisted GPS</div>
			<div className="card-body">
				<fieldset className="mb-3">
					{Object.entries(AGNSSDataTypes).map(([k, v]) => {
						const t = parseInt(k, 10)
						return (
							<div className="form-check" key={k}>
								<input
									className="form-check-input"
									type="checkbox"
									id={`type-${k}`}
									checked={types.includes(t)}
									onChange={() => {
										setTypes((types) => {
											if (types.includes(t)) return types.filter((v) => v !== t)
											return [...new Set([...types, t])]
										})
									}}
								/>
								<label className="form-check-label" htmlFor={`type-${k}`}>
									{v}
								</label>
							</div>
						)
					})}
				</fieldset>
				{agnssMessages.length > 0 && (
					<ul>
						{agnssMessages.map(({ payload }, k) => (
							<li key={k}>{payload.length} bytes</li>
						))}
					</ul>
				)}
			</div>
			<div className="card-footer d-flex flex-row-reverse">
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => {
						const m: Static<typeof AGNSSRequest> = {
							mcc,
							mnc,
							cell,
							area,
							types: types ?? [1, 2, 3, 4, 6, 7, 8, 9],
						}
						sendMessage({ endpoint })(m, 'agnss/get').catch(console.error)
					}}
				>
					Request A-GPS data
				</button>
			</div>
		</form>
	)
}
