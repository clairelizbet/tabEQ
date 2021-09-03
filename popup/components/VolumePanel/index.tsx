import { useContext } from 'preact/hooks'
import AppContext from '../../context'
import Panel from '../../enums/Panels'
import './volume.scss'

const VolumePanel = () => {
  const { activePanel } = useContext(AppContext)
  if (activePanel !== Panel.Volume) return null

  return (
    <header>
      <span>hewwo, welcome to tabEQ!</span>
    </header>
  )
}

export default VolumePanel