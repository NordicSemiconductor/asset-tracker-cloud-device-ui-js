import React, { Fragment, useContext, useState } from 'react'
import styled from 'styled-components'
import { MessageContext } from './Device'
import * as MccMncList from 'mcc-mnc-list'

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
}: {
	sendMessage: (message: Record<string, any>, topic: string) => void
}) => {
	const [mcc, setMcc] = useState<string>('242')
	const [mnc, setMnc] = useState<string>('2')
	const [cell, setCell] = useState<number>(33703719)
	const [area, setArea] = useState<number>(12)
	const [types, setTypes] = useState<number[]>([1, 2, 3, 4, 6, 7, 8, 9])

	const { messages } = useContext(MessageContext)
	const agpsMessages = messages.filter(({ topic }) => topic.endsWith('/agps'))

	return (
		<>
			<form>
				<Headline>Assisted GPS</Headline>
				<Fieldset>
					<label htmlFor="mcc">Mobile Country Code:</label>
					<select
						id="mcc"
						value={mcc}
						onChange={({ target: { value } }) => setMcc(value)}
					>
						{Object.entries(
							MccMncList.all()
								.filter(({ status }) => status === 'Operational')
								.sort(({ countryName: c1 }, { countryName: c2 }) =>
									(c1 ?? 'Z').localeCompare(c2 ?? 'Z'),
								)
								.reduce(
									(mccs, { mcc, countryName }) => ({
										...mccs,
										[mcc]: countryName,
									}),
									{} as Record<string, string>,
								),
						).map(([mcc, countryName]) => (
							<option key={mcc} value={mcc}>
								{countryName ?? mcc} ({mcc})
							</option>
						))}
					</select>
				</Fieldset>
				<Fieldset>
					<label htmlFor="mnc">Mobile Network Code:</label>
					{mcc === undefined && (
						<select id="mnc" disabled>
							<option>Please select a MCC</option>
						</select>
					)}
					{mcc !== undefined && (
						<select
							id="mnc"
							value={mnc}
							onChange={({ target: { value } }) => setMnc(value)}
						>
							{MccMncList.all()
								.filter(({ mcc: m }) => m === mcc)
								.sort(({ mnc: m1 }, { mnc: m2 }) => m1.localeCompare(m2))
								.map(({ mnc, brand, operator }) => (
									<option key={mnc} value={mnc}>
										{brand} {operator} ({mnc})
									</option>
								))}
						</select>
					)}
				</Fieldset>
				<Fieldset>
					<label htmlFor="cell">Cell:</label>
					<input
						id="cell"
						type="number"
						step={1}
						min={0}
						value={cell}
						onChange={({ target: { value } }) => setCell(parseInt(value, 10))}
					/>
				</Fieldset>
				<Fieldset>
					<label htmlFor="area">Area:</label>
					<input
						id="area"
						type="number"
						step={1}
						min={0}
						value={area}
						onChange={({ target: { value } }) => setArea(parseInt(value, 10))}
					/>
				</Fieldset>
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
									mcc: parseInt(mcc ?? '242', 10),
									mnc: parseInt(mnc ?? '2', 10),
									cell: cell ?? 33703719,
									area: area ?? 12,
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
