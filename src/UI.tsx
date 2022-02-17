import classNames from 'classnames'
import { Progress } from 'components/Progress'
import React, { useEffect, useState } from 'react'
import type { BatchUpdate } from './batch'
import { batch } from './batch'
import { Header } from './Header'
import { sendMessage } from './sendMessage'
import { sendSensorMessage } from './sendSensorMessage'
import type { Update } from './updateReported'
import { updateReported } from './updateReported'
import { UpdateUI } from './UpdateUI'

type QueuedUpdate = Update & { ts: number }

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
				<form className="d-flex align-items-center">
					{batchMode && (
						<div className="input-group me-2">
							<input
								className="form-control"
								type="number"
								name="delay"
								id="delay"
								step={1}
								value={intervalSeconds}
								onChange={({ target: { value } }) =>
									setIntervalSeconds(Math.round(parseInt(value, 10)))
								}
							/>
							<span className="input-group-text">s</span>
						</div>
					)}
					<button
						type="button"
						onClick={() => setBatchMode((m) => !m)}
						className={classNames(
							{
								btn: true,
								'btn-warning': batchMode,
								'btn-outline-secondary': !batchMode,
							},
							'text-nowrap',
						)}
					>
						Batch mode
						{batchUpdates.length > 0 && (
							<span className={'badge badge-primary pill-rounded'}>
								{batchUpdates.length}
							</span>
						)}
					</button>
				</form>
			</Header>
			{timeLeft !== undefined && (
				<Progress
					value={Math.round((1 - timeLeft / timeoutIntervalSeconds) * 100)}
				/>
			)}
			<main className="container mt-4">
				{error !== undefined && (
					<div className="alert alert-danger" role="alert">
						{JSON.stringify(error)}
					</div>
				)}
				<UpdateUI
					endpoint={endpoint}
					updateReported={u}
					sendSensorMessage={s}
					sendMessage={m}
				/>
			</main>
		</>
	)
}
