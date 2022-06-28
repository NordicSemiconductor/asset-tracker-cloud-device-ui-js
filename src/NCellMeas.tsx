import { useState } from 'react'

export const NCellMeas = ({
	sendMessage: m,
}: {
	sendMessage: (message: Record<string, any>, topic: string) => void
}) => {
	const [report, setReport] = useState({
		area: 52899,
		adv: 387,
		nmr: [
			{
				rsrp: -107,
				cell: 162,
				rsrq: -14,
				earfcn: 6200,
			},
			{
				rsrp: -114,
				cell: 51,
				rsrq: -22,
				earfcn: 6200,
			},
		],
		mnc: 3,
		rsrq: -17,
		rsrp: -109,
		mcc: 260,
		cell: 58411531,
		earfcn: 6200,
	})

	return (
		<form className="card mt-4">
			<div className="card-header">Neighbor Cell Measurements</div>
			<div className="card-body">
				<div className="mb-3">
					<label htmlFor="report">Report:</label>
					<textarea
						id="report"
						className="form-control"
						value={JSON.stringify(report, null, 2)}
						onChange={({ target: { value } }) => {
							try {
								const r = JSON.parse(value)
								if (r.ts === undefined) r.ts = Date.now()
								setReport(r)
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
						m(report, 'ncellmeas')
					}}
				>
					Send neighbor cell measurements report
				</button>
			</div>
		</form>
	)
}
