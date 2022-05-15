import { JSXInternal } from 'preact/src/jsx'
import './reset-btn.scss'

const ResetControlButton = (props: {
  onClick: JSXInternal.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}) => {
  return (
    <button
      title="Restore Default"
      disabled={props.disabled}
      onClick={props.onClick}
      type="button"
      className="reset-button"
    >
      &#8634;
    </button>
  )
}

export default ResetControlButton
