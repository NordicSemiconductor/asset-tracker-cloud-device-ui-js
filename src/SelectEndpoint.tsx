import { useState } from 'react'
import { Header } from './Header'

export const SelectEndpoint = ({
	onEndpoint,
}: {
	onEndpoint: (endpoint: URL) => unknown
}) => {
	const [endpoint, setEndpoint] = useState<URL>()
	return (
		<>
			<Header />
			<main className="container mt-4">
				<div className="row justify-content-center">
					<form
						className="col-md-6"
						onSubmit={() => {
							if (endpoint !== undefined) onEndpoint(endpoint)
						}}
					>
						<label htmlFor="endpoint">
							Please provide the endpoint of the running device simulator
						</label>
						<div className="d-flex flex-row">
							<input
								className="form-control"
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
							<button
								className="btn btn-primary ms-3"
								disabled={endpoint === undefined}
							>
								Connect
							</button>
						</div>
					</form>
				</div>
			</main>
		</>
	)
}
