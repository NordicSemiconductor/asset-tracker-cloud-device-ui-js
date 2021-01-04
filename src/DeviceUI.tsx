import React, { useEffect, useState } from 'react'
import { Alert, Navbar, NavbarBrand, Button } from 'reactstrap'
import logo from './logo.svg'
import { updateReported, Update } from './updateReported'
import { sendMessage } from './sendMessage'
import styled from 'styled-components'
import { GlobalStyle, Main, mobileBreakpoint } from './Styles'
import { BatchUpdate, batch } from './batch'
import { UpdateUI } from './UpdateUI'

const LogoImg = styled.img`
	margin-right: 0.25rem;
`

const StyledNavbar = styled(Navbar)`
	@media (min-width: ${mobileBreakpoint}) {
		max-width: ${mobileBreakpoint};
		margin: 0 auto;
	}
`

type QueuedUpdate = Update & { ts: number }

export const DeviceUIApp = ({ endpoint }: { endpoint: string }) => {
	const [error, setError] = useState<Error>()
	const [batchMode, setBatchMode] = useState(false)
	const [timeLeft, setTimeLeft] = useState<number>()
	const [, setBatchUpdates] = useState<QueuedUpdate[]>([])
	const [batchTimeout, setBatchTimeout] = useState<NodeJS.Timeout>()
	const [scheduledSendTime, setScheduledSendTime] = useState<number>()

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
		setBatchUpdates((updates) => [
			...updates,
			{
				...update,
				ts: Date.now(),
			},
		])
		if (batchTimeout !== undefined) clearTimeout(batchTimeout)
		setScheduledSendTime(Date.now() + 1000)
		setBatchTimeout(
			setTimeout(() => {
				//
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
			}, 1000),
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
			<GlobalStyle />
			<header className="bg-light">
				<StyledNavbar color="light" light>
					<NavbarBrand href="/">
						<LogoImg
							src={logo}
							width="30"
							height="30"
							className="d-inline-block align-top"
							alt="Cat Tracker"
						/>
						Cat Tracker Simulator
					</NavbarBrand>
					<Button
						onClick={() => setBatchMode((m) => !m)}
						outline={!batchMode}
						color={batchMode ? 'warning' : 'secondary'}
					>
						Batch mode: {batchMode ? 'on' : 'off'}
						{timeLeft !== undefined ? ` ${timeLeft}s` : ''}
					</Button>
				</StyledNavbar>
			</header>
			<Main>
				{error !== undefined && (
					<Alert color="danger">{JSON.stringify(error)}</Alert>
				)}
				<UpdateUI endpoint={endpoint} updateReported={u} sendMessage={m} />
			</Main>
		</>
	)
}
