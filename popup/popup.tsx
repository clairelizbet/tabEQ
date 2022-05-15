import { hydrateSettings } from '../util/storage'
import { render } from 'preact'
import App from './components/App'
import runOnInteractive from '../util/runOnInteractive'

const init = async () => {
  await hydrateSettings()

  const root = document.getElementById('root')
  if (!root) return

  render(<App />, root)
}

runOnInteractive(init)
