import React, { useEffect, useState } from 'react'
import {
	Alert,
	Button,
	Badge,
	Input,
	InputGroup,
	InputGroupText,
	Progress,
	Color,
	Form,
} from './bootstrap5'
import { updateReported, Update } from './updateReported'
import { sendSensorMessage } from './sendSensorMessage'
import { Main } from './Styles'
import { BatchUpdate, batch } from './batch'
import { UpdateUI } from './UpdateUI'
import { Header } from './Header'
import styled from 'styled-components'
import { sendMessage } from './sendMessage'

type QueuedUpdate = Update & { ts: number }

const StyledBadge = styled(Badge)``

const StyledButton = styled(Button)`
	${StyledBadge} {
		margin-left: 0.5rem;
	}
`

const StyledInputGroup = styled(InputGroup)`
	flex-grow: 0;
	width: 100px !important;
	margin-right: 0.25rem;
`

const StyledProgress = styled(Progress)`
	height: 5px;
`

const StyledForm = styled(Form)`
	display: flex;
	gap: 1rem;
	button {
		flex-shrink: 0;
	}
	.input-group {
		width: 125px;
	}
`

export const UI = ({ endpoint }: { endpoint: URL }) => {
	const [error, setError] = useState<Error>()
	const [batchMode, setBatchMode] = useState(false)
	const [timeLeft, setTimeLeft] = useState<number>()
	const [batchUpdates, setBatchUpdates] = useState<QueuedUpdate[]>([])
	const [batchTimeout, setBatchTimeout] = useState<NodeJS.Timeout>()
	const [scheduledSendTime, setScheduledSendTime] = useState<number>()
	const [intervalSeconds, setIntervalSeconds] = useState<number>(1)
	const [timeoutIntervalSeconds, setTimeoutIntervalSeconds] =
		useState<number>(1)

	useEffect(() => {
		const i = setInterval(() => {
			if (scheduledSendTime === undefined) {
				setTimeLeft(undefined)
				return
			}
			setTimeLeft(Math.ceil((scheduledSendTime - Date.now()) / 1000))
		}, 250)

		return () => {
			clearInterval(i)
		}
	}, [scheduledSendTime])

	const queueUpdate = (update: Update) => {
		setBatchMode(true)
		setBatchUpdates((updates) => [
			...updates,
			{
				...update,
				ts: Date.now(),
			},
		])
		if (batchTimeout !== undefined) clearTimeout(batchTimeout)
		setScheduledSendTime(Date.now() + intervalSeconds * 1000)
		setTimeoutIntervalSeconds(intervalSeconds)
		setBatchTimeout(
			setTimeout(() => {
				setScheduledSendTime(undefined)
				setBatchUpdates((updates) => {
					console.log(updates)
					const update = updates.reduce(
						(update, message) => ({
							...update,
							[message.property]: [
								...(update[message.property] ?? []),
								{
									v: message.v,
									ts: message.ts,
								},
							],
						}),
						{} as BatchUpdate,
					)
					batch({ endpoint })(update).catch(setError)
					return []
				})
			}, intervalSeconds * 1000),
		)
	}

	const u = batchMode
		? queueUpdate
		: (u: Update) => {
				updateReported({ endpoint })(u).catch(setError)
		  }
	const s = batchMode
		? queueUpdate
		: (u: Update) => {
				sendSensorMessage({ endpoint })(u).catch(setError)
		  }

	const m = sendMessage({ endpoint })

	return (
		<>
			<Header>
				<StyledForm>
					{batchMode && (
						<StyledInputGroup>
							<Input
								type="number"
								name="delay"
								id="delay"
								step={1}
								value={intervalSeconds}
								onChange={({ target: { value } }) =>
									setIntervalSeconds(Math.round(parseInt(value, 10)))
								}
							/>
							<InputGroupText>s</InputGroupText>
						</StyledInputGroup>
					)}
					<StyledButton
						onClick={() => setBatchMode((m) => !m)}
						outline={!batchMode}
						color={batchMode ? Color.warning : Color.secondary}
					>
						Batch mode
						{batchUpdates.length > 0 && (
							<StyledBadge color={Color.info} pill>
								{batchUpdates.length}
							</StyledBadge>
						)}
					</StyledButton>
				</StyledForm>
			</Header>
			{timeLeft !== undefined && (
				<StyledProgress
					value={Math.round((1 - timeLeft / timeoutIntervalSeconds) * 100)}
				/>
			)}
			<Main>
				{error !== undefined && (
					<Alert color={Color.danger}>{JSON.stringify(error)}</Alert>
				)}
				<UpdateUI
					endpoint={endpoint}
					updateReported={u}
					sendSensorMessage={s}
					sendMessage={m}
				/>
			</Main>
		</>
	)
}
