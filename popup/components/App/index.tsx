import ProcessingPanel from '../ProcessingPanel'
import EqualizerPanel from '../EqualizerPanel'
import Header from '../Header'
import './app.scss'
import { useActivePanel } from '../../../util/storage'

const App = () => {
  const [activePanel, setActivePanel] = useActivePanel()

  return (
    <div className="app">
      <Header activePanel={activePanel} setActivePanel={setActivePanel} />
      <ProcessingPanel activePanel={activePanel} />
      <EqualizerPanel activePanel={activePanel} />
    </div>
  )
}

export default App
