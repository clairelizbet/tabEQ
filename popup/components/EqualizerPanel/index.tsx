import Panel from '../../enums/Panels'
import './equalizer.scss'

const EqualizerPanel = (props: { activePanel: Panel }) => {
  if (props.activePanel !== Panel.Equalization) return null

  return (
    <section className="panel">
      <p>
        <span>coming soon lol</span>
      </p>
      <p className="signature-para">
        <span>
          &#128156;
          <a
            href="https://twitter.com/clairelizbet"
            target="_blank"
            rel="noreferrer noopener"
          >
            claire
          </a>
        </span>
      </p>
    </section>
  )
}

export default EqualizerPanel
