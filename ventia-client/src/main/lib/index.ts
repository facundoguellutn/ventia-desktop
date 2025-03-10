import {
  GetCallHistoryApi,
  GetTokenApi,
  LoginApi,
  SetCallHistoryApi,
  SetTokenApi
} from '@shared/types'
import { session, app } from 'electron'
const fs = require('fs')
const path = require('path')

// Ruta al archivo donde se guardará el historial
const filePath = path.join(app.getPath('userData'), 'callHistory.json')

export const login: LoginApi = async (credentials) => {
  try {
    const response = await fetch('https://panel.getventia.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        ...credentials,
        fcm_token: null
      })
    })

    const data = await response.json()
    return { success: response.ok, data }
  } catch (error: any) {
    console.error('Error en el proceso principal:', error)
    return { success: false, error: error.message }
  }
}

export const setToken: SetTokenApi = async (token) => {
  try {
    await session.defaultSession.cookies.set({
      url: 'http://localhost:5173',
      name: 'token',
      value: token,
      path: '/',
      secure: false,
      httpOnly: false
    })
    console.log('Token establecido correctamente')
  } catch (error: any) {
    console.error('Error al establecer el token:', error)
  }
}

export const getToken: GetTokenApi = async () => {
  try {
    const cookies = await session.defaultSession.cookies.get({ name: 'token' })
    return cookies.length ? cookies[0].value : null
  } catch (error: any) {
    console.error('Error al establecer el token:', error)
    return null
  }
}

const ensureFileExists = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]))
  }
}

export const getCallHistory: GetCallHistoryApi = async () => {
  try {
    ensureFileExists()
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading call history:', err)
    return []
  }
}

export const setCallHistory: SetCallHistoryApi = async (newCall) => {
  try {
    ensureFileExists()
    const data = fs.readFileSync(filePath, 'utf8')
    const callHistory = JSON.parse(data)
    callHistory.push(newCall)
    fs.writeFileSync(filePath, JSON.stringify(callHistory, null, 2))
    //fs.writeFileSync(filePath, JSON.stringify([], null, 2))
    return true
  } catch (err) {
    console.error('Error saving call:', err)
    return false
  }
}
