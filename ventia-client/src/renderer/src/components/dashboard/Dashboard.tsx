import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getToken = async () => {
    console.log('getToken')
    const token = await window.context.getToken()
    if (token) {
      setToken(token)
      setLoading(false)
    } else {
      setError('No se pudo obtener el token')
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  if (error) {
    return <div className="w-full h-screen">{error}</div>
  }

  if (loading) {
    return <div className="w-full h-screen">Cargando...</div>
  }

  return (
    <div className="w-full h-screen">
      {/*<h1>Dashboard con token: {token}</h1>*/}
      <iframe
        src={`https://panel.getventia.com/login?token=${token}`}
        title="Dashboard"
        className="w-full h-full"
        style={{ border: 'none' }}
      ></iframe>
    </div>
  )
}
