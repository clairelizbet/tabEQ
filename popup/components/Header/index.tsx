import { StateUpdater } from 'preact/hooks'
import Panel from '../../enums/Panels'
import PanelSelector from '../PanelSelector'
import './header.scss'

const Header = (props: {
  activePanel: Panel
  setActivePanel: StateUpdater<Panel>
}) => {
  return (
    <header>
      <h1 className="app-title">
        <img src="images/tabEQ.svg" alt="TabEQ" />
      </h1>
      <PanelSelector
        activePanel={props.activePanel}
        setActivePanel={props.setActivePanel}
      />
    </header>
  )
}

export default Header
