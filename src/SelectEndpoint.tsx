import React, { useState } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { Header } from './Header'
import { Main } from './Styles'

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
				<Form
					onSubmit={() => {
						if (endpoint !== undefined) onEndpoint(endpoint)
					}}
				>
					<FormGroup>
						<Label for="endpoint">
							Please provide the endpoint of the running device simulator
						</Label>
						<Input
							type="url"
							name="endpoint"
							id="endpoint"
							placeholder="e.g. 'http://localhost:24272'"
							onChange={({ target: { value } }) => {
								try {
									setEndpoint(new URL(value))
								} catch {
									// pass
								}
							}}
						/>
					</FormGroup>
					<Button disabled={endpoint === undefined}>Connect</Button>
				</Form>
			</Main>
		</>
	)
}
