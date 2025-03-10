import { ElectronAPI } from '@electron-toolkit/preload'
import { GetTokenApi, LoginApi, SetTokenApi,CloseFloatingModalApi, GetCallHistoryApi, SetCallHistoryApi } from '../shared/types'

declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      login: LoginApi,
      setToken: SetTokenApi,
      getToken: GetTokenApi,
      openFloatingModal: OpenFloatingModalApi,
      closeFloatingModal: CloseFloatingModalApi,
      getCallHistory: GetCallHistoryApi,
      setCallHistory: SetCallHistoryApi,
    }
  }
}
