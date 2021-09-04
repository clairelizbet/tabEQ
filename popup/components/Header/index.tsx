import PanelSelector from '../PanelSelector'
import './header.scss'

const Header = () => {
  return (
    <header>
      <h1 className="app-title">
        <img src="images/tabEQ.svg" alt="TabEQ" />
      </h1>
      <PanelSelector />
    </header>
  )
}

export default Header
