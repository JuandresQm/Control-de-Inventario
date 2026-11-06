import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import '../App.css'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [nombre, setNombre] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  if (user) return <Navigate to="/productos" replace />

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      await login(nombre, clave)
      const destination = (location.state as { from?: string } | null)?.from ?? '/productos'
      navigate(destination, { replace: true })
    } catch {
      setError('Usuario o contraseña incorrectos.')
    }
  }

return <main className="login-page"><form className="login-card" onSubmit={submit}><div><strong style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>JulianCorp LLC</strong><br /><span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Control de inventario</span></div><h1>Bienvenido</h1><p className="muted">Ingresa tus credenciales para continuar.</p>{error && <p className="error-message">{error}</p>}<label className="field"><span>Usuario</span><input required minLength={3} autoComplete="username" value={nombre} onChange={(event) => setNombre(event.target.value)} /></label><label className="field"><span>Contraseña</span><div className="password-input"><input required minLength={4} type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={clave} onChange={(event) => setClave(event.target.value)} /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><button className="button button-primary login-button" type="submit">Ingresar</button><small className="login-hint">Administrador: admin / admin</small></form></main>
}
