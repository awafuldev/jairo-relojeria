'use client'

import { useCartStore } from '@/lib/cartStore'
import { useI18n } from '@/lib/i18n/context'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  const orderSubject = encodeURIComponent('Solicitud de Pedido — Jairo Relojería')
  const orderBody = encodeURIComponent(
    `Hola Jairo Relojería,\n\nDeseo realizar el pedido de los siguientes relojes completos de su tienda:\n\n` +
    items.map(i => `- ${i.name} (${i.reference || 'Ref N/A'}) x${i.quantity} = $${i.price * i.quantity} USD`).join('\n') +
    `\n\nTotal estimado: $${totalPrice()} USD\n\nPor favor confirmen disponibilidad y datos de pago/envío.`
  )

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-poppins">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-[#0a0d0f]/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#ffffff] border-l border-[#d5d6d7] flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-[#d5d6d7] flex items-center justify-between">
            <div>
              <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#1dd8e1] font-bold block mb-1">
                {t.cart.title}
              </span>
              <h2 className="editorial-title text-[20px] text-[#0a0d0f] tracking-[0.09em]">
                {t.nav.watches}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-[#2e3438] hover:text-[#0a0d0f] transition-colors"
              aria-label={t.nav.close}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Item List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#f7f7f7] border border-[#d5d6d7] flex items-center justify-center text-[#2e3438]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="font-poppins text-[14px] text-[#2e3438]">
                  {t.cart.empty}
                </p>
                <p className="font-poppins text-[12px] text-[#686c6d]">
                  {t.cart.emptySub}
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/catalog"
                    onClick={closeCart}
                    className="btn-outline-dark text-[11px] py-2.5 px-5"
                  >
                    {t.cart.exploreWatches}
                  </Link>
                  <Link
                    href="/configurator"
                    onClick={closeCart}
                    className="btn-teal text-[11px] py-2.5 px-5 text-center"
                  >
                    {t.cart.customizeWatch}
                  </Link>
                </div>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="p-4 bg-[#f7f7f7] border border-[#d5d6d7] rounded-[3px] flex gap-4 items-center"
                >
                  <div className="w-16 h-16 bg-[#ffffff] border border-[#d5d6d7] rounded-[2px] p-1 flex items-center justify-center shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-poppins font-medium text-[13px] text-[#0a0d0f] truncate">
                      {item.name}
                    </h3>
                    {item.reference && (
                      <p className="font-mono text-[10px] text-[#2e3438]">{item.reference}</p>
                    )}
                    <p className="font-poppins font-semibold text-[13px] text-[#0a0d0f] mt-1">
                      ${item.price} USD
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 border border-[#d5d6d7] bg-[#ffffff] hover:border-[#0a0d0f] text-[12px] flex items-center justify-center rounded-[2px]"
                      >
                        -
                      </button>
                      <span className="font-mono text-[12px] text-[#0a0d0f] w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 border border-[#d5d6d7] bg-[#ffffff] hover:border-[#0a0d0f] text-[12px] flex items-center justify-center rounded-[2px]"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-[11px] text-[#dc2626] hover:underline font-cabin uppercase tracking-wider"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#d5d6d7] bg-[#ffffff] space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">
                  {t.cart.subtotal} ({items.reduce((a, b) => a + b.quantity, 0)} {t.cart.itemsCount})
                </span>
                <span className="font-poppins font-bold text-[18px] text-[#0a0d0f]">
                  ${totalPrice()} USD
                </span>
              </div>

              <p className="text-[11px] text-[#2e3438] leading-tight">
                {t.cart.shippingNote}
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href={`mailto:taller@jairorelojeria.com?subject=${orderSubject}&body=${orderBody}`}
                  className="btn-teal w-full justify-center py-3.5 text-[11px] tracking-wider"
                >
                  {t.cart.checkoutMail} →
                </a>

                <a
                  href="https://www.instagram.com/jairorelojeria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-dark w-full justify-center py-3 text-[11px]"
                >
                  Instagram Direct ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
