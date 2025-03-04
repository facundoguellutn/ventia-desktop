const { contextBridge, ipcRenderer } = require('electron')

if (!process.contextIsolated) {
  throw new Error('Context Isolation must be enabled in a new window.')
}

try {
  contextBridge.exposeInMainWorld('context', {
    //TODO: Add API here
  })
} catch (e) {
  console.error(e)
}
