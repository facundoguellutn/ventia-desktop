import { Call } from "@shared/types";

const { contextBridge, ipcRenderer } = require('electron')

if (!process.contextIsolated) {
  throw new Error('Context Isolation must be enabled in a new window.')
}

try {
  contextBridge.exposeInMainWorld('context', {
    login: (credentials: { email: string; password: string }) =>
      ipcRenderer.invoke('login', credentials),
    setToken: (token: string) => ipcRenderer.invoke('setToken', token),
    getToken: () => ipcRenderer.invoke('getToken'),
    openFloatingModal: () => ipcRenderer.invoke('openFloatingModal'),
    closeFloatingModal: () => ipcRenderer.invoke('closeFloatingModal'),
    getCallHistory: () => ipcRenderer.invoke('getCallHistory'),
    setCallHistory: (call: Call) => ipcRenderer.invoke('setCallHistory', call),
  })
} catch (e) {
  console.error(e)
}
