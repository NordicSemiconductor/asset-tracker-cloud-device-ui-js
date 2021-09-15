import React, { Fragment, useContext, useState } from 'react'
import styled from 'styled-components'
import { MessageContext } from './Device'

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
	select {
		width: 150px;
		height: 30px;
	}
	padding: 0.25rem 0;
	label {
		font-weight: normal;
	}
	align-items: center;
`

const FieldsetWithCheckboxes = styled(Fieldset)`
	input {
		width: auto;
		height: auto;
	}
	flex-direction: column;
	align-items: flex-start;
`

const FormFooter = styled(Fieldset)`
	display: flex;
	flex-direction: row;
    justify-content: flex-end;
}
`

const AGPSDataTypes = {
	1: 'UTC parameters',
	2: 'Ephemerides',
	3: 'Almanac',
	4: 'Klobuchar ionospheric correction parameters',
	6: 'GPS time of week',
	7: 'GPS system clock and time of week',
	8: 'Approximate location',
	9: 'Satellite integrity data',
}

export const AGPS = ({
	sendMessage: m,
	mcc,
	mnc,
	cell,
	area,
}: {
	sendMessage: (message: Record<string, any>, topic: string) => void
	mcc: number
	mnc: number
	cell: number
	area: number
}) => {
	const [types, setTypes] = useState<number[]>([1, 2, 3, 4, 6, 7, 8, 9])

	const { messages } = useContext(MessageContext)
	const agpsMessages = messages.filter(({ topic }) => topic.endsWith('/agps'))

	return (
		<>
			<form>
				<Headline>Assisted GPS</Headline>
				<FieldsetWithCheckboxes>
					{Object.entries(AGPSDataTypes).map(([k, v]) => {
						const t = parseInt(k, 10)
						return (
							<label key={k}>
								<input
									type="checkbox"
									id={`type-${k}`}
									checked={types.includes(t)}
									onChange={() => {
										setTypes((types) => {
											if (types.includes(t)) return types.filter((v) => v !== t)
											return [...new Set([...types, t])]
										})
									}}
								/>{' '}
								{k}: {v}
							</label>
						)
					})}
				</FieldsetWithCheckboxes>
				<FormFooter>
					<button
						type="button"
						onClick={() => {
							m(
								{
									mcc,
									mnc,
									cell,
									area,
									types: types ?? [1, 2, 3, 4, 6, 7, 8, 9],
								},
								'agps/get',
							)
						}}
					>
						Request A-GPS data
					</button>
				</FormFooter>
			</form>
			{agpsMessages.length > 0 && (
				<ul>
					{agpsMessages.map(({ payload }, k) => (
						<li key={k}>{payload.length} bytes</li>
					))}
				</ul>
			)}
		</>
	)
}
