import fs from 'fs'
import path from 'path'

const { version } = JSON.parse(
	fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
)
const VERSION = process.env.VERSION ?? version ?? Date.now()
const PUBLIC_URL = process.env.PUBLIC_URL

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
	mount: {
		public: '/',
		src: '/_dist_',
	},
	plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-typescript'],
	packageOptions: {
		installTypes: true,
		env: {
			VERSION: true,
		},
	},
	buildOptions: {
		...(PUBLIC_URL !== undefined && {
			baseUrl: `${PUBLIC_URL.replace(/\/+$/, '')}/`,
		}),
	},
	env: {
		PUBLIC_URL,
		VERSION,
	},
	alias: {
		components: './src/components',
	},
}
