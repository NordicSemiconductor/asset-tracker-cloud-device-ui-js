import React from 'react'
import type { PropsWithChildren } from 'react'

export const Progress = ({
	children,
	value,
	min,
	max,
}: PropsWithChildren<{ value: number; min?: number; max?: number }>) => (
	<div className="progress">
		<div
			className="progress-bar"
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin={min ?? 0}
			aria-valuemax={max ?? 100}
			style={{
				width: `${Math.round(((value - (min ?? 0)) / (max ?? 100)) * 100)}%`,
			}}
		>
			{children}
		</div>
	</div>
)
