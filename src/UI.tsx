import React, { useEffect, useState } from 'react'
import {
	Alert,
	Button,
	Badge,
	Form,
	Input,
	InputGroup,
	InputGroupText,
	Progress,
} from 'reactstrap'
import { updateReported, Update } from './updateReported'
import { sendMessage } from './sendMessage'
import { Main } from './Styles'
import { BatchUpdate, batch } from './batch'
import { UpdateUI } from './UpdateUI'
import { Header } from './Header'
import styled from 'styled-components'

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

export const UI = ({ endpoint }: { endpoint: URL }) => {
	const [error, setError] = useState<Error>()
	const [batchMode, setBatchMode] = useState(false)
	const [timeLeft, setTimeLeft] = useState<number>()
	const [batchUpdates, setBatchUpdates] = useState<QueuedUpdate[]>([])
	const [batchTimeout, setBatchTimeout] = useState<NodeJS.Timeout>()
	const [scheduledSendTime, setScheduledSendTime] = useState<number>()
	const [intervalSeconds, setIntervalSeconds] = useState<number>(1)
	const [timeoutIntervalSeconds, setTimeoutIntervalSeconds] = useState<number>(
		1,
	)

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
	const m = batchMode
		? queueUpdate
		: (u: Update) => {
				sendMessage({ endpoint })(u).catch(setError)
		  }

	return (
		<>
			<Header>
				<Form inline>
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
								addon={true}
							/>
							<InputGroupText>s</InputGroupText>
						</StyledInputGroup>
					)}
					<StyledButton
						onClick={() => setBatchMode((m) => !m)}
						outline={!batchMode}
						color={batchMode ? 'warning' : 'secondary'}
					>
						Batch mode
						{batchUpdates.length > 0 && (
							<StyledBadge color="info" pill>
								{batchUpdates.length}
							</StyledBadge>
						)}
					</StyledButton>
				</Form>
			</Header>
			{timeLeft !== undefined && (
				<StyledProgress
					value={Math.round((1 - timeLeft / timeoutIntervalSeconds) * 100)}
				/>
			)}
			<Main>
				{error !== undefined && (
					<Alert color="danger">{JSON.stringify(error)}</Alert>
				)}
				<UpdateUI
					endpoint={endpoint}
					updateReported={u}
					sendMessage={m}
					queueUpdate={queueUpdate}
				/>
			</Main>
		</>
	)
}
