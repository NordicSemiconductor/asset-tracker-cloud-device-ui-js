import React, { useState } from 'react'
import styled from 'styled-components'

const Headline = styled.h2`
	font-size: 100%;
`

const Fieldset = styled.fieldset`
	display: flex;
	justify-content: space-between;
	input {
		width: 150px;
		height: 30px;
	}
	padding: 0.25rem 0;
	label {
		font-weight: normal;
	}
    align-items: stretch;
    flex-direction: column;
}
`

const FormFooter = styled(Fieldset)`
	display: flex;
	flex-direction: row;
    justify-content: flex-end;
}
`

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
		<>
			<form>
				<Headline>Neighbor Cell Measurements</Headline>
				<Fieldset>
					<label htmlFor="report">Report:</label>
					<textarea
						id="report"
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
				</Fieldset>
				<FormFooter>
					<button
						type="button"
						onClick={() => {
							m(report, 'ncellmeas')
						}}
					>
						Send neighbor cell measurements report
					</button>
				</FormFooter>
			</form>
		</>
	)
}
