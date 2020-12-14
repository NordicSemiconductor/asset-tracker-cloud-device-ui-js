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
		...(process.env.SNOWPACK_PUBLIC_DEVICE_UI_BASE_URL !== undefined && {
			baseUrl: `${process.env.SNOWPACK_PUBLIC_DEVICE_UI_BASE_URL.replace(
				/\/+$/,
				'',
			)}/`,
		}),
	},
}
