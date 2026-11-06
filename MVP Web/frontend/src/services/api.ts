import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('inventory_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const endpoints = {
  roles: '/roles',
  usuarios: '/usuarios',
  categorias: '/categorias',
  ubicaciones: '/ubicaciones',
  productos: '/productos',
  inventario: '/inventario',
  movimientos: '/movimientos',
  unidadesMedida: '/unidades-medida',
  'unidades-medida': '/unidades-medida',
} as const
