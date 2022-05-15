import { useState, useEffect, StateUpdater } from 'preact/hooks'
import browser from 'webextension-polyfill'
import Panel from '../../popup/enums/Panels'

type SavedSiteSettings = {
  volume?: number
  normalizeLoudness?: number | false
  compressDynamicRange?: number | false

  pan?: number
  normalizeChannels?: boolean

  equalization?: Array<[number, number]>
}

type SiteSettings = Map<string, SavedSiteSettings>

type AppSettings = {
  activePanel: Panel
  siteSettings: SiteSettings
}

type StateTuple<T> = [T, StateUpdater<T>]

let settings: AppSettings = {
  activePanel: Panel.Processing,
  siteSettings: new Map(),
}

const hydrateSettings = async () => {
  const savedSettings = await browser.storage.sync.get()
  settings = { ...settings, ...savedSettings }
}

const useActivePanel = (): StateTuple<Panel> => {
  const [activePanel, setActivePanel] = useState(settings.activePanel)

  useEffect(() => {
    browser.storage.sync.set({ activePanel })
  }, [activePanel])

  return [activePanel, setActivePanel]
}

const useSiteSettings = (): StateTuple<SiteSettings> => {
  const [siteSettings, setSiteSettings] = useState(settings.siteSettings)

  useEffect(() => {
    browser.storage.sync.set({ siteSettings })
  }, [siteSettings])

  return [siteSettings, setSiteSettings]
}

export { AppSettings, SavedSiteSettings, hydrateSettings }
export { useActivePanel, useSiteSettings }
