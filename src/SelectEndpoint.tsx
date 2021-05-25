import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Label, Input, Form } from './bootstrap5'
import { Header } from './Header'
import { Main } from './Styles'

const StyledForm = styled(Form)`
	div {
		display: flex;
		gap: 1rem;
	}
`

export const SelectEndpoint = ({
	onEndpoint,
}: {
	onEndpoint: (endpoint: URL) => unknown
}) => {
	const [endpoint, setEndpoint] = useState<URL>()
	return (
		<>
			<Header />
			<Main>
				<StyledForm
					onSubmit={() => {
						if (endpoint !== undefined) onEndpoint(endpoint)
					}}
				>
					<Label for="endpoint">
						Please provide the endpoint of the running device simulator
					</Label>
					<div>
						<Input
							type="url"
							name="endpoint"
							id="endpoint"
							placeholder="e.g. 'http://localhost:24272'"
							onChange={({ target: { value } }) => {
								try {
									setEndpoint(new URL(value))
								} catch (err) {
									// pass
								}
							}}
						/>
						<Button disabled={endpoint === undefined}>Connect</Button>
					</div>
				</StyledForm>
			</Main>
		</>
	)
}
