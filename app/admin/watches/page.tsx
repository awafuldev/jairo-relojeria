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
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8 max-w-6xl font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-[#1dd8e1] font-semibold block mb-1">
            Inventario de Tienda
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em]">
            Relojes Seiko ({watches.length})
          </h1>
          <p className="text-[13px] text-[#2e3438] mt-1">
            Gestiona los modelos completos que se venden directamente a través del catálogo de la tienda.
          </p>
        </div>

        <Link href="/admin/watches/new" className="btn-teal self-start text-[11px] py-2.5 px-4">
          + Nuevo Reloj Seiko
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[13px] text-[#2e3438]">
          Cargando inventario de relojes...
        </div>
      ) : watches.length === 0 ? (
        <div className="p-12 text-center bg-[#f7f7f7] border border-[#d5d6d7] rounded-[3px]">
          <p className="font-poppins text-[14px] text-[#0a0d0f]">No hay relojes registrados en la tienda.</p>
          <div className="mt-4">
            <Link href="/admin/watches/new" className="btn-teal text-[11px]">
              Crear el primer reloj Seiko
            </Link>
          </div>
        </div>
      ) : (
        <div className="border border-[#d5d6d7] rounded-[3px] bg-[#ffffff] overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#f7f7f7] border-b border-[#d5d6d7] font-cabin text-[10px] uppercase tracking-[0.1em] text-[#2e3438]">
              <tr>
                <th className="py-3.5 px-4">Reloj</th>
                <th className="py-3.5 px-4">Calibre</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7f7f7]">
              {watches.map(w => (
                <tr key={w.id} className="hover:bg-[#fbfbfb] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f7f7f7] border border-[#d5d6d7] rounded-[2px] p-1 flex items-center justify-center shrink-0">
                        <img src={w.mainImage} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0a0d0f]">{w.name}</p>
                        {w.reference && (
                          <p className="font-mono text-[10px] text-[#2e3438]">Ref: {w.reference}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#2e3438] text-[12px]">
                    {w.caliber ? w.caliber.split('(')[0] : '—'}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-[#0a0d0f]">
                    ${w.price.toFixed(0)} USD
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-[12px]">
                    {w.stock}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(w)}
                      className={`font-cabin text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] font-bold border transition-colors ${
                        w.isAvailable
                          ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                          : 'bg-[#f3f4f6] text-[#6b7280] border-[#d1d5db]'
                      }`}
                    >
                      {w.isAvailable ? 'Publicado' : 'Oculto'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href={`/catalog/${w.slug}`}
                      target="_blank"
                      className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] hover:text-[#0a0d0f] underline"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/admin/watches/${w.id}`}
                      className="font-cabin text-[10px] uppercase tracking-wider text-[#0a0d0f] hover:text-[#1dd8e1] underline font-semibold"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(w.id, w.name)}
                      className="font-cabin text-[10px] uppercase tracking-wider text-[#dc2626] hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
