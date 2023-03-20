import type {
	NeighboringCellMeasurements,
	NetworkSurvey as NetworkSurveyMessage,
	WiFiSiteSurvey,
} from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Static } from '@sinclair/typebox'
import { useState } from 'react'
import { useSettings } from './context/SettingsContext'
import { sendMessage } from './sendMessage'

export const NetworkSurvey = () => {
	const { endpoint } = useSettings()
	const [lte, setNcellmeas] = useState<
		Static<typeof NeighboringCellMeasurements>
	>({
		mcc: 242,
		mnc: 2,
		cell: 21679716,
		area: 40401,
		earfcn: 6446,
		adv: 80,
		rsrp: -97,
		rsrq: -9,
		nmr: [
			{
				earfcn: 262143,
				cell: 501,
				rsrp: -104,
				rsrq: -18,
			},
			{
				earfcn: 262265,
				cell: 503,
				rsrp: -116,
				rsrq: -11,
			},
		],
		ts: Date.now(),
	})

	const [wifi, setWiFi] = useState<Static<typeof WiFiSiteSurvey>>({
		aps: [
			'4ce175805e6f',
			'4ce175805e6e',
			'743aef44b743',
			'743aef44b742',
			'4ce17501156e',
			'4ce17501156f',
			'4ce175bf092e',
			'4ce175bf092f',
			'743aef44b74a',
			'4ce175bf0921',
			'4ce175bf0920',
			'80e01d098f67',
			'80e01d098f65',
			'80e01d098f61',
			'80e01d098f68',
			'80e01d098f62',
			'80e01d098f69',
			'80e01d098f6d',
			'4ce175011560',
			'aa1544ac6c3a',
			'80e01d098f6a',
			'80e01d098f6e',
			'9a1544ac6c3a',
			'9e1544ac6c3a',
		],
		ts: Date.now(),
	})

	return (
		<form className="card mt-4">
			<div className="card-header">Network Survey</div>
			<div className="card-body">
				<div className="mb-3">
					<label htmlFor="lte">Neighbor Cell Measurements:</label>
					<textarea
						id="lte"
						className="form-control"
						value={JSON.stringify(lte, null, 2)}
						onChange={({ target: { value } }) => {
							try {
								const r = JSON.parse(value)
								if (r.ts === undefined) r.ts = Date.now()
								setNcellmeas(r)
							} catch {
								// pass
							}
						}}
						rows={10}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="wifi">Wi-Fi Site Survey:</label>
					<textarea
						id="wifi"
						className="form-control"
						value={JSON.stringify(wifi, null, 2)}
						onChange={({ target: { value } }) => {
							try {
								const r = JSON.parse(value)
								if (r.ts === undefined) r.ts = Date.now()
								setWiFi(r)
							} catch {
								// pass
							}
						}}
						rows={10}
					/>
				</div>
			</div>
			<div className="card-footer d-flex flex-row-reverse">
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => {
						const m: Static<typeof NetworkSurveyMessage> = { lte, wifi }
						sendMessage({ endpoint })(m, 'ground-fix').catch(console.error)
					}}
				>
					Send Network Survey
				</button>
			</div>
		</form>
	)
}
