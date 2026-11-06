import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { api, endpoints } from '../services/api'
import type { Movimiento, MovimientoTipo, Producto, Ubicacion } from '../types'
import { EmptyState, Field, Modal, PageHeader, Panel, formatDate } from '../components/Ui'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth'

interface Line { productoId: string; ubicacionId: string; cantidad: string }
type Filter = 'TODOS' | MovimientoTipo
const emptyLine = (): Line => ({ productoId: '', ubicacionId: '', cantidad: '' })
const labels: Record<MovimientoTipo, string> = { ENTRADA: 'Entrada', SALIDA: 'Salida', AJUSTE_FISICO: 'Ajuste físico' }

export function MovimientosPage() {
  const [moves, setMoves] = useState<Movimiento[]>([])
  const [products, setProducts] = useState<Producto[]>([])
  const [locations, setLocations] = useState<Ubicacion[]>([])
  const [modal, setModal] = useState(false)
  const [type, setType] = useState<MovimientoTipo>('ENTRADA')
  const [filter, setFilter] = useState<Filter>('TODOS')
  const [lines, setLines] = useState<Line[]>([emptyLine()])
  const [form, setForm] = useState({ documentoId: '', observaciones: '' })
  const [error, setError] = useState('')
  const { showToast } = useToast()
  const { user } = useAuth()

  const load = async () => {
    const [m, p, l] = await Promise.all([
      api.get<Movimiento[]>(endpoints.movimientos),
      api.get<Producto[]>(endpoints.productos),
      api.get<Ubicacion[]>(endpoints.ubicaciones),
    ])
    setMoves(m.data)
    setProducts(p.data)
    setLocations(l.data)
  }

  useEffect(() => { void load().catch(() => setError('No se pudo cargar la bitácora.')) }, [])

  const visibleMoves = useMemo(() => {
    const filtered = filter === 'TODOS' ? moves : moves.filter((move) => move.tipoMovimiento === filter)
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [moves, filter])

  const productName = (id: number) => products.find((item) => item.productoId === id)?.nombre || `Producto #${id}`

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      await api.post(endpoints.movimientos, {
        tipoMovimiento: type,
        documentoId: form.documentoId || undefined,
        observaciones: form.observaciones || undefined,
        detalles: lines.map((line) => ({
          productoId: Number(line.productoId),
          ubicacionId: Number(line.ubicacionId),
          cantidad: Number(line.cantidad),
        })),
      })
      setModal(false)
      setLines([emptyLine()])
      setForm({ documentoId: '', observaciones: '' })
      await load()
      showToast('Movimiento procesado correctamente', 'success')
    } catch {
      setError('La operación no pudo completarse. Verifica el stock y los datos.')
      showToast('Movimiento rechazado: stock insuficiente o datos inválidos', 'error')
    }
  }

  return (
    <>
      <PageHeader title="Movimientos" description="Bitácora de entradas, salidas y ajustes físicos." action={() => setModal(true)} />
      <Panel>
        <div className="panel-toolbar">
          <strong>{visibleMoves.length} movimientos</strong>
          <div className="movement-filters">
            {(['TODOS', 'ENTRADA', 'SALIDA', 'AJUSTE_FISICO'] as Filter[]).map((value) => (
              <button key={value} type="button" className={`badge filter-badge ${filter === value ? 'filter-active' : ''} ${value === 'ENTRADA' ? 'badge-success' : value === 'SALIDA' ? 'badge-danger' : value === 'AJUSTE_FISICO' ? 'badge-warning' : 'badge-muted'}`} onClick={() => setFilter(value)}>
                {value === 'TODOS' ? 'Todos' : labels[value as MovimientoTipo]}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tipo</th><th>Documento</th><th>Usuario</th><th>Producto y trazabilidad</th><th>Fecha</th></tr></thead>
            <tbody>
              {visibleMoves.map((move) => (
                <tr key={move.movimientoId}>
                  <td><span className={`badge ${move.tipoMovimiento === 'ENTRADA' ? 'badge-success' : move.tipoMovimiento === 'SALIDA' ? 'badge-danger' : 'badge-warning'}`}>{labels[move.tipoMovimiento]}</span></td>
                  <td className="mono">{move.documentoId || '—'}</td>
                  <td>{move.usuario?.nombre || '—'}</td>
                  <td><div className="movement-details">{move.detalles?.map((detail) => { const anterior = detail.stockAnterior ?? 0; const nuevo = detail.stockNuevo ?? anterior; const delta = nuevo - anterior; return <div key={detail.detalleId}><strong>{detail.producto?.nombre || productName(detail.producto?.productoId || 0)}</strong><span className="sub-cell">Stock: {anterior} ➔ {nuevo} <b className={delta >= 0 ? 'stock-increase' : 'stock-decrease'}>({delta >= 0 ? '+' : ''}{delta})</b></span></div> })}</div></td>
                  <td>{formatDate(move.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleMoves.length === 0 && <EmptyState text="No hay movimientos para este filtro." />}
        </div>
      </Panel>
      {modal && <Modal title="Registrar movimiento" onClose={() => setModal(false)} onSubmit={submit} submitLabel="Procesar operación"><div className="form-grid two-col"><Field label="Tipo de movimiento"><select value={type} onChange={(e) => setType(e.target.value as MovimientoTipo)}><option value="ENTRADA">Entrada</option><option value="SALIDA">Salida</option><option value="AJUSTE_FISICO">Ajuste físico</option></select></Field><Field label="Documento"><input minLength={2} placeholder="OC-0001" value={form.documentoId} onChange={(e) => setForm({ ...form, documentoId: e.target.value })} /></Field><Field label="Usuario responsable"><input readOnly value={user?.nombre ?? ''} /></Field><Field label="Observaciones"><input minLength={2} value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} /></Field></div><div className="line-items-header"><strong>Ítems de la operación</strong><button type="button" className="button button-secondary button-small" onClick={() => setLines([...lines, emptyLine()])}><Plus size={15} /> Añadir ítem</button></div>{lines.map((line, index) => <div className="line-item" key={index}><select required value={line.productoId} onChange={(e) => setLines(lines.map((item, i) => i === index ? { ...item, productoId: e.target.value } : item))}><option value="">Producto</option>{products.map((product) => <option key={product.productoId} value={product.productoId}>{product.nombre}</option>)}</select><select required value={line.ubicacionId} onChange={(e) => setLines(lines.map((item, i) => i === index ? { ...item, ubicacionId: e.target.value } : item))}><option value="">Ubicación</option>{locations.map((location) => <option key={location.ubicacionId} value={location.ubicacionId}>{location.codigoEstante}</option>)}</select><input required min={type === 'AJUSTE_FISICO' ? 0 : 1} type="number" placeholder="Cantidad" value={line.cantidad} onChange={(e) => setLines(lines.map((item, i) => i === index ? { ...item, cantidad: e.target.value } : item))} />{lines.length > 1 && <button type="button" className="icon-button danger-icon" onClick={() => setLines(lines.filter((_, i) => i !== index))} aria-label="Eliminar ítem"><Trash2 size={17} /></button>}</div>)}</Modal>}
    </>
  )
}
