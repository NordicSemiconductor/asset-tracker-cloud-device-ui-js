process.env.SNOWPACK_PUBLIC_VERSION = process.env.VERSION || Date.now()

module.exports = {
	mount: {
		public: '/',
		src: '/_dist_',
	},
	plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-typescript'],
	installOptions: {
		installTypes: true,
		env: {
			SNOWPACK_PUBLIC_VERSION: true,
		},
	},
	buildOptions: {
		...(process.env.REACT_APP_DEVICE_UI_DOMAIN_NAME !== undefined && {
			baseUrl: `https://${process.env.REACT_APP_DEVICE_UI_DOMAIN_NAME}`,
		}),
	},
}
