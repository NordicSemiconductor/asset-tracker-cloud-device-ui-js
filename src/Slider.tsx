import React, { useState } from 'react'
import './DeviceUI.scss'

const defaultFormatValue = (n: number) => n

export const Slider = ({
	label,
	min,
	max,
	formatValue,
	onChange,
}: {
	label: string
	min: number
	max: number
	formatValue?: (v: number) => any
	onChange: (v: number) => any
}) => {
	const [v, changeV] = useState((max - min) / 2)
	const [sliderState, setSliderState] = useState(50)
	return (
		<div className="form-group">
			<label htmlFor={`${label}Slider`}>
				{label}: {v}
			</label>
			<input
				type="range"
				className="form-control-range"
				id={`${label}Slider`}
				min="0"
				max="100"
				value={sliderState}
				onChange={({ target: { value } }) => {
					const s = parseInt(value, 10)
					setSliderState(s)
					const v = (s / 100) * (max - min) + min
					changeV((formatValue || defaultFormatValue)(v))
				}}
				onMouseUp={e => {
					onChange(v)
				}}
				onTouchEnd={e => {
					onChange(v)
				}}
			/>
		</div>
	)
}
