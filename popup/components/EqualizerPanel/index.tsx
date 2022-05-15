import { useActivePanel } from '../../../util/storage'
import Panel from '../../enums/Panels'
import './equalizer.scss'

const EqualizerPanel = (props: { activePanel: Panel }) => {
  if (props.activePanel !== Panel.Equalization) return null

  return (
    <section className="panel">
      <span>coming soon lol &#128156;</span>
    </section>
  )
}

export default EqualizerPanel
