import {
	createContext,
	useContext,
	type FunctionComponent,
	type ReactNode,
} from 'react'

export type Settings = {
	endpoint: URL
}

export const SettingsContext = createContext<{
	endpoint: URL
}>({
	endpoint: new URL('https://example.com'),
})

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider: FunctionComponent<{
	children: ReactNode
	endpoint: URL
}> = ({ children, endpoint }) => {
	return (
		<SettingsContext.Provider
			value={{
				endpoint,
			}}
		>
			{children}
		</SettingsContext.Provider>
	)
}
