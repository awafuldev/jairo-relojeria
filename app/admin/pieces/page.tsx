export const dynamic = 'force-dynamic'
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
  category: { id: string; name: string; slug: string }
  images: Array<{ url: string; isPrimary: boolean }>
  _count: { compatibilityRules: number }
}

interface CategoryItem {
  id: string
  name: string
  slug: string
}

export default function AdminPiecesPage() {
  const [pieces, setPieces] = useState<PieceItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [resPieces, resCats] = await Promise.all([
        fetch('/api/admin/pieces'),
        fetch('/api/admin/categories')
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
          isActive: !piece.isActive
        })
      })
      if (res.ok) {
        setPieces(pieces.map(p => p.id === piece.id ? { ...p, isActive: !p.isActive } : p))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la pieza "${name}"? Esta acción no se puede deshacer.`)) return
    try {
      const res = await fetch(`/api/admin/pieces/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPieces(pieces.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = pieces.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category.id === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="caption text-[#a5a7a8] mb-1">Catálogo</p>
          <h1 className="heading-lg">Piezas ({pieces.length})</h1>
        </div>
        <Link href="/admin/pieces/new" className="btn-primary self-start">
          + Nueva Pieza
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-[#dbdbdb] rounded-[2px] text-[13px] bg-white w-full sm:w-64 focus:outline-none focus:border-black"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-[#dbdbdb] rounded-[2px] text-[13px] bg-white focus:outline-none focus:border-black"
        >
          <option value="all">Todas las Categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-[#a5a7a8] text-[13px]">
          Cargando catálogo...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-[#a5a7a8] text-[13px] border border-[#dbdbdb] rounded-[2px]">
          No se encontraron piezas con los filtros aplicados.
        </div>
      ) : (
        <div className="border border-[#dbdbdb] rounded-[2px] overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#dbdbdb] bg-[#ededed] text-[11px] text-[#686c6d] uppercase tracking-wider">
                <th className="py-3 px-4">Pieza</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Precio</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Reglas</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbdbdb] text-[13px]">
              {filtered.map(piece => {
                const img = piece.images.find(i => i.isPrimary)?.url || piece.images[0]?.url
                return (
                  <tr key={piece.id} className="hover:bg-[#f9f9f9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#ededed] rounded-[2px] overflow-hidden shrink-0 flex items-center justify-center">
                          {img ? (
                            <img src={img} alt={piece.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-[10px] text-[#a5a7a8]">No img</span>
                          )}
                        </div>
                        <div>
                          <p className="font-normal leading-tight">{piece.name}</p>
                          {piece.color && <p className="caption text-[#a5a7a8]">{piece.color}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[12px] text-[#686c6d]">{piece.sku}</td>
                    <td className="py-3 px-4 text-[#484a4c]">{piece.category.name}</td>
                    <td className="py-3 px-4 tabular-nums font-normal">${piece.price.toFixed(2)}</td>
                    <td className="py-3 px-4 tabular-nums text-[#484a4c]">{piece.stock}</td>
                    <td className="py-3 px-4 text-[12px] text-[#686c6d]">
                      {piece._count?.compatibilityRules > 0 ? (
                        <span className="px-1.5 py-0.5 bg-[#ededed] rounded-[2px]">
                          {piece._count.compatibilityRules} regla(s)
                        </span>
                      ) : (
                        <span className="text-[#a5a7a8]">Universal</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleActive(piece)}
                        className={`text-[11px] px-2 py-0.5 rounded-[2px] transition-colors ${
                          piece.isActive
                            ? 'bg-black text-white hover:bg-[#262626]'
                            : 'bg-[#dbdbdb] text-[#484a4c] hover:bg-[#a5a7a8]'
                        }`}
                      >
                        {piece.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/pieces/${piece.id}`}
                          className="text-[12px] text-[#484a4c] hover:text-black underline underline-offset-2"
                        >
                          Editar
                        </Link>
                        <span className="text-[#dbdbdb]">|</span>
                        <button
                          onClick={() => handleDelete(piece.id, piece.name)}
                          className="text-[12px] text-[#686c6d] hover:text-black"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
