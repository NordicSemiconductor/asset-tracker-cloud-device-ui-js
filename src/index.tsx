import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './typography.scss'
import './bootstrap.scss'
import './desktop.scss'
import { DeviceUIApp } from './DeviceUI'

const endpoint = new URLSearchParams(document.location.search).get('endpoint')

ReactDOM.render(
	<DeviceUIApp endpoint={endpoint || 'http://localhost:1234'} />,
	document.getElementById('root'),
)
