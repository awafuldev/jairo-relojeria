'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface WatchFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function WatchForm({ initialData, isEditing }: WatchFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Fields
  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [reference, setReference] = useState(initialData?.reference || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '390')
  const [stock, setStock] = useState(initialData?.stock?.toString() || '1')
  const [isAvailable, setIsAvailable] = useState(initialData?.isAvailable ?? true)
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false)

  // Specs
  const [caliber, setCaliber] = useState(initialData?.caliber || 'Seiko NH35A Automático')
  const [caseSize, setCaseSize] = useState(initialData?.caseSize || '40mm (Grosor 13mm, Asas 20mm)')
  const [waterResist, setWaterResist] = useState(initialData?.waterResist || '100M / 10 ATM')
  const [glass, setGlass] = useState(initialData?.glass || 'Cristal Zafiro con AR interior')
  const [bracelet, setBracelet] = useState(initialData?.bracelet || 'Brazalete Oyster Acero 316L')

  // Images
  const [mainImage, setMainImage] = useState(initialData?.mainImage || '/images/products/case-sub-40-steel.png')
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    Array.isArray(initialData?.gallery)
      ? initialData.gallery
      : typeof initialData?.gallery === 'string'
      ? JSON.parse(initialData.gallery || '[]')
      : []
  )

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  // Handle main image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        setMainImage(data.url)
      } else {
        const errData = await res.json()
        setError(errData.error || 'Error al subir la imagen')
      }
    } catch {
      setError('Error de conexión al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      name,
      slug,
      reference,
      description,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 1,
      isAvailable,
      isFeatured,
      caliber,
      caseSize,
      waterResist,
      glass,
      bracelet,
      mainImage,
      gallery: galleryUrls,
    }

    try {
      const url = isEditing ? `/api/admin/watches/${initialData.id}` : '/api/admin/watches'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Error al guardar el reloj')
      }

      router.push('/admin/watches')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error desconocido')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl font-poppins pb-24">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-[3px]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col (7 cols): Data & Specs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#ffffff] border border-[#d5d6d7] p-6 rounded-[3px] space-y-4">
            <h2 className="font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold text-[#0a0d0f]">
              Información Básica del Reloj
            </h2>

            <div>
              <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                Nombre del Modelo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Ej. Seiko Mod Submariner Date 40mm"
                className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] focus:outline-none focus:border-[#1dd8e1]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                  Identificador URL (Slug) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] font-mono focus:outline-none focus:border-[#1dd8e1]"
                />
              </div>

              <div>
                <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                  Referencia de Taller (Opcional)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="Ej. JR-SUB-01"
                  className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] font-mono focus:outline-none focus:border-[#1dd8e1]"
                />
              </div>
            </div>

            <div>
              <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                Descripción Editorial
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe las características y materiales de este ensamble Seiko..."
                className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] focus:outline-none focus:border-[#1dd8e1]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                  Precio ($ USD) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] font-mono font-semibold focus:outline-none focus:border-[#1dd8e1]"
                />
              </div>

              <div>
                <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                  Unidades en Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] font-mono focus:outline-none focus:border-[#1dd8e1]"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-3 border-t border-[#f7f7f7]">
              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#0a0d0f]">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={e => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded-[2px] accent-[#0a0d0f]"
                />
                <span className="font-medium">Publicado en la tienda</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[12px] text-[#0a0d0f]">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded-[2px] accent-[#0a0d0f]"
                />
                <span className="font-medium">Destacado en portada</span>
              </label>
            </div>
          </div>

          {/* Technical Specs Card */}
          <div className="bg-[#ffffff] border border-[#d5d6d7] p-6 rounded-[3px] space-y-4">
            <h2 className="font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold text-[#0a0d0f]">
              Ficha Técnica Horológica
            </h2>

            <div>
              <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                Calibre / Movimiento
              </label>
              <input
                type="text"
                value={caliber}
                onChange={e => setCaliber(e.target.value)}
                placeholder="Ej. Seiko NH35A Automático (24 joyas)"
                className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] focus:outline-none focus:border-[#1dd8e1]"
              />
            </div>

            <div>
              <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                Dimensiones de Caja
              </label>
              <input
                type="text"
                value={caseSize}
                onChange={e => setCaseSize(e.target.value)}
                placeholder="Ej. 40mm (Grosor 13mm, Asas 20mm)"
                className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] focus:outline-none focus:border-[#1dd8e1]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                  Hermeticidad / Resistencia
                </label>
                <input
                  type="text"
                  value={waterResist}
                  onChange={e => setWaterResist(e.target.value)}
                  placeholder="Ej. 100M / 10 ATM"
                  className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] focus:outline-none focus:border-[#1dd8e1]"
                />
              </div>

              <div>
                <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                  Cristal
                </label>
                <input
                  type="text"
                  value={glass}
                  onChange={e => setGlass(e.target.value)}
                  placeholder="Ej. Zafiro con AR azul"
                  className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] focus:outline-none focus:border-[#1dd8e1]"
                />
              </div>
            </div>

            <div>
              <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                Brazalete / Correa
              </label>
              <input
                type="text"
                value={bracelet}
                onChange={e => setBracelet(e.target.value)}
                placeholder="Ej. Brazalete Oyster Acero 316L"
                className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[13px] focus:outline-none focus:border-[#1dd8e1]"
              />
            </div>
          </div>
        </div>

        {/* Right Col (5 cols): Main Photo & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#ffffff] border border-[#d5d6d7] p-6 rounded-[3px] space-y-4">
            <h2 className="font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold text-[#0a0d0f]">
              Fotografía Principal
            </h2>

            <div className="aspect-square bg-[#f7f7f7] border border-[#d5d6d7] rounded-[3px] p-6 flex items-center justify-center overflow-hidden relative">
              <img src={mainImage} alt="Preview" className="w-full h-full object-contain" />
              {uploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center font-cabin text-[11px] uppercase tracking-wider text-[#0a0d0f]">
                  Subiendo archivo...
                </div>
              )}
            </div>

            <div>
              <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                Subir nueva imagen desde tu equipo
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full text-[12px] text-[#2e3438] file:mr-3 file:py-1.5 file:px-3 file:rounded-[2px] file:border file:border-[#d5d6d7] file:bg-[#f7f7f7] file:text-[11px] file:font-cabin file:uppercase hover:file:bg-[#efefef] file:cursor-pointer"
              />
              <p className="font-cabin text-[9px] text-[#2e3438] mt-1">
                Formatos permitidos: PNG, JPG, WEBP (Máx. 5MB)
              </p>
            </div>

            <div>
              <label className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block mb-1">
                O introduce ruta / URL de imagen:
              </label>
              <input
                type="text"
                value={mainImage}
                onChange={e => setMainImage(e.target.value)}
                className="w-full px-3 py-2 border border-[#d5d6d7] rounded-[3px] text-[12px] font-mono focus:outline-none focus:border-[#1dd8e1]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-teal flex-1 justify-center py-3 text-[11px]"
            >
              {saving ? 'Guardando reloj...' : isEditing ? 'Guardar Cambios' : 'Publicar Reloj en Tienda'}
            </button>
            <Link
              href="/admin/watches"
              className="btn-outline-dark text-[11px] py-3 px-4"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </div>
    </form>
  )
}
