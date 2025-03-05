import { LoginApi } from "@shared/types"

export const login: LoginApi= async (credentials) => {
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
