import { Context, createContext } from 'preact'
import {
  AppSettings,
  defaultSettings,
  settingUpdaters,
} from '../../util/storage'

const AppContext: Context<AppSettings> = createContext({
  ...defaultSettings,
  ...settingUpdaters,
})

export default AppContext
