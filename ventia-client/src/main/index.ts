import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { optimizer, is, electronApp } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import { getCallHistory, getToken, login, setCallHistory, setToken } from './lib'

let mainWindow

function createWindow({ maximized = false } = {}) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: maximized ? width : 600,
    height: maximized ? height : 700,
    resizable: false,
    fullscreen: false,
    titleBarStyle: 'hidden',
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Habilitar las herramientas de desarrollo
  //mainWindow.webContents.openDevTools()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  //Actualizar la app
  console.log('Versión actual de la app:', app.getVersion())

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', () => console.log('Nueva actualización disponible.'))
  autoUpdater.on('update-not-available', () => console.log('No hay actualizaciones disponibles.'))
  autoUpdater.on('error', (err) => console.error('Error al buscar actualizaciones:', err))
  autoUpdater.on('download-progress', (progressObj) =>
    console.log(`Progreso de descarga: ${Math.round(progressObj.percent)}%`)
  )
  autoUpdater.on('update-downloaded', () => {
    console.log(
      'Actualización descargada. La aplicación se reiniciará para instalar la nueva versión.'
    )
    autoUpdater.quitAndInstall()
  })

  //Metodos de la app
  let floatingModal

  ipcMain.handle('login', async (_, credentials) => {
    const result = await login(credentials)
    if (result.success) {
      const token = result?.data?.token

      // Obtener el tamaño de pantalla
      const { width, height } = screen.getPrimaryDisplay().workAreaSize

      mainWindow.setResizable(false)
      mainWindow.setAlwaysOnTop(true, 'screen-saver')

      mainWindow.setBounds({
        titleBarStyle: 'hidden',
        titleBarOverlay: false,
        autoHideMenuBar: true,
        show: false,
        width: 40, // 30% del ancho de pantalla
        height: 90,
        x: width - 40, // Desplazado a la derecha (60% desde la izquierda)
        y: (height - 90) / 2, // Centrado verticalmente
        frame: false, // Sin borde
        alwaysOnTop: true,
        resizable: false,
        transparent: true,
        hasShadow: false,
        menuBarVisible: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })

      floatingModal = new BrowserWindow({
        x: 0,
        y: 0,
        width,
        height,
        autoHideMenuBar: true,
        title: 'Ventia',
        icon
      })
      floatingModal.center()
      floatingModal.loadURL(`https://panel.getventia.com/login?token=${token}`)
      floatingModal.show()
    }
    return result
  })

  ipcMain.handle('setToken', async (_, token) => {
    await setToken(token)
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    mainWindow.setResizable(true)
    mainWindow.setBounds({ x: 0, y: 0, width, height })
    mainWindow.center()
  })

  ipcMain.handle('getToken', async () => getToken())

  ipcMain.handle('openFloatingModal', async () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    mainWindow.setBounds({
      titleBarStyle: 'hidden',
      titleBarOverlay: false,
      autoHideMenuBar: true,
      show: false,
      width: Math.floor(width * 0.3), // 30% del ancho de pantalla
      height: Math.floor(height * 0.7), // 90% del alto
      x: Math.floor(width * 0.7), // 70% desde la izquierda
      y: (height - Math.floor(height * 0.7)) / 2, // Centrado verticalmente
      frame: false, // Sin borde
      alwaysOnTop: true,
      resizable: false,
      transparent: true,
      hasShadow: false,
      menuBarVisible: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })
  })

  ipcMain.handle('closeFloatingModal', async () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    mainWindow.setBounds({
      titleBarStyle: 'hidden',
      titleBarOverlay: false,
      autoHideMenuBar: true,
      show: false,
      width: 40, // 30% del ancho de pantalla
      height: 90,
      x: width - 40, // Desplazado a la derecha (60% desde la izquierda)
      y: (height - 90) / 2, // Centrado verticalmente
      frame: false, // Sin borde
      alwaysOnTop: true,
      resizable: false,
      transparent: true,
      hasShadow: false,
      menuBarVisible: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })
  })

  ipcMain.handle('getCallHistory', async () => getCallHistory())

  ipcMain.handle('setCallHistory', async (_, call) => setCallHistory(call))

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
