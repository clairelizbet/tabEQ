import { useContext } from 'preact/hooks'
import AppContext from '../../context'
import Panel from '../../enums/Panels'
import './panning.scss'

const PanningPanel = () => {
  const { activePanel } = useContext(AppContext)
  if (activePanel !== Panel.Panning) return null

  return (
    <header>
      <span>Panning Panel</span>
    </header>
  )
}

export default PanningPanel
