import OptionalEventListener from './interfaces/OptionalEventListener'

const runOnInteractive = (fn: OptionalEventListener) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn)
  } else {
    fn()
  }
}

export default runOnInteractive
