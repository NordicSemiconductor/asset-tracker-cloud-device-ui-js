import type { AWSReported } from '@nordicsemiconductor/asset-tracker-cloud-docs/protocol'
import type { Static } from '@sinclair/typebox'
import { useState } from 'react'
import { Map } from './Map.js'
import { Slider } from './Slider.js'
import { calculateHeading } from './calculateHeading.js'

type Position = { lat: number; lng: number }

export const GNSS = ({
	onUpdate,
}: {
	onUpdate: (gnss: Static<typeof AWSReported>['gnss']) => unknown
}) => {
	const [accuracy, setAccuracy] = useState(0)
	const [hdg, setHdg] = useState(0)
	const [spd, setSpd] = useState(0)
	const [alt, setAlt] = useState(0)
	const [location, setLocation] = useState<Position>({
		lat: 0,
		lng: 0,
	})

	return (
		<form className="card mt-4">
			<div className="card-header">GNSS location</div>
			<div className="card-body">
				<div className="mb-3">
					<Map
						heading={hdg}
						accuracy={accuracy}
						onPositionChange={({ lat, lng }) => {
							if (location.lng !== lng || location.lng !== lng) {
								const lastLocation = { ...location }
								const hdg = calculateHeading(lastLocation, { lat, lng })
								onUpdate({
									v: {
										lat,
										lng,
										acc: accuracy,
										hdg,
										spd,
										alt,
									},
									ts: Date.now(),
								})
								setHdg(hdg)
								setLocation({ lat, lng })
							}
						}}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="accuracy">Accuracy: {accuracy}</label>
					<Slider
						id="accuracy"
						min={0}
						max={200}
						onChange={(v) => {
							setAccuracy(v)
						}}
						value={accuracy}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="heading">Heading: {hdg}</label>
					<Slider
						id="heading"
						min={0}
						max={360}
						onChange={(v) => {
							setHdg(v)
						}}
						value={hdg}
						key={hdg}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="speed">Speed: {spd}</label>{' '}
					<Slider
						id="speed"
						min={0}
						max={100}
						onChange={(v) => {
							setSpd(v)
						}}
						value={spd}
					/>
				</div>
				<div>
					<label htmlFor="altitude">Altitude: {alt}</label>
					<Slider
						id="altitude"
						min={0}
						max={3000}
						onChange={(v) => {
							setAlt(v)
						}}
						value={alt}
					/>
				</div>
			</div>
			<div className="card-footer d-flex flex-row-reverse">
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => {
						onUpdate({
							v: {
								lat: location.lat,
								lng: location.lng,
								acc: accuracy,
								hdg,
								spd,
								alt,
							},
							ts: Date.now(),
						})
					}}
				>
					Send
				</button>
			</div>
		</form>
	)
}
