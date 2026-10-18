'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  step: number
  layerZIndex: number
}

interface AttributeDef {
  id: string
  name: string
  label: string
  type: string
  unit: string | null
}

interface PieceFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function PieceForm({ initialData, isEditing }: PieceFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [attributeDefs, setAttributeDefs] = useState<AttributeDef[]>([])
  const [allPieces, setAllPieces] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [sku, setSku] = useState(initialData?.sku || '')
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '0')
  const [stock, setStock] = useState(initialData?.stock?.toString() || '10')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder?.toString() || '0')
  const [material, setMaterial] = useState(initialData?.material || '')
  const [color, setColor] = useState(initialData?.color || '')
  const [tags, setTags] = useState(initialData?.tags ? (typeof initialData.tags === 'string' ? JSON.parse(initialData.tags).join(', ') : initialData.tags.join(', ')) : '')

  // Layer visual controls
  const [compositionImage, setCompositionImage] = useState(initialData?.compositionImage || initialData?.layerImage || '')
  const [productImage, setProductImage] = useState(initialData?.productImage || '')
  const [layerScale, setLayerScale] = useState(initialData?.layerScale ?? 1.0)
  const [layerX, setLayerX] = useState(initialData?.layerX ?? 0)
  const [layerY, setLayerY] = useState(initialData?.layerY ?? 0)
  const [layerRotation, setLayerRotation] = useState(initialData?.layerRotation ?? 0)
  const [layerZIndex, setLayerZIndex] = useState(initialData?.layerZIndex ?? 10)
  const [layerVisible, setLayerVisible] = useState(initialData?.layerVisible ?? true)

  // Photos
  const [images, setImages] = useState<Array<{ url: string; isPrimary: boolean }>>(
    initialData?.images || []
  )
  const [newImageUrl, setNewImageUrl] = useState('')

  // Dynamic attributes: record of attrDefId -> value
  const [attrValues, setAttrValues] = useState<Record<string, string>>({})

  // Compatibility rules defined by this piece
  // Array of { targetCategoryId, ruleType: 'whitelist', targetPieceIds: string[], description: string }
  const [compatRules, setCompatRules] = useState<any[]>(
    initialData?.compatibilityRules || []
  )

  useEffect(() => {
    // Load categories, attribute definitions, and pieces
    Promise.all([
      fetch('/api/admin/categories').then(r => r.json()),
      fetch('/api/admin/attributes').then(r => r.json()).catch(() => []),
      fetch('/api/admin/pieces').then(r => r.json())
    ]).then(([cats, attrs, pcs]) => {
      setCategories(cats || [])
      setAttributeDefs(attrs || [])
      setAllPieces(pcs || [])

      if (!categoryId && cats?.length > 0 && !isEditing) {
        setCategoryId(cats[0].id)
        setLayerZIndex(cats[0].layerZIndex || 10)
      }
    })

    if (initialData?.attributes) {
      const mapped: Record<string, string> = {}
      for (const a of initialData.attributes) {
        mapped[a.attributeDefinitionId] = a.value
      }
      setAttrValues(mapped)
    }
  }, [])

  // Auto-update default layer Z-index when category changes
  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId)
    const cat = categories.find(c => c.id === newCatId)
    if (cat && !isEditing) {
      setLayerZIndex(cat.layerZIndex || 10)
    }
  }

  // Handle image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'composition' | 'product' | 'gallery') => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        if (type === 'composition') {
          setCompositionImage(data.url)
        } else if (type === 'product') {
          setProductImage(data.url)
        } else {
          setImages(prev => [...prev, { url: data.url, isPrimary: prev.length === 0 }])
        }
      }
    } catch (err) {
      console.error('Upload failed', err)
    }
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl) return
    setImages(prev => [...prev, { url: newImageUrl, isPrimary: prev.length === 0 }])
    setNewImageUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      sku,
      name,
      description,
      categoryId,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      isActive,
      sortOrder: parseInt(sortOrder) || 0,
      material,
      color,
      tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      compositionImage,
      productImage,
      layerScale: parseFloat(layerScale.toString()) || 1.0,
      layerX: parseFloat(layerX.toString()) || 0,
      layerY: parseFloat(layerY.toString()) || 0,
      layerRotation: parseFloat(layerRotation.toString()) || 0,
      layerZIndex: parseInt(layerZIndex.toString()) || 10,
      layerVisible,
    }

    try {
      const url = isEditing ? `/api/admin/pieces/${initialData.id}` : '/api/admin/pieces'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Error al guardar la pieza')
      }

      const pieceData = await res.json()
      const targetId = isEditing ? initialData.id : pieceData.id

      // Save attributes
      const attributesPayload = Object.entries(attrValues).map(([defId, val]) => ({
        attributeDefinitionId: defId,
        value: val
      }))

      if (attributesPayload.length > 0) {
        await fetch(`/api/admin/pieces/${targetId}/attributes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attributes: attributesPayload })
        })
      }

      router.push('/admin/pieces')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl pb-24">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-[2px]">
          {error}
        </div>
      )}

      {/* Grid: 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): General info & attributes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Info */}
          <div className="border border-[#dbdbdb] rounded-[2px] p-6 bg-white">
            <h2 className="label text-[#262626] mb-4">Información Básica</h2>
            <div className="space-y-4 text-[13px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption text-[#686c6d] block mb-1">Nombre de la Pieza *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Oyster 40mm Steel"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="caption text-[#686c6d] block mb-1">SKU único *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="CASE-OYS-40"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] font-mono focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="caption text-[#686c6d] block mb-1">Categoría *</label>
                <select
                  value={categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] bg-white focus:outline-none focus:border-black"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.step}. {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="caption text-[#686c6d] block mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre diseño, fabricación o compatibilidad general..."
                  className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="caption text-[#686c6d] block mb-1">Precio ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] tabular-nums focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="caption text-[#686c6d] block mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] tabular-nums focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="caption text-[#686c6d] block mb-1">Orden de despliegue</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] tabular-nums focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded-[2px] accent-black"
                />
                <label htmlFor="isActive" className="text-[13px] text-[#262626]">
                  Pieza activa (visible en el configurador)
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Materials & Specs */}
          <div className="border border-[#dbdbdb] rounded-[2px] p-6 bg-white">
            <h2 className="label text-[#262626] mb-4">Especificaciones & Materiales</h2>
            <div className="space-y-4 text-[13px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption text-[#686c6d] block mb-1">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Ej. Acero 316L, Zafiro, Cuero"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="caption text-[#686c6d] block mb-1">Color / Tono</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Ej. Negro Sunburst, Plata, Dorado"
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="caption text-[#686c6d] block mb-1">Tags (separados por coma)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="sport, vintage, diver, automatic"
                  className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
                />
              </div>

              {/* Dynamic Attribute Definitions */}
              {attributeDefs.length > 0 && (
                <div className="pt-4 border-t border-[#dbdbdb] space-y-3">
                  <p className="caption text-[#a5a7a8]">Atributos Técnicos para el Motor de Compatibilidad</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attributeDefs.map(def => (
                      <div key={def.id}>
                        <label className="caption text-[#686c6d] block mb-1">
                          {def.label} {def.unit && `(${def.unit})`}
                        </label>
                        <input
                          type="text"
                          value={attrValues[def.id] || ''}
                          onChange={(e) => setAttrValues({ ...attrValues, [def.id]: e.target.value })}
                          placeholder={def.name === 'diameter' ? '40' : def.name === 'lug_width' ? '20' : ''}
                          className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] text-[13px] focus:outline-none focus:border-black"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Fotografía General */}
          <div className="border border-[#dbdbdb] rounded-[2px] p-6 bg-white">
            <h2 className="label text-[#262626] mb-4">Galería de Imágenes de la Pieza</h2>
            <p className="caption text-[#686c6d] mb-4">
              Fotografías de producto que se muestran en el selector cuando el usuario navega por las opciones.
            </p>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="URL de imagen (o sube archivo a la derecha)..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[#dbdbdb] rounded-[2px] text-[13px] focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="btn-ghost text-[11px] py-2"
                >
                  Agregar URL
                </button>
                <label className="btn-primary text-[11px] py-2 cursor-pointer">
                  Subir Archivo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'gallery')}
                  />
                </label>
              </div>

              {/* Images preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square border border-[#dbdbdb] bg-[#ededed] rounded-[2px] overflow-hidden group">
                      <img src={img.url} alt="" className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                      {img.isPrimary && (
                        <span className="absolute bottom-1 left-1 bg-black text-white text-[9px] px-1 py-0.5 rounded-[1px]">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Visual Layer Editor */}
        <div className="space-y-8">
          <div className="border border-[#dbdbdb] rounded-[2px] p-6 bg-white sticky top-20">
            <h2 className="label text-[#262626] mb-1">Capa Visual del Reloj</h2>
            <p className="caption text-[#686c6d] mb-4">
              PNG transparente que se superpone con las otras piezas para componer el reloj en vivo.
            </p>

            {/* Live Layer Preview */}
            <div className="aspect-square bg-[#ededed] border border-[#dbdbdb] rounded-[2px] overflow-hidden relative mb-4 flex items-center justify-center">
              {compositionImage ? (
                <div
                  className="w-full h-full flex items-center justify-center transition-transform"
                  style={{
                    transform: `scale(${layerScale}) translate(${layerX}px, ${layerY}px) rotate(${layerRotation}deg)`,
                  }}
                >
                  <img
                    src={compositionImage}
                    alt="Previsualización de Capa"
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="caption text-[#a5a7a8]">Sin imagen de capa asignada</p>
                  <p className="caption text-[#dbdbdb] mt-1 text-[10px]">
                    (El sistema utilizará la fotografía normal como fallback)
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 text-[13px]">
              <div>
                <label className="caption text-[#686c6d] block mb-1">Imagen de Catálogo (productImage)</label>
                <div className="space-y-2">
                  {productImage && (
                    <div className="aspect-square bg-[#ededed] border border-[#dbdbdb] rounded-[2px] overflow-hidden w-24 h-24">
                      <img src={productImage} alt="Producto" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="/images/products/case.png o URL"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] text-[12px] font-mono focus:outline-none focus:border-black"
                  />
                  <label className="btn-ghost text-[11px] w-full justify-center cursor-pointer py-1.5">
                    Subir Imagen de Producto
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'product')}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="caption text-[#686c6d] block mb-1">
                  Imagen de Composición / Capa Visual (compositionImage)
                  {!compositionImage && <span className="ml-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] rounded-full">! Faltante</span>}
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="/images/layers/case.png o URL"
                    value={compositionImage}
                    onChange={(e) => setCompositionImage(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] text-[12px] font-mono focus:outline-none focus:border-black"
                  />
                  <label className="btn-ghost text-[11px] w-full justify-center cursor-pointer py-1.5">
                    Subir PNG de Composición
                    <input
                      type="file"
                      accept="image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'composition')}
                    />
                  </label>
                </div>
              </div>

              {/* Adjustments: Scale */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="caption text-[#686c6d]">Escala</span>
                  <span className="caption tabular-nums font-mono">{layerScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={layerScale}
                  onChange={(e) => setLayerScale(parseFloat(e.target.value))}
                  className="w-full accent-black"
                />
              </div>

              {/* Adjustments: X Offset */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="caption text-[#686c6d]">Posición X</span>
                  <span className="caption tabular-nums font-mono">{layerX}px</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={layerX}
                  onChange={(e) => setLayerX(parseInt(e.target.value))}
                  className="w-full accent-black"
                />
              </div>

              {/* Adjustments: Y Offset */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="caption text-[#686c6d]">Posición Y</span>
                  <span className="caption tabular-nums font-mono">{layerY}px</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={layerY}
                  onChange={(e) => setLayerY(parseInt(e.target.value))}
                  className="w-full accent-black"
                />
              </div>

              {/* Adjustments: Rotation */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="caption text-[#686c6d]">Rotación</span>
                  <span className="caption tabular-nums font-mono">{layerRotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={layerRotation}
                  onChange={(e) => setLayerRotation(parseInt(e.target.value))}
                  className="w-full accent-black"
                />
              </div>

              {/* Adjustments: Z-Index */}
              <div>
                <label className="caption text-[#686c6d] block mb-1">Orden de Capa (Z-Index)</label>
                <input
                  type="number"
                  value={layerZIndex}
                  onChange={(e) => setLayerZIndex(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] tabular-nums focus:outline-none focus:border-black"
                />
                <p className="caption text-[#a5a7a8] mt-1 text-[11px]">
                  Fondo=0, Brazalete=2, Caja=3, Dial=4, Manecillas=6, Cristal=7, Corona=8
                </p>
              </div>

              {/* Layer Visible Toggle */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#dbdbdb]">
                <input
                  type="checkbox"
                  id="layerVisible"
                  checked={layerVisible}
                  onChange={(e) => setLayerVisible(e.target.checked)}
                  className="w-4 h-4 rounded-[2px] accent-black"
                />
                <label htmlFor="layerVisible" className="text-[12px] text-[#262626]">
                  Renderizar capa en el reloj
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#dbdbdb] py-4 px-8 z-30 flex items-center justify-between">
        <Link href="/admin/pieces" className="caption text-[#686c6d] hover:text-black">
          ← Cancelar y Volver
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Publicar Pieza'}
        </button>
      </div>
    </form>
  )
}
