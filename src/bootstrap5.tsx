import React, { LabelHTMLAttributes } from 'react'
import type { PropsWithChildren } from 'react'
import classnames from 'classnames'

export enum Color {
	primary = 'primary',
	secondary = 'secondary',
	success = 'success',
	info = 'info',
	warning = 'warning',
	danger = 'danger',
	light = 'light',
	dark = 'dark',
}

export const Navbar = ({
	children,
	color,
	light,
}: PropsWithChildren<{ color?: Color; light?: boolean }>) => (
	<nav
		className={classnames('navbar', {
			[`navbar-${color}`]: color !== undefined,
			'bg-light': light,
		})}
	>
		{children}
	</nav>
)
export const NavbarBrand = ({
	children,
	...rest
}: PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => (
	<a {...rest} className="navbar-brand">
		{children}
	</a>
)
export const Label = ({
	children,
	for: f,
	...rest
}: PropsWithChildren<
	React.LabelHTMLAttributes<HTMLLabelElement> & { for?: string }
>) => (
	<label {...rest} className="form-label" htmlFor={f}>
		{children}
	</label>
)
export const Alert = ({
	children,
	color,
}: PropsWithChildren<{ color: Color }>) => (
	<div className={`alert alert-${color}`} role="alert">
		{children}
	</div>
)

export const Button = ({
	children,
	color,
	outline,
	type,
	...rest
}: PropsWithChildren<
	{
		color?: Color
		outline?: boolean
		type?: 'button' | 'submit'
	} & React.ButtonHTMLAttributes<HTMLButtonElement>
>) => (
	<button
		{...rest}
		type={rest.onClick === undefined ? type ?? 'submit' : 'button'}
		className={classnames('btn', {
			[`btn-${color ?? Color.primary}`]: !outline,
			[`btn-outline-${color ?? Color.primary}`]: outline,
		})}
	>
		{children}
	</button>
)
export const Badge = ({
	children,
	color,
	pill,
}: PropsWithChildren<{ color?: Color; pill?: boolean }>) => (
	<span
		className={classnames(`badge badge-${color ?? Color.primary}`, {
			'pill-rounded': pill,
		})}
	>
		{children}
	</span>
)

export const Form = ({
	children,
	...rest
}: PropsWithChildren<React.FormHTMLAttributes<HTMLFormElement>>) => (
	<form {...rest}>{children}</form>
)

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input className="form-control" {...props} />
)

export const InputGroup = ({ children }: PropsWithChildren<void>) => (
	<div className="input-group">{children}</div>
)
export const InputGroupText = ({ children }: { children: string }) => (
	<span className="input-group-text">{children}</span>
)
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
