import browser from 'webextension-polyfill'
import ResetControlButton from '../ResetControlButton'
import Panel from '../../enums/Panels'
import { SavedSiteSettings } from '../../../util/storage'
import { useEffect, useState } from 'preact/hooks'

const ProcessingPanel = (props: { activePanel: Panel }) => {
  if (props.activePanel !== Panel.Processing) return null

  const [currentTab, setCurrentTab] = useState(
    undefined as browser.Tabs.Tab | undefined
  )
  const [tabSettings, setTabSettings] = useState({} as SavedSiteSettings)
  const [connectionState, setConnectionState] = useState(
    'connecting' as 'connecting' | 'connected' | Error
  )

  if (!currentTab) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0]
      setCurrentTab(tab)
      if (typeof tab?.id === 'undefined') return

      browser.tabs
        .sendMessage(tab.id, { type: 'getStatus' })
        .then((response: SavedSiteSettings) => {
          setTabSettings(response)
          setConnectionState('connected')
        })
        .catch((err: Error) => {
          setConnectionState(err)
        })
    })
  }

  useEffect(() => {
    if (typeof currentTab?.id === 'undefined') return

    // TODO: update stored settings for this site to reflect

    browser.tabs.sendMessage(currentTab.id, {
      type: 'settingsUpdate',
      settings: tabSettings,
    })
  }, [tabSettings])

  function updateSetting(key: keyof SavedSiteSettings, value: any) {
    setTabSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }))
  }

  interface ControlInputEvent extends InputEvent {
    target: HTMLInputElement
  }

  function handleVolumeChange(e: Event) {
    updateSetting('volume', parseFloat((e as ControlInputEvent).target.value))
  }

  function handleCompressorChange(e: Event) {
    if (parseFloat((e as ControlInputEvent).target.value) < 1) {
      updateSetting('compressDynamicRange', false)
    } else {
      updateSetting(
        'compressDynamicRange',
        parseFloat((e as ControlInputEvent).target.value)
      )
    }
  }

  function handleCompressionReset() {
    updateSetting('compressDynamicRange', false)
  }

  function handleVolumeReset() {
    updateSetting('volume', 1)
  }

  function handlePanChange(e: Event) {
    updateSetting('pan', parseFloat((e as ControlInputEvent).target.value))
  }

  function handlePanReset() {
    updateSetting('pan', 0)
  }

  if (connectionState === 'connecting') {
    return <section className="panel">Connecting to page...</section>
  }

  if (connectionState instanceof Error) {
    const errorDescriptionsGenerators = [
      (e: Error) =>
        e.message.startsWith('Could not establish connection')
          ? 'Could not connect to tab'
          : null,
    ]

    const descriptionGen = errorDescriptionsGenerators.find((gen) =>
      gen(connectionState)
    )

    const description = descriptionGen
      ? descriptionGen(connectionState)
      : connectionState.message

    return (
      <section className="panel">
        <p></p>&#x26A0; Unavailable
        <hr />
        <p>{description}</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <form>
        <fieldset className="control-group">
          <legend>Volume</legend>
          <div className="control">
            <datalist id="volume-detents">
              <option value="1.0">100%</option>
            </datalist>
            <input
              type="range"
              aria-label="volume"
              list="volume-detents"
              min="0"
              max="3"
              step=".01"
              value={tabSettings.volume}
              onInput={handleVolumeChange}
            />
            <ResetControlButton
              onClick={handleVolumeReset}
              disabled={tabSettings.volume === 1}
            />
          </div>
        </fieldset>

        <fieldset className="control-group">
          <legend>Pan</legend>
          <div className="control">
            <datalist id="pan-detents">
              <option value="-.5">-50%</option>
              <option value="0.0">0%</option>
              <option value="0.5">+50%</option>
            </datalist>
            <input
              type="range"
              aria-label="panning"
              list="pan-detents"
              min="-1"
              max="1"
              step=".01"
              value={tabSettings.pan}
              onInput={handlePanChange}
            />
            <ResetControlButton
              onClick={handlePanReset}
              disabled={tabSettings.pan === 0}
            />
          </div>
        </fieldset>

        <fieldset className="control-group">
          <legend>Compression</legend>
          <div className="control">
            <datalist id="compressor-detents">
              <option value="10">50%</option>
            </datalist>
            <input
              type="range"
              aria-label="compressor"
              list="compressor-detents"
              min="0"
              max="20"
              step=".01"
              value={tabSettings.compressDynamicRange || 0}
              onChange={handleCompressorChange}
            />
            <ResetControlButton
              onClick={handleCompressionReset}
              disabled={tabSettings.compressDynamicRange === false}
            />
          </div>
        </fieldset>
      </form>
    </section>
  )
}

export default ProcessingPanel
