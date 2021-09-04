import { useContext } from 'preact/hooks'
import AppContext from '../../context'
import Panel from '../../enums/Panels'
import './equalizer.scss'

const EqualizerPanel = () => {
  const { activePanel } = useContext(AppContext)
  if (activePanel !== Panel.Equalization) return null

  return (
    <section className="panel">
      <span>Equalizer Panel</span>
    </section>
  )
}

export default EqualizerPanel
