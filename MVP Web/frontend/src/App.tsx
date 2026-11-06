import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CatalogPage } from './pages/CatalogPage'
import { InventarioPage } from './pages/InventarioPage'
import { MovimientosPage } from './pages/MovimientosPage'
import { ProductosPage } from './pages/ProductosPage'
import { LoginPage } from './pages/LoginPage'
import { RequireAdmin, RequireAuth } from './auth'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/inventario" element={<InventarioPage />} />
        <Route path="/movimientos" element={<MovimientosPage />} />
        <Route path="/usuarios" element={<RequireAdmin><CatalogPage type="usuarios" /></RequireAdmin>} />
        <Route path="/categorias" element={<CatalogPage type="categorias" />} />
        <Route path="/ubicaciones" element={<CatalogPage type="ubicaciones" />} />
        <Route path="/unidades-medida" element={<CatalogPage type="unidades-medida" />} />
        <Route path="/" element={<Navigate to="/productos" replace />} />
        <Route path="*" element={<Navigate to="/productos" replace />} />
      </Route>
    </Routes>
  )
}

export default App
