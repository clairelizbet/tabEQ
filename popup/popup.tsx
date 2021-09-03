import { getSettings } from '../util/storage'
import { render } from 'preact'
import App from './components/App'
import runOnInteractive from '../util/runOnInteractive'

const init = async () => {
  const settings = await getSettings()
  const root = document.getElementById('root')
  if (!root) return

  render(<App settings={settings} />, root)
}

runOnInteractive(init)
