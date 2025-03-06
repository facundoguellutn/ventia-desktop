import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import { getToken, login, setToken } from './lib'

let mainWindow

function createWindow({ maximized = false } = {}) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: maximized ? width : 600,
    height: maximized ? height : 700,
    resizable: maximized,
    fullscreen: false,
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

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

  let floatingModal

  ipcMain.handle('login', async (_, credentials) => {
    // const result = await login(credentials);
    // if (result.success) {

    //   const token = result?.data?.token;
    //   await mainWindow.loadURL(`https://panel.getventia.com/login?token=${token}`);
    //   const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    //   mainWindow.setResizable(true);
    //   mainWindow.setBounds({ x: 0, y: 0, width, height });
    //   mainWindow.center();
    //   createFloatingModal();

    // }
    // return result;
    const result = await login(credentials)
    if (result.success) {
      const token = result?.data?.token

      // Obtener el tamaño de pantalla
      const { width, height } = screen.getPrimaryDisplay().workAreaSize

      // Crear la ventana principal que carga el contenido
      mainWindow.setBounds({
        width: width * 0.3, // 30% del ancho de pantalla
        height: 400,
        x: 0, // Aparece a la izquierda
        y: 0,
        frame: false, // Sin borde
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })

      // Crear la ventana flotante (el modal negro a la izquierda)
      floatingModal = new BrowserWindow({
        x: 0,
        y: 0,
        width,
        height
      })
      floatingModal.center();

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

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
