import React from 'react'
import { Slider } from './Slider'

export const AccelerometerSlider = ({
	onChange,
	value,
}: {
	onChange: (args: { x: number; y: number; z: number }) => void
	value: { x: number; y: number; z: number }
}) => (
	<>
		<Slider
			id="acc-x"
			min={0}
			max={10}
			value={value.x}
			onChange={(x) => {
				onChange({
					...value,
					x,
				})
			}}
		/>
		<Slider
			id="acc-y"
			min={0}
			max={10}
			value={value.y}
			onChange={(y) => {
				onChange({
					...value,
					y,
				})
			}}
		/>
		<Slider
			id="acc-z"
			min={0}
			max={10}
			value={value.z}
			onChange={(z) => {
				onChange({
					...value,
					z,
				})
			}}
		/>
	</>
)
