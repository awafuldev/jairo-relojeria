'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/cartStore'
import { useI18n } from '@/lib/i18n/context'
import Link from 'next/link'

interface WatchDetailProps {
  watch: {
    id: string
    name: string
    slug: string
    reference?: string
    price: number
    stock: number
    caliber?: string
    caseSize?: string
    glass?: string
    waterResist?: string
    bracelet?: string
    description?: string
    mainImage: string
    gallery: string[]
  }
}

export default function WatchDetailClient({ watch }: WatchDetailProps) {
  const { t } = useI18n()
  const [selectedImage, setSelectedImage] = useState(watch.mainImage)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCartStore()

  const images = watch.gallery.length > 0 ? watch.gallery : [watch.mainImage]

  const handleAddToCart = () => {
    addItem({
      id: watch.id,
      name: watch.name,
      reference: watch.reference,
      price: watch.price,
      image: watch.mainImage,
      slug: watch.slug,
    }, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  const orderSubject = encodeURIComponent(`Solicitud de Compra: ${watch.name} (${watch.reference || 'JR'})`)
  const orderBody = encodeURIComponent(
    `Hola Jairo Relojería,\n\n` +
    `Deseo solicitar la compra directa de este reloj completo de su catálogo:\n\n` +
    `- Modelo: ${watch.name}\n` +
    `- Referencia: ${watch.reference || 'N/A'}\n` +
    `- Cantidad: ${quantity}\n` +
    `- Precio Unitario: $${watch.price} USD\n` +
    `- Total Estimado: $${watch.price * quantity} USD\n\n` +
    `Por favor indíquenme los métodos de pago (transferencia, tarjeta, etc.) y tiempo estimado de entrega.`
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* ── LEFT COLUMN (7 cols): Large Product Gallery on White / Bone surface ── */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Watch Photo Container */}
        <div className="aspect-square bg-[#ffffff] border border-[#d5d6d7] rounded-[3px] p-8 sm:p-12 flex items-center justify-center overflow-hidden relative">
          <img
            src={selectedImage}
            alt={watch.name}
            className="w-full h-full object-contain filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.12)] transition-all duration-300"
          />
          {watch.reference && (
            <span className="absolute top-4 left-4 bg-[#ffffff] border border-[#d5d6d7] text-[#0a0d0f] font-mono text-[10px] px-2.5 py-1 rounded-[2px]">
              Ref: {watch.reference}
            </span>
          )}
          <span className="absolute top-4 right-4 bg-[#0a0d0f] text-[#1dd8e1] font-cabin text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-[2px] font-bold">
            Seiko Mod
          </span>
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`aspect-square bg-[#ffffff] border rounded-[3px] p-2 flex items-center justify-center overflow-hidden transition-colors ${
                  selectedImage === img
                    ? 'border-[#1dd8e1] ring-1 ring-[#1dd8e1]'
                    : 'border-[#d5d6d7] hover:border-[#0a0d0f]'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN (5 cols): Product Details & Order Actions ── */}
      <div className="lg:col-span-5 space-y-7">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#1dd8e1] font-bold block mb-1">
            Seiko Mod Automático
          </span>
          <h1 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em] leading-tight">
            {watch.name}
          </h1>
          {watch.reference && (
            <p className="font-mono text-[12px] text-[#2e3438] mt-1">
              {t.productDetail.reference}: {watch.reference}
            </p>
          )}
        </div>

        {/* Price & Stock Banner */}
        <div className="p-4 bg-[#f7f7f7] border border-[#d5d6d7] rounded-[3px] flex items-center justify-between">
          <div>
            <span className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block">Inversión</span>
            <span className="font-poppins text-2xl font-bold text-[#0a0d0f]">
              ${watch.price.toFixed(0)} <span className="font-cabin text-xs text-[#2e3438] font-normal">USD</span>
            </span>
          </div>
          <div className="text-right">
            {watch.stock > 0 ? (
              <>
                <span className="font-cabin text-[10px] uppercase tracking-wider text-[#16a34a] font-bold block">
                  ✓ {t.productDetail.inStock}
                </span>
                <span className="font-cabin text-[10px] text-[#2e3438]">
                  Stock: {watch.stock}
                </span>
              </>
            ) : (
              <span className="font-cabin text-[10px] uppercase tracking-wider text-[#dc2626] font-bold block">
                {t.configurator.outOfStock}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {watch.description && (
          <div className="space-y-2">
            <h3 className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f]">
              {t.productDetail.specsTitle}
            </h3>
            <p className="text-[13px] text-[#2e3438] font-poppins leading-relaxed">
              {watch.description}
            </p>
          </div>
        )}

        {/* Technical Specs Sheet */}
        <div className="border border-[#d5d6d7] rounded-[3px] divide-y divide-[#d5d6d7] bg-[#ffffff] text-[12px]">
          <div className="p-3 bg-[#f7f7f7]">
            <span className="font-cabin text-[10px] uppercase tracking-[0.14em] font-semibold text-[#0a0d0f]">
              {t.productDetail.specsTitle}
            </span>
          </div>

          {watch.caliber && (
            <div className="p-3 flex justify-between gap-4">
              <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">{t.productDetail.caliber}</span>
              <span className="font-poppins text-[#0a0d0f] font-medium text-right">{watch.caliber}</span>
            </div>
          )}

          {watch.caseSize && (
            <div className="p-3 flex justify-between gap-4">
              <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">{t.productDetail.caseSize}</span>
              <span className="font-poppins text-[#0a0d0f] font-medium text-right">{watch.caseSize}</span>
            </div>
          )}

          {watch.glass && (
            <div className="p-3 flex justify-between gap-4">
              <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">{t.productDetail.glass}</span>
              <span className="font-poppins text-[#0a0d0f] font-medium text-right">{watch.glass}</span>
            </div>
          )}

          {watch.waterResist && (
            <div className="p-3 flex justify-between gap-4">
              <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">{t.productDetail.waterResist}</span>
              <span className="font-poppins text-[#0a0d0f] font-medium text-right">{watch.waterResist}</span>
            </div>
          )}

          {watch.bracelet && (
            <div className="p-3 flex justify-between gap-4">
              <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">{t.productDetail.bracelet}</span>
              <span className="font-poppins text-[#0a0d0f] font-medium text-right">{watch.bracelet}</span>
            </div>
          )}
        </div>

        {/* Quantity Selector with Minus/Plus Controls & Purchase Actions */}
        <div className="space-y-4 pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">{t.productDetail.quantity}:</span>
            <div className="flex items-center border border-[#d5d6d7] rounded-[3px] bg-[#ffffff]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-[#0a0d0f] hover:bg-[#f7f7f7] text-[14px] font-semibold transition-colors"
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="w-10 text-center font-mono text-[13px] text-[#0a0d0f] font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(watch.stock || 10, quantity + 1))}
                className="w-9 h-9 flex items-center justify-center text-[#0a0d0f] hover:bg-[#f7f7f7] text-[14px] font-semibold transition-colors"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          {/* Primary Action 1: Add to Shopping Bag */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={watch.stock === 0}
            className="btn-teal w-full justify-center py-4 text-[12px] font-semibold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {added ? t.catalog.added : t.productDetail.addToBag}
          </button>

          {/* Primary Action 2: Direct Mailto Inquiry */}
          <a
            href={`mailto:taller@jairorelojeria.com?subject=${orderSubject}&body=${orderBody}`}
            className="btn-outline-dark w-full justify-center py-3.5 text-[11px] font-semibold uppercase tracking-wider"
          >
            {t.productDetail.inquireEmail} →
          </a>

          {/* Secondary Action: Configurator Alternative */}
          <Link
            href="/configurator"
            className="block text-center font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] hover:text-[#0a0d0f] transition-colors pt-1 underline"
          >
            {t.nav.custom}
          </Link>
        </div>
      </div>
    </div>
  )
}
