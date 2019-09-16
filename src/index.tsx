import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { DeviceUIApp } from './DeviceUI'

const endpoint = new URLSearchParams(document.location.search).get('endpoint')

ReactDOM.render(
	<DeviceUIApp endpoint={endpoint || 'http://localhost:1234'} />,
	document.getElementById('root'),
)
