import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import {
  Boxes,
  ClipboardList,
  Download,
  MapPin,
  Menu,
  Package,
  Tags,
  Users,
  Ruler,
  X,
} from 'lucide-react'

type Route = '/productos' | '/inventario' | '/movimientos' | '/usuarios' | '/categorias' | '/ubicaciones' | '/unidades-medida'

const navigation: { label: string; route: Route; icon: typeof Package; group: string }[] = [
  { label: 'Productos', route: '/productos', icon: Package, group: 'Operación' },
  { label: 'Inventario', route: '/inventario', icon: Boxes, group: 'Operación' },
  { label: 'Movimientos', route: '/movimientos', icon: ClipboardList, group: 'Operación' },
  { label: 'Usuarios y roles', route: '/usuarios', icon: Users, group: 'Catálogos' },
  { label: 'Categorías', route: '/categorias', icon: Tags, group: 'Catálogos' },
  { label: 'Ubicaciones', route: '/ubicaciones', icon: MapPin, group: 'Catálogos' },
  { label: 'Unidades de medida', route: '/unidades-medida', icon: Ruler, group: 'Catálogos' },
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const current = navigation.find((item) => item.route === pathname)

  const downloadBackup = async () => {
    const token = localStorage.getItem('inventory_token')
    if (!token) {
      logout()
      return
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/backup/database`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.status === 401) {
      logout()
      throw new Error('La sesión expiró')
    }
    if (!response.ok) throw new Error('No se pudo generar el respaldo')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `respaldo-inventario-${new Date().toISOString().slice(0, 10)}.sql`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div><strong>JulianCorp LLC</strong><span>Control de inventario</span></div>
          <button className="icon-button mobile-close" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X size={20} /></button>
        </div>
        {(['Operación', 'Catálogos'] as const).map((group) => (
          <div className="nav-group" key={group}>
            <p className="nav-label">{group}</p>
            {navigation.filter((item) => item.group === group && (item.route !== '/usuarios' || user?.rol === 'administrador')).map(({ label, route: itemRoute, icon: Icon }) => (
              <NavLink className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} key={itemRoute} to={itemRoute} onClick={() => setOpen(false)}>
                <Icon size={18} /><span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sidebar-footer">
          <div className="avatar">{user?.nombre.slice(0, 2).toUpperCase()}</div><div><strong>{user?.nombre}</strong><button className="logout-button" onClick={logout}>Cerrar sesión</button></div>
        </div>
      </aside>
      {open && <button className="sidebar-overlay" onClick={() => setOpen(false)} aria-label="Cerrar menú" />}
      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu size={21} /></button>
          <div><p className="eyebrow">INVENTARIO</p><h1>{current?.label ?? 'Panel'}</h1></div>
          <div className="topbar-actions">
            {user?.rol === 'administrador' && <button className="button button-secondary" type="button" onClick={() => void downloadBackup().catch(() => window.alert('No se pudo generar el respaldo de la base de datos.'))}><Download size={16} /> Respaldo BD</button>}
            <div className="topbar-status"><span className="status-dot" />{currentTime.toLocaleDateString('es-VE')}; {currentTime.toLocaleTimeString('es-VE')}</div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
