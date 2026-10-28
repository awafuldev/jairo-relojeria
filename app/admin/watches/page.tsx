'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface WatchItem {
  id: string
  slug: string
  name: string
  reference: string | null
  caliber: string | null
  price: number
  stock: number
  isAvailable: boolean
  isFeatured: boolean
  mainImage: string
}

export default function AdminWatchesPage() {
  const [watches, setWatches] = useState<WatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)

  const loadWatches = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/watches')
      if (res.ok) {
        const data = await res.json()
        setWatches(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWatches()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el reloj "${name}"?`)) return
    try {
      const res = await fetch(`/api/admin/watches/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setWatches(prev => prev.filter(w => w.id !== id))
        showFeedback(`Reloj "${name}" eliminado del catálogo.`)
      } else {
        alert('Error al eliminar el reloj')
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión')
    }
  }

  const toggleAvailability = async (watch: WatchItem) => {
    try {
      const updated = !watch.isAvailable
      const res = await fetch(`/api/admin/watches/${watch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...watch,
          isAvailable: updated,
        }),
      })
      if (res.ok) {
        setWatches(prev =>
          prev.map(w => (w.id === watch.id ? { ...w, isAvailable: updated } : w))
        )
        showFeedback(`Estado de "${watch.name}" actualizado a ${updated ? 'Publicado' : 'Oculto'}.`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Boutique Oficial · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Relojes Seiko Ensamblados ({watches.length})
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Modelos completos listados para compra directa en la tienda online.
          </p>
        </div>

        <Link href="/admin/watches/new" className="admin-btn admin-btn-primary self-start">
          + Nuevo Reloj Seiko
        </Link>
      </div>

      {feedback && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-[13px] rounded-[4px] flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-green-950 font-bold">✕</button>
        </div>
      )}

      {loading ? (
        <div className="admin-card admin-empty">
          <p className="admin-empty-title">Cargando inventario de boutique...</p>
        </div>
      ) : watches.length === 0 ? (
        <div className="admin-card admin-empty">
          <p className="admin-empty-title">No hay relojes registrados en la tienda</p>
          <div className="mt-4">
            <Link href="/admin/watches/new" className="admin-btn admin-btn-primary">
              Crear el primer reloj Seiko →
            </Link>
          </div>
        </div>
      ) : (
        <div className="admin-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">Foto</th>
                  <th>Modelo & Referencia</th>
                  <th>Calibre / Movimiento</th>
                  <th>Precio Venta</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e4e2]">
                {watches.map(w => (
                  <tr key={w.id} className="hover:bg-[#fafaf9] transition-colors">
                    <td className="w-16">
                      <div className="w-12 h-12 bg-[#f5f4f2] border border-[#e5e4e2] rounded-[3px] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={w.mainImage} alt={w.name} className="w-full h-full object-contain" />
                      </div>
                    </td>

                    <td>
                      <p className="font-medium text-[#1c1917]">{w.name}</p>
                      {w.reference && (
                        <p className="font-mono text-[11px] text-[#78716c]">Ref: {w.reference}</p>
                      )}
                    </td>

                    <td className="text-[#78716c] text-[12px]">
                      {w.caliber ? w.caliber.split('(')[0] : '—'}
                    </td>

                    <td>
                      <span className="font-mono font-bold text-[#1c1917] tabular-nums">
                        ${w.price.toFixed(0)} <span className="font-cabin text-[10px] text-[#78716c]">USD</span>
                      </span>
                    </td>

                    <td className="text-center font-mono text-[12px] font-semibold text-[#1c1917]">
                      {w.stock} uds.
                    </td>

                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(w)}
                        className={`text-[9px] font-cabin uppercase tracking-wider px-2 py-0.5 rounded-[2px] font-bold border transition-colors cursor-pointer ${
                          w.isAvailable
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-[#e5e4e2] text-[#78716c] border-[#d5d6d7]'
                        }`}
                      >
                        {w.isAvailable ? 'Publicado' : 'Oculto'}
                      </button>
                    </td>

                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/catalog/${w.slug}`}
                          target="_blank"
                          className="admin-btn admin-btn-secondary text-[10px] py-1 px-2"
                          title="Ver en tienda"
                        >
                          ↗
                        </Link>
                        <Link
                          href={`/admin/watches/${w.id}`}
                          className="admin-btn admin-btn-secondary text-[10px] py-1 px-2.5"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(w.id, w.name)}
                          className="text-[11px] text-[#991b1b] hover:underline px-1"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
