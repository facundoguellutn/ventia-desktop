const { contextBridge, ipcRenderer } = require('electron')

if (!process.contextIsolated) {
  throw new Error('Context Isolation must be enabled in a new window.')
}

try {
  contextBridge.exposeInMainWorld('context', {
    login: (credentials: { email: string; password: string }) =>
      ipcRenderer.invoke('login', credentials),
    setToken: (token: string) => ipcRenderer.invoke('setToken', token),
    getToken: () => ipcRenderer.invoke('getToken')
  })
} catch (e) {
  console.error(e)
}
