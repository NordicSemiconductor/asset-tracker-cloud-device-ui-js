import React, { useState } from 'react'

const defaultFormatValue = (n: number) => n

export const Slider = ({
	id,
	min,
	max,
	formatValue,
	onChange,
	value,
}: {
	id: string
	min: number
	max: number
	value?: number
	formatValue?: (v: number) => any
	onChange: (v: number) => any
}) => {
	const startValue = value ?? (max - min) / 2
	const [v, changeV] = useState<number>()
	const [sliderState, setSliderState] = useState(
		Math.round(((startValue - min) / (max - min)) * 100),
	)
	return (
		<input
			type="range"
			className="form-control-range"
			id={`${id}Slider`}
			min="0"
			max="100"
			value={sliderState}
			onChange={({ target: { value } }) => {
				const s = parseInt(value, 10)
				setSliderState(s)
				const v = (s / 100) * (max - min) + min
				changeV((formatValue ?? defaultFormatValue)(v))
			}}
			onMouseUp={() => {
				if (v !== undefined) onChange(v)
			}}
			onTouchEnd={() => {
				if (v !== undefined) onChange(v)
			}}
			style={{ width: '100%' }}
		/>
	)
}
