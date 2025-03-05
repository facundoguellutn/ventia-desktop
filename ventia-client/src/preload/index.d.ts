import { ElectronAPI } from '@electron-toolkit/preload'
import { LoginApi } from '../shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      login: LoginApi
    }
  }
}
