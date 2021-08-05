import React, { useContext, useState } from 'react'
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
	padding: 0.25rem 0;
	label {
		font-weight: normal;
	}
	align-items: center;
`

const FormFooter = styled(Fieldset)`
	display: flex;
	flex-direction: row;
    justify-content: flex-end;
}
`

type Interval = 120 | 240 | 360 | 480

export const PGPS = ({
	sendMessage: m,
}: {
	sendMessage: (message: Record<string, any>, topic: string) => void
}) => {
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
		<>
			<form>
				<Headline>Predicted GPS</Headline>
				<Fieldset>
					<label htmlFor="numPredictions">Number of predictions:</label>
					<input
						id="numPredictions"
						type="number"
						step={1}
						min={0}
						value={numPredictions}
						onChange={({ target: { value } }) =>
							setNumPredictions(parseInt(value, 10))
						}
					/>
				</Fieldset>
				<Fieldset>
					<label htmlFor="interval">
						Time between predictions, in minutes:
					</label>
					<input
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
				</Fieldset>
				<FormFooter>
					<button
						type="button"
						onClick={() => {
							m({ n: numPredictions, int: interval }, 'pgps/get')
						}}
					>
						Request P-GPS data
					</button>
				</FormFooter>
			</form>
			{url !== undefined && (
				<ul>
					<li>
						<a href={url.toString()}>{url.toString()}</a>
					</li>
				</ul>
			)}
		</>
	)
}
