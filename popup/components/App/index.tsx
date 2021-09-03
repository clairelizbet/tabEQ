import VolumePanel from '../VolumePanel'
import PanningPanel from '../PanningPanel'
import EqualizerPanel from '../EqualizerPanel'
import Header from '../Header'
import { AppSettings, useActivePanel } from '../../../util/storage'
import AppContext from '../../context'
import './app.scss'

type AppProps = { settings: AppSettings }

const App = ({ settings }: AppProps) => {
  const [activePanel, setActivePanel] = useActivePanel(settings.activePanel)

  const appContextValue = {
    activePanel,
    setActivePanel,
  }

  return (
    <div className="app">
      <AppContext.Provider value={appContextValue}>
        <Header />
        <VolumePanel />
        <PanningPanel />
        <EqualizerPanel />
      </AppContext.Provider>
    </div>
  )
}

export default App
