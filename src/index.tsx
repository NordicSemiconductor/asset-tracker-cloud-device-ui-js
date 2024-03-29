import { createRoot } from 'react-dom/client'
import { DeviceUIApp } from './App.js'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(<DeviceUIApp />)
