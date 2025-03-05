export type LoginApi = (credentials: { email: string; password: string }) => Promise<{
  success: boolean
  data?: any
  error?: string
}>

export type SetTokenApi = (token: string) => void
