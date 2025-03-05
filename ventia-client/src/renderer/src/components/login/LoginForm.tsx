import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import ventiaLogo from './ventiaLogotipo.png'
import { useNavigate } from 'react-router-dom' 

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.'
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.'
  })
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setLoginError('')
    try {
      const result = await window.context.login(values)
      console.log('Respuesta del servidor:', result)
      if (result.success) {
        console.log('Login exitoso')
        await window.context.setToken(result?.data?.token)
        console.log('Token establecido correctamente')
        navigate('/dashboard')
      } else {
        setLoginError('Credenciales inválidas. Por favor revise el usuario o contraseña ingresados.')
        console.error('Error en el login:', result)
      }
    } catch (error) {
      setLoginError('Credenciales inválidas. Por favor revise el usuario o contraseña ingresados.')
      console.error('Error al iniciar sesión:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md px-8">
          <div className="mb-8">
            <img src={ventiaLogo} alt="Ventia app" className="w-[130px] mb-6" />
            <h1 className="text-2xl font-bold mb-1">Hola, bienvenido a Ventia 👋</h1>
            <p className="text-muted-foreground">Iniciar sesión</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Correo electrónico <span className="text-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="ejemplo@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contraseña <span className="text-primary">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} {...field} placeholder="********" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {loginError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 flex justify-between text-sm">
            <a href="#" className="text-primary hover:underline">
              Olvidaste tu contraseña?
            </a>
            <a href="#" className="text-primary hover:underline">
              No tienes cuenta?
            </a>
          </div>
        </div>
      </div>
      <div className="hidden flex-1 bg-primary md:block" />
    </div>
  )
}
