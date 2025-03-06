import { ElectronAPI } from '@electron-toolkit/preload'
import { GetTokenApi, LoginApi, SetTokenApi } from '../shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      login: LoginApi,
      setToken: SetTokenApi,
      getToken: GetTokenApi
    }
  }
}
