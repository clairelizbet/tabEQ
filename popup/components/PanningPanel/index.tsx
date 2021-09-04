import { useContext } from 'preact/hooks'
import AppContext from '../../context'
import Panel from '../../enums/Panels'
import './panning.scss'

const PanningPanel = () => {
  const { activePanel } = useContext(AppContext)
  if (activePanel !== Panel.Panning) return null

  return (
    <section className="panel">
      <span>Panning Panel</span>
    </section>
  )
}

export default PanningPanel
