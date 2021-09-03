import PanelSelector from '../PanelSelector'
import './header.scss'

const Header = () => {
  return (
    <header>
      <h1 className="app-title">TabEQ</h1>
      <PanelSelector />
    </header>
  )
}

export default Header
