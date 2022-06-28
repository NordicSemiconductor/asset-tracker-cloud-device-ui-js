import { useState } from 'react'

export const Slider = ({
	id,
	min,
	max,
	onChange,
	value,
}: {
	id: string
	min: number
	max: number
	value: number
	onChange: (v: number) => any
}) => {
	const [sliderState, setSliderState] = useState(
		Math.round(((value - min) / (max - min)) * 100),
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
			}}
			onMouseUp={() => {
				onChange((sliderState / 100) * (max - min) + min)
			}}
			onTouchEnd={() => {
				onChange((sliderState / 100) * (max - min) + min)
			}}
			style={{ width: '100%' }}
		/>
	)
}
