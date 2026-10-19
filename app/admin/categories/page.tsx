'use client'

import { useEffect, useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  step: number
  description: string | null
  isRequired: boolean
  isActive: boolean
  layerZIndex: number
  _count?: { pieces: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [step, setStep] = useState(1)
  const [description, setDescription] = useState('')
  const [layerZIndex, setLayerZIndex] = useState(10)
  const [isRequired, setIsRequired] = useState(true)

  const loadCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setName('')
    setSlug('')
    setStep(categories.length + 1)
    setDescription('')
    setLayerZIndex(10)
    setIsRequired(true)
  }

  const startEdit = (cat: Category) => {
    setIsCreating(true)
    setEditingId(cat.id)
    setName(cat.name)
    setSlug(cat.slug)
    setStep(cat.step)
    setDescription(cat.description || '')
    setLayerZIndex(cat.layerZIndex)
    setIsRequired(cat.isRequired)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name,
        slug,
        step: parseInt(step.toString()),
        description,
        layerZIndex: parseInt(layerZIndex.toString()),
        isRequired,
        isActive: true,
      }

      const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setIsCreating(false)
        setEditingId(null)
        loadCategories()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="caption text-[#a5a7a8] mb-1">Estructura del Configurador</p>
          <h1 className="heading-lg">Categorías ({categories.length})</h1>
        </div>
        {!isCreating && (
          <button onClick={startCreate} className="btn-primary self-start">
            + Nueva Categoría
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleSave} className="mb-8 p-6 border border-[#dbdbdb] rounded-[2px] bg-white text-[13px] space-y-4">
          <h2 className="label text-[#262626]">
            {editingId ? 'Editar Categoría' : 'Nueva Categoría de Piezas'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="caption text-[#686c6d] block mb-1">Nombre *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. Bisel (Bezel)"
                className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="caption text-[#686c6d] block mb-1">Slug URL *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="bezel"
                className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] font-mono focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="caption text-[#686c6d] block mb-1">Paso en Configurador (Orden)</label>
              <input
                type="number"
                min="1"
                required
                value={step}
                onChange={(e) => setStep(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] tabular-nums focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="caption text-[#686c6d] block mb-1">Descripción para el Cliente</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explicación sencilla del componente..."
                className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="caption text-[#686c6d] block mb-1">Z-Index de Capa Visual</label>
              <input
                type="number"
                value={layerZIndex}
                onChange={(e) => setLayerZIndex(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] tabular-nums focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="req"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 rounded-[2px] accent-black"
            />
            <label htmlFor="req" className="text-[13px] text-[#262626]">
              Paso obligatorio (el usuario debe seleccionar una pieza para continuar)
            </label>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button type="submit" className="btn-primary">
              {editingId ? 'Actualizar Categoría' : 'Crear Categoría'}
            </button>
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null) }}
              className="btn-ghost"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      {loading ? (
        <div className="py-20 text-center text-[#a5a7a8] text-[13px]">Cargando categorías...</div>
      ) : (
        <div className="border border-[#dbdbdb] rounded-[2px] overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#dbdbdb] bg-[#ededed] text-[11px] text-[#686c6d] uppercase tracking-wider">
                <th className="py-3 px-4">Paso</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Z-Index</th>
                <th className="py-3 px-4">Piezas</th>
                <th className="py-3 px-4">Obligatorio</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbdbdb] text-[13px]">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-[#f9f9f9] transition-colors">
                  <td className="py-3 px-4 tabular-nums font-mono text-[#a5a7a8]">
                    {String(cat.step).padStart(2, '0')}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-normal text-black">{cat.name}</p>
                    {cat.description && (
                      <p className="caption text-[#a5a7a8] truncate max-w-xs">{cat.description}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[12px] text-[#686c6d]">{cat.slug}</td>
                  <td className="py-3 px-4 tabular-nums text-[#484a4c]">{cat.layerZIndex}</td>
                  <td className="py-3 px-4 tabular-nums text-[#484a4c]">
                    {cat._count?.pieces ?? 0} pieza(s)
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] px-2 py-0.5 rounded-[2px] ${
                      cat.isRequired ? 'bg-black text-white' : 'bg-[#ededed] text-[#686c6d]'
                    }`}>
                      {cat.isRequired ? 'Requerido' : 'Opcional'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-[12px] text-[#484a4c] hover:text-black underline underline-offset-2"
                    >
                      Editar
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
