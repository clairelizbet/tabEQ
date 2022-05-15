import { StateUpdater } from 'preact/hooks'
import Panel from '../../enums/Panels'
import './panels.scss'

type PanelButtonProps = {
  panel: Panel
  label: string
  activePanel: Panel
  setActivePanel: StateUpdater<Panel>
}

const PanelButton = ({
  panel,
  label,
  activePanel,
  setActivePanel,
}: PanelButtonProps) => {
  const classList = ['panel-button']

  if (activePanel === panel) classList.push('panel-button-active')

  const buttonProps = {
    className: classList.join(' '),
    onClick: () => setActivePanel(panel),
  }

  return <button {...buttonProps}>{label}</button>
}

const PanelSelector = (props: {
  activePanel: Panel
  setActivePanel: StateUpdater<Panel>
}) => {
  const { Processing, Equalization } = Panel

  return (
    <section className="panel-selector">
      <PanelButton
        panel={Processing}
        label="Processing"
        activePanel={props.activePanel}
        setActivePanel={props.setActivePanel}
      />
      <PanelButton
        panel={Equalization}
        label="EQ"
        activePanel={props.activePanel}
        setActivePanel={props.setActivePanel}
      />
    </section>
  )
}

export default PanelSelector
