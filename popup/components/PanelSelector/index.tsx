import { useContext } from 'preact/hooks'
import AppContext from '../../context'
import Panel from '../../enums/Panels'
import './panels.scss'

type PanelButtonProps = { panel: Panel; label: string }
const PanelButton = ({ panel, label }: PanelButtonProps) => {
  const { activePanel, setActivePanel } = useContext(AppContext)
  const classList = ['panel-button']

  if (activePanel === panel) classList.push('panel-button-active')

  const buttonProps = {
    className: classList.join(' '),
    onClick: () => setActivePanel(panel),
  }

  return <button {...buttonProps}>{label}</button>
}

const PanelSelector = () => {
  const { Volume, Panning, Equalization } = Panel

  return (
    <section className="panels">
      <PanelButton panel={Volume} label="Volume" />
      <PanelButton panel={Panning} label="Panning" />
      <PanelButton panel={Equalization} label="Equalizer" />
    </section>
  )
}

export default PanelSelector
