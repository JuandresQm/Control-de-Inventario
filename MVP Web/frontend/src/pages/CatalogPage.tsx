import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import { api, endpoints } from '../services/api'
import type { Categoria, Rol, Ubicacion, Usuario, UnidadMedida } from '../types'
import { EmptyState, Field, Modal, PageHeader, Panel, SearchBox } from '../components/Ui'
import { useToast } from '../components/Toast'

type CatalogType = 'categorias' | 'ubicaciones' | 'usuarios' | 'unidades-medida'
type CatalogItem = Categoria | Ubicacion | Usuario | UnidadMedida

export function CatalogPage({ type }: { type: CatalogType }) {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [roles, setRoles] = useState<Rol[]>([])
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<CatalogItem | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { showToast } = useToast()

  const title = type === 'usuarios' ? 'Usuarios y roles' : type === 'unidades-medida' ? 'Unidades de medida' : type[0].toUpperCase() + type.slice(1)
  const description = type === 'usuarios'
    ? 'Administra el acceso operativo y los roles asignados.'
    : type === 'categorias'
      ? 'Clasifica tus productos para encontrarlos más rápido.'
      : type === 'unidades-medida'
        ? 'Administra las unidades disponibles para tus productos.'
        : 'Gestiona los estantes y zonas físicas del almacén.'

  const load = async () => {
    const response = await api.get<CatalogItem[]>(endpoints[type])
    setItems(response.data)
    if (type === 'usuarios') {
      setRoles((await api.get<Rol[]>(endpoints.roles)).data)
    }
  }

  useEffect(() => {
    void load().catch(() => setError('No se pudo cargar la información.'))
  }, [type])

  const filtered = useMemo(
    () => items.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())),
    [items, query],
  )

  const idOf = (item: CatalogItem) => (
    'categoriaId' in item ? item.categoriaId
      : 'ubicacionId' in item ? item.ubicacionId
        : 'usuarioId' in item ? item.usuarioId
          : item.unidadId
  )

  const openEdit = (item: CatalogItem) => {
    setEditing(item)
    if (type === 'categorias' || type === 'unidades-medida') {
      const namedItem = item as Categoria | UnidadMedida
      setForm({ nombre: namedItem.nombre })
    } else if (type === 'ubicaciones') {
      const ubicacion = item as Ubicacion
      setForm({ codigoEstante: ubicacion.codigoEstante, descripcion: ubicacion.descripcion || '' })
    } else {
      const usuario = item as Usuario
      setForm({
        nombre: usuario.nombre,
        rolId: String(usuario.rol?.rolId || ''),
        estado: String(usuario.estado),
        clave: '',
      })
    }
    setModal(true)
  }

  const remove = async (item: CatalogItem) => {
    if (!window.confirm('¿Deseas eliminar este registro?')) return
    try {
      await api.delete(`${endpoints[type]}/${idOf(item)}`)
      await load()
      showToast('Registro eliminado correctamente', 'success')
    } catch {
      showToast('No se pudo eliminar. Puede tener registros relacionados.', 'error')
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      const payload = type === 'categorias' || type === 'unidades-medida'
        ? { nombre: form.nombre }
        : type === 'ubicaciones'
          ? { codigoEstante: form.codigoEstante, descripcion: form.descripcion || undefined }
          : {
              nombre: form.nombre,
              ...(form.clave ? { clave: form.clave } : {}),
              rolId: Number(form.rolId),
              estado: form.estado !== 'false',
            }

      if (editing) {
        await api.patch(`${endpoints[type]}/${idOf(editing)}`, payload)
      } else {
        await api.post(endpoints[type], payload)
      }

      setModal(false)
      setEditing(null)
      setForm({})
      await load()
      showToast('Registro guardado correctamente', 'success')
    } catch {
      setError('No se pudo guardar el registro. Verifica los datos e inténtalo de nuevo.')
      showToast('No se pudo guardar el registro', 'error')
    }
  }

  const closeModal = () => {
    setModal(false)
    setEditing(null)
    setForm({})
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={() => { setEditing(null); setForm({}); setModal(true) }}
      />
      <Panel>
        <div className="panel-toolbar">
          <strong>{filtered.length} registros</strong>
          <SearchBox value={query} onChange={setQuery} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {type === 'categorias' || type === 'unidades-medida'
                  ? <><th>Nombre</th><th>ID</th></>
                  : type === 'ubicaciones'
                    ? <><th>Código de estante</th><th>Descripción</th></>
                    : <><th>Usuario</th><th>Rol</th><th>Estado</th></>}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const categoria = item as Categoria
                const unidad = item as UnidadMedida
                const ubicacion = item as Ubicacion
                const usuario = item as Usuario
                return (
                  <tr key={idOf(item)}>
                    {type === 'categorias'
                      ? <><td><strong>{categoria.nombre}</strong></td><td className="mono">#{categoria.categoriaId}</td></>
                      : type === 'unidades-medida'
                        ? <><td><strong>{unidad.nombre}</strong></td><td className="mono">#{unidad.unidadId}</td></>
                        : type === 'ubicaciones'
                          ? <><td><span className="code-chip">{ubicacion.codigoEstante}</span></td><td>{ubicacion.descripcion || '—'}</td></>
                          : <><td><strong>{usuario.nombre}</strong></td><td>{usuario.rol?.nombre || 'Sin asignar'}</td><td><span className={`badge ${usuario.estado ? 'badge-success' : 'badge-muted'}`}>{usuario.estado ? 'Activo' : 'Inactivo'}</span></td></>}
                    <td>
                      <div className="row-actions">
                        <button className="icon-button" type="button" onClick={() => openEdit(item)} aria-label="Editar"><Pencil size={16} /></button>
                        <button className="icon-button danger-icon" type="button" onClick={() => void remove(item)} aria-label="Borrar"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState />}
        </div>
      </Panel>

      {modal && (
        <Modal
          title={`${editing ? 'Editar' : 'Nuevo'} ${type === 'usuarios' ? 'usuario' : type === 'ubicaciones' ? 'ubicación' : type === 'unidades-medida' ? 'unidad de medida' : 'categoría'}`}
          onClose={closeModal}
          onSubmit={submit}
        >
          <div className="form-grid">
            {(type === 'categorias' || type === 'unidades-medida') && (
              <Field label="Nombre">
                <input required minLength={type === 'categorias' ? 3 : 2} maxLength={type === 'unidades-medida' ? 20 : 100} value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </Field>
            )}
            {type === 'ubicaciones' && (
              <>
                <Field label="Código de estante"><input required minLength={2} maxLength={50} value={form.codigoEstante || ''} onChange={(e) => setForm({ ...form, codigoEstante: e.target.value })} /></Field>
                <Field label="Descripción"><textarea minLength={2} value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></Field>
              </>
            )}
            {type === 'usuarios' && (
              <>
                <Field label="Nombre"><input required minLength={3} maxLength={100} value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></Field>
                <Field label="Clave">
                  <div className="password-input">
                    <input required={!editing} minLength={editing ? undefined : 4} type={showPassword ? 'text' : 'password'} value={form.clave || ''} onChange={(e) => setForm({ ...form, clave: e.target.value })} />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                  </div>
                </Field>
                <Field label="Rol">
                  <select required value={form.rolId || ''} onChange={(e) => setForm({ ...form, rolId: e.target.value })}>
                    <option value="">Selecciona un rol</option>
                    {roles.map((role) => <option key={role.rolId} value={role.rolId}>{role.nombre}</option>)}
                  </select>
                </Field>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}