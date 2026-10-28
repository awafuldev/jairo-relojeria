'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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
  const [feedback, setFeedback] = useState<string | null>(null)

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
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setIsCreating(false)
        setEditingId(null)
        setFeedback(editingId ? '✓ Categoría actualizada con éxito.' : '✓ Categoría creada con éxito.')
        setTimeout(() => setFeedback(null), 3000)
        loadCategories()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Arquitectura del Configurador · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Etapas del Ensamble ({categories.length} Categorías)
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Define la secuencia de 12 pasos que guía al cliente durante la personalización de su reloj mecánico.
          </p>
        </div>

        {!isCreating && (
          <button onClick={startCreate} className="admin-btn admin-btn-primary self-start">
            + Nueva Categoría
          </button>
        )}
      </div>

      {feedback && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 text-[13px] rounded-[4px] flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-green-950 font-bold">✕</button>
        </div>
      )}

      {/* Form modal/inline */}
      {isCreating && (
        <form onSubmit={handleSave} className="mb-8 p-6 admin-card text-[13px] space-y-4">
          <div className="border-b border-[#e5e4e2] pb-3 mb-4 flex items-center justify-between">
            <h2 className="font-jost font-bold text-base text-[#1c1917]">
              {editingId ? 'Editar Categoría de Ensamble' : 'Nueva Categoría de Piezas'}
            </h2>
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null) }}
              className="text-[#78716c] hover:text-black font-cabin text-xs uppercase"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Nombre *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. Bisel Cerámico"
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Slug de Sistema *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="bezel"
                className="admin-input font-mono"
              />
            </div>
            <div>
              <label className="admin-label">Paso en Configurador (1-12)</label>
              <input
                type="number"
                min="1"
                required
                value={step}
                onChange={(e) => setStep(parseInt(e.target.value) || 1)}
                className="admin-input tabular-nums font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Instrucción para el Cliente</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explicación clara del componente..."
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Z-Index de Capa Visual (Superposición)</label>
              <input
                type="number"
                value={layerZIndex}
                onChange={(e) => setLayerZIndex(parseInt(e.target.value) || 0)}
                className="admin-input tabular-nums font-mono"
              />
              <p className="text-[11px] text-[#78716c] mt-1 font-cabin">
                0=Fondo, 2=Brazalete, 3=Caja, 4=Dial, 6=Agujas, 7=Cristal, 8=Corona
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="req"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="w-4 h-4 rounded-[2px] accent-[#1c1917]"
            />
            <label htmlFor="req" className="text-[13px] text-[#1c1917]">
              Paso obligatorio (requerido para dar por completado el reloj)
            </label>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button type="submit" className="admin-btn admin-btn-primary">
              {editingId ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingId(null) }}
              className="admin-btn admin-btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      {loading ? (
        <div className="admin-card admin-empty">
          <p className="admin-empty-title">Cargando etapas del configurador...</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">Paso</th>
                  <th>Etapa / Categoría</th>
                  <th>Slug Técnico</th>
                  <th>Capa Z-Index</th>
                  <th>Componentes</th>
                  <th>Tipo</th>
                  <th className="text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e4e2]">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-[#fafaf9] transition-colors">
                    <td className="tabular-nums font-mono text-[#78716c] font-bold">
                      #{String(cat.step).padStart(2, '0')}
                    </td>
                    <td>
                      <p className="font-medium text-[#1c1917]">{cat.name}</p>
                      {cat.description && (
                        <p className="text-[11px] text-[#78716c] truncate max-w-sm">{cat.description}</p>
                      )}
                    </td>
                    <td className="font-mono text-[12px] text-[#78716c]">{cat.slug}</td>
                    <td className="tabular-nums font-mono text-[#1c1917] font-semibold">{cat.layerZIndex}</td>
                    <td>
                      <span className="font-mono font-medium text-[#1c1917]">
                        {cat._count?.pieces ?? 0}
                      </span>
                      <span className="text-[11px] text-[#78716c] ml-1">piezas</span>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-0.5 rounded-[2px] text-[10px] font-cabin uppercase font-bold ${
                        cat.isRequired ? 'bg-[#1c1917] text-white' : 'bg-[#e5e4e2] text-[#78716c]'
                      }`}>
                        {cat.isRequired ? 'Obligatorio' : 'Opcional'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => startEdit(cat)}
                        className="admin-btn admin-btn-secondary text-[10px] py-1 px-2.5"
                      >
                        Editar
                      </button>
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
