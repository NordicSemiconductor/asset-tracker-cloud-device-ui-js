import type { Batch } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Static } from '@sinclair/typebox'
import classNames from 'classnames'
import { Progress } from 'components/Progress'
import { useEffect, useState } from 'react'
import { Header } from './Header'
import { UpdateUI } from './UpdateUI'
import { batch } from './batch'
import { useSettings } from './context/SettingsContext'
import { mergeBatch } from './mergeBatch'
import { sendMessage } from './sendMessage'
import {
	updateReported,
	type SensorMessage,
	type Update,
} from './updateReported'

export const UI = () => {
	const { endpoint } = useSettings()
	const [error, setError] = useState<Error>()
	const [batchMode, setBatchMode] = useState(false)
	const [timeLeft, setTimeLeft] = useState<number>()
	const [batchUpdates, setBatchUpdates] = useState<Static<typeof Batch>>({})
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

	const queueUpdate = (update: Update | SensorMessage) => {
		setBatchMode(true)
		setBatchUpdates((updates) => mergeBatch(updates, update))
		if (batchTimeout !== undefined) clearTimeout(batchTimeout)
		setScheduledSendTime(Date.now() + intervalSeconds * 1000)
		setTimeoutIntervalSeconds(intervalSeconds)
		setBatchTimeout(
			setTimeout(() => {
				setScheduledSendTime(undefined)
				setBatchUpdates((updates) => {
					console.log(updates)
					batch({ endpoint })(updates).catch(setError)
					return {}
				})
			}, intervalSeconds * 1000),
		)
	}

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
						{Object.keys(batchUpdates).length > 0 && (
							<span className={'badge badge-primary pill-rounded'}>
								{Object.values(batchUpdates).reduce(
									(total, prop) => total + prop.length,
									0,
								)}
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
					updateReported={(update) => {
						if (batchMode) {
							queueUpdate(update)
						} else {
							updateReported({ endpoint })(update).catch(setError)
						}
					}}
					sensorMessage={(message) => {
						if (batchMode) {
							queueUpdate(message)
						} else {
							sendMessage({ endpoint })(message, 'message').catch(setError)
						}
					}}
				/>
			</main>
		</>
	)
}
