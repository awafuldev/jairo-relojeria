'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PieceItem {
  id: string
  sku: string
  name: string
  price: number
  stock: number
  isActive: boolean
  sortOrder: number
  material: string | null
  color: string | null
  compositionImage: string | null
  productImage: string | null
  thumbnail: string | null
  layerScale: number
  layerX: number
  layerY: number
  layerRotation: number
  layerZIndex: number
  category: { id: string; name: string; slug: string; step: number }
  images: Array<{ url: string; isPrimary: boolean }>
  _count: { compatibilityRules: number }
}

interface CategoryItem {
  id: string
  name: string
  slug: string
  step: number
}

export default function AdminPiecesPage() {
  const [pieces, setPieces] = useState<PieceItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [resPieces, resCats] = await Promise.all([
        fetch('/api/admin/pieces'),
        fetch('/api/admin/categories'),
      ])
      if (resPieces.ok) {
        const data = await resPieces.json()
        setPieces(data)
      }
      if (resCats.ok) {
        const catData = await resCats.json()
        setCategories(catData)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleActive = async (piece: PieceItem) => {
    try {
      const res = await fetch(`/api/admin/pieces/${piece.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...piece,
          categoryId: piece.category.id,
          isActive: !piece.isActive,
        }),
      })
      if (res.ok) {
        setPieces(pieces.map(p => p.id === piece.id ? { ...p, isActive: !p.isActive } : p))
        showFeedback(`Estado de "${piece.name}" actualizado.`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDuplicate = async (piece: PieceItem) => {
    setDuplicatingId(piece.id)
    try {
      const uniqueSuffix = Math.floor(100 + Math.random() * 900)
      const newSku = `${piece.sku}-CP${uniqueSuffix}`
      const newName = `${piece.name} (Copia)`

      const res = await fetch('/api/admin/pieces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: newSku,
          name: newName,
          categoryId: piece.category.id,
          price: piece.price,
          stock: piece.stock,
          isActive: false, // Start as draft/inactive
          material: piece.material,
          color: piece.color,
          compositionImage: piece.compositionImage,
          productImage: piece.productImage,
          thumbnail: piece.thumbnail,
          layerScale: piece.layerScale,
          layerX: piece.layerX,
          layerY: piece.layerY,
          layerRotation: piece.layerRotation,
          layerZIndex: piece.layerZIndex,
        }),
      })

      if (res.ok) {
        const created = await res.json()
        setPieces([created, ...pieces])
        showFeedback(`✓ Pieza duplicada como "${newName}" (SKU: ${newSku}).`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDuplicatingId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la pieza "${name}"? Esta acción no se puede deshacer y puede afectar configuraciones existentes.`)) return
    try {
      const res = await fetch(`/api/admin/pieces/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPieces(pieces.filter(p => p.id !== id))
        showFeedback(`Pieza "${name}" eliminada.`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(null), 3500)
  }

  const filtered = pieces.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category.id === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Inventario del Taller · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Componentes & Piezas Bespoke ({pieces.length})
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Diales, cajas, biseles, agujas y calibres utilizados por el configurador en tiempo real.
          </p>
        </div>
        <Link href="/admin/pieces/new" className="admin-btn admin-btn-primary self-start">
          + Añadir Nueva Pieza
        </Link>
      </div>

      {feedbackMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-[13px] rounded-[4px] flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-green-950 font-bold">✕</button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 border border-[#e5e4e2] rounded-[4px] mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pl-9"
            />
            <svg className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="admin-input sm:w-64"
          >
            <option value="all">Todas las Categorías ({pieces.length})</option>
            {categories.map(c => {
              const count = pieces.filter(p => p.category.id === c.id).length
              return (
                <option key={c.id} value={c.id}>
                  Paso {c.step}: {c.name} ({count})
                </option>
              )
            })}
          </select>
        </div>

        <span className="text-[12px] text-[#78716c] font-cabin uppercase tracking-wider shrink-0">
          Mostrando {filtered.length} piezas
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="admin-card admin-empty">
          <p className="admin-empty-title">Cargando catálogo del taller...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card admin-empty">
          <p className="admin-empty-title">No se encontraron piezas con los filtros aplicados</p>
          <p className="text-[12px] max-w-sm mt-1">
            Intenta seleccionar otra categoría o cambiar los términos de búsqueda.
          </p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">Visual</th>
                  <th>Pieza & SKU</th>
                  <th>Categoría</th>
                  <th>Precio Venta</th>
                  <th>Disponibilidad</th>
                  <th>Reglas Físicas</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e4e2]">
                {filtered.map(piece => {
                  const img = piece.thumbnail || piece.productImage || piece.images?.find(i => i.isPrimary)?.url || piece.images?.[0]?.url
                  const isLowStock = piece.stock <= 2

                  return (
                    <tr key={piece.id} className="hover:bg-[#fafaf9] transition-colors">
                      {/* Image Thumbnail */}
                      <td className="w-16">
                        <div className="w-12 h-12 bg-[#f5f4f2] border border-[#e5e4e2] rounded-[3px] overflow-hidden shrink-0 flex items-center justify-center p-1">
                          {img ? (
                            <img src={img} alt={piece.name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[9px] text-[#a8a29e] font-cabin uppercase">Sin foto</span>
                          )}
                        </div>
                      </td>

                      {/* Name & SKU */}
                      <td>
                        <Link
                          href={`/admin/pieces/${piece.id}`}
                          className="font-medium text-[#1c1917] hover:underline block"
                        >
                          {piece.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] text-[#78716c]">
                            {piece.sku}
                          </span>
                          {piece.color && (
                            <span className="font-cabin text-[10px] text-[#78716c] uppercase">
                              · {piece.color}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="font-cabin text-[11px] font-semibold text-[#1c1917] block">
                          {piece.category.name}
                        </span>
                        <span className="font-cabin text-[10px] text-[#78716c]">
                          Paso {piece.category.step}
                        </span>
                      </td>

                      {/* Price */}
                      <td>
                        <span className="font-mono font-bold text-[#1c1917] tabular-nums block">
                          ${piece.price.toFixed(2)}
                        </span>
                        <span className="font-cabin text-[9px] text-[#78716c] uppercase">
                          USD
                        </span>
                      </td>

                      {/* Stock */}
                      <td>
                        <span className={`font-mono text-[12px] font-semibold tabular-nums block ${
                          isLowStock ? 'text-red-700' : 'text-[#1c1917]'
                        }`}>
                          {piece.stock} uds.
                        </span>
                        {isLowStock && (
                          <span className="inline-block px-1.5 py-0.2 bg-red-100 text-red-800 text-[9px] rounded-[2px] font-cabin uppercase font-bold mt-0.5">
                            Bajo
                          </span>
                        )}
                      </td>

                      {/* Rules */}
                      <td>
                        {piece._count?.compatibilityRules > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f5f4f2] text-[#1c1917] rounded-[2px] text-[11px] font-cabin uppercase font-semibold">
                            <span>{piece._count.compatibilityRules}</span>
                            <span className="text-[9px] text-[#78716c]">restricción(es)</span>
                          </span>
                        ) : (
                          <span className="text-[#a8a29e] text-[11px] font-cabin uppercase">
                            Universal
                          </span>
                        )}
                      </td>

                      {/* Active Toggle */}
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleActive(piece)}
                          className={`text-[10px] px-2.5 py-1 rounded-[2px] font-cabin uppercase font-bold transition-colors cursor-pointer ${
                            piece.isActive
                              ? 'bg-[#166534] text-white hover:bg-green-800'
                              : 'bg-[#e5e4e2] text-[#78716c] hover:bg-[#d5d6d7]'
                          }`}
                        >
                          {piece.isActive ? 'Publicado' : 'Inactivo'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/pieces/${piece.id}`}
                            className="admin-btn admin-btn-secondary text-[10px] py-1 px-2.5"
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            disabled={duplicatingId === piece.id}
                            onClick={() => handleDuplicate(piece)}
                            className="admin-btn admin-btn-secondary text-[10px] py-1 px-2.5"
                            title="Clonar esta pieza con sus ajustes visuales"
                          >
                            {duplicatingId === piece.id ? '...' : 'Duplicar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(piece.id, piece.name)}
                            className="text-[11px] text-[#991b1b] hover:underline px-1"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
