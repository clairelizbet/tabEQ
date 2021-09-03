import { useState, useEffect, StateUpdater } from 'preact/hooks'
import browser from 'webextension-polyfill'
import Panel from '../popup/enums/Panels'

type AppSettings = {
  activePanel: Panel
  setActivePanel: (activePanel: Panel) => void
}

const defaultSettings = {
  activePanel: Panel.Volume,
}

const setActivePanel = (activePanel: Panel) => {
  browser.storage.sync.set({ activePanel })
}

const settingUpdaters = { setActivePanel }

const getSettings = async (): Promise<AppSettings> => {
  const settings = await browser.storage.sync.get()

  return { ...settings, ...defaultSettings, ...settingUpdaters }
}

type PanelStateTuple = [Panel, (activePanel: Panel) => void]
const useActivePanel = (activePanel: Panel): PanelStateTuple => {
  const [activePanelState, setActivePanelState] = useState(activePanel)

  const setAndStoreActivePanelState = (activePanel: Panel) => {
    setActivePanelState(activePanel)
    setActivePanel(activePanel)
  }

  return [activePanelState, setAndStoreActivePanelState]
}

export {
  AppSettings,
  getSettings,
  defaultSettings,
  settingUpdaters,
  useActivePanel,
}
