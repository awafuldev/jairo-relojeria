'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge, formatPrice, formatDate, STATUS_FLOW } from '@/components/admin/AdminUtils'
import { getWhatsAppUrl } from '@/lib/whatsapp'

interface OrderDetailClientProps {
  order: any
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState(order.status || 'saved')
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '')
  const [clientName, setClientName] = useState(order.clientName || '')
  const [clientEmail, setClientEmail] = useState(order.clientEmail || '')
  const [clientPhone, setClientPhone] = useState(order.clientPhone || '')
  const [isEditingClient, setIsEditingClient] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [notesSaved, setNotesSaved] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const code = order.shareCode || order.shareToken?.slice(0, 8).toUpperCase() || order.id.slice(0, 8)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return
    setUpdatingStatus(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/configurations/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al actualizar el estado')
      }

      setCurrentStatus(newStatus)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleSaveNotes = async () => {
    setSavingNotes(true)
    setError(null)
    setNotesSaved(false)

    try {
      const res = await fetch(`/api/admin/configurations/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminNotes,
          clientName: clientName.trim() || null,
          clientEmail: clientEmail.trim() || null,
          clientPhone: clientPhone.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar notas')
      }

      setNotesSaved(true)
      setIsEditingClient(false)
      setTimeout(() => setNotesSaved(false), 3000)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSavingNotes(false)
    }
  }

  // Pre-filled WhatsApp notification message to customer
  const clientWhatsAppMsg = `¡Hola ${clientName || 'estimado cliente'}! Le contactamos desde el taller de Jairo Relojería respecto a su pedido de reloj personalizado #${code}.\n\nEstado actual: ${currentStatus.toUpperCase()}\nInversión total: $${order.totalPrice.toFixed(0)} USD\n\n¿Desea coordinar detalles de ensamble o confirmación de envío?`
  const clientWhatsAppUrl = clientPhone ? getWhatsAppUrl(clientWhatsAppMsg, clientPhone) : null

  // Sort items by category step
  const sortedItems = [...(order.items || [])].sort((a, b) => (a.category?.step || 0) - (b.category?.step || 0))

  return (
    <div className="space-y-8 font-poppins">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-[4px] flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-900 font-bold">✕</button>
        </div>
      )}

      {/* Top Banner & Fast Actions */}
      <div className="bg-white border border-[#e5e4e2] rounded-[4px] p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xl font-bold text-[#1c1917]">
              Pedido #{code}
            </span>
            <StatusBadge status={currentStatus} size="md" />
          </div>
          <p className="text-[12px] text-[#78716c]">
            Registrado el {formatDate(order.createdAt, 'long')} · ID interno: <code className="font-mono text-[11px]">{order.id}</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {clientWhatsAppUrl && (
            <a
              href={clientWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn bg-[#25D366] hover:bg-[#20ba59] text-white border-none"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              Contactar por WhatsApp
            </a>
          )}

          <Link
            href={`/configurator/${order.shareCode || order.shareToken}`}
            target="_blank"
            className="admin-btn admin-btn-secondary"
          >
            Abrir en Configurador ↗
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Watch Configuration & Pieces */}
        <div className="lg:col-span-8 space-y-8">
          {/* Status Workflow Selector */}
          <div className="admin-card p-6">
            <span className="admin-subtitle">Flujo de Estado Operativo</span>
            <h2 className="admin-title text-lg mb-4">Actualizar Estado del Pedido</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'pending', label: 'Pendiente de Confirmar' },
                { id: 'confirmed', label: 'Confirmado por Cliente' },
                { id: 'in_progress', label: 'En Preparación / Taller' },
                { id: 'completed', label: 'Ensamblado / Completado' },
                { id: 'cancelled', label: 'Cancelado' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  disabled={updatingStatus}
                  onClick={() => handleStatusChange(st.id)}
                  className={`p-3 rounded-[4px] border text-left transition-all ${
                    currentStatus === st.id
                      ? 'border-[#1c1917] bg-[#1c1917] text-white font-semibold shadow-xs'
                      : 'border-[#e5e4e2] bg-white hover:bg-[#fafaf9] text-[#1c1917]'
                  }`}
                >
                  <span className="font-cabin text-[10px] uppercase tracking-wider block opacity-70">
                    {st.id === currentStatus ? 'Estado Actual' : 'Cambiar a'}
                  </span>
                  <span className="text-[12px] font-medium block mt-0.5">{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pieces Breakdown (Bill of Materials) */}
          <div className="admin-card overflow-hidden">
            <div className="p-5 border-b border-[#e5e4e2] bg-[#fafaf9] flex items-center justify-between">
              <div>
                <h3 className="font-jost font-bold text-base text-[#1c1917]">
                  Componentes Montados ({sortedItems.length} piezas)
                </h3>
                <p className="text-[12px] text-[#78716c]">
                  Precios unitarios congelados históricamente al momento del encargo.
                </p>
              </div>
              <span className="font-mono text-sm font-bold text-[#1c1917] tabular-nums">
                Subtotal: ${order.totalPrice.toFixed(0)} USD
              </span>
            </div>

            <div className="divide-y divide-[#e5e4e2]">
              {sortedItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#fafaf9] transition-colors">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 bg-[#f5f4f2] border border-[#e5e4e2] rounded-[3px] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.piece.productImage || item.piece.thumbnail ? (
                        <img
                          src={item.piece.productImage || item.piece.thumbnail}
                          alt={item.piece.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-[#a8a29e] font-cabin uppercase">Pieza</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] font-semibold block">
                        Paso {item.category?.step || '·'} — {item.category?.name || 'Componente'}
                      </span>
                      <p className="font-medium text-[#1c1917] text-[13px] truncate">
                        {item.piece.name}
                      </p>
                      <p className="font-mono text-[11px] text-[#78716c]">
                        SKU: {item.piece.sku}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[13px] text-[#1c1917] tabular-nums block">
                      ${item.priceAtTime?.toFixed(2) || '0.00'}
                    </span>
                    <span className="font-cabin text-[9px] text-[#78716c] uppercase">
                      Precio Histórico
                    </span>
                  </div>
                </div>
              ))}

              {order.engravingText && (
                <div className="p-4 bg-amber-50/50 flex items-center justify-between">
                  <div>
                    <span className="font-cabin text-[9px] uppercase tracking-wider text-[#92680a] font-bold block">
                      Personalización Especial
                    </span>
                    <p className="font-medium text-[#1c1917] text-[13px]">
                      Grabado Láser en Tapa Trasera: <span className="font-mono text-[#92680a]">"{order.engravingText}"</span>
                    </p>
                    <p className="text-[11px] text-[#78716c]">
                      Tipografía seleccionada: {order.engravingFont || 'Clásica'}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-[13px] text-[#92680a]">
                    +$30.00 USD
                  </span>
                </div>
              )}
            </div>

            {/* Total Footer */}
            <div className="p-5 bg-[#0a0d0f] text-white flex items-center justify-between">
              <div>
                <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-white/70 block font-semibold">
                  Inversión Total del Encargo
                </span>
                <span className="text-[11px] text-white/50">
                  Calculado y validado en servidor
                </span>
              </div>
              <span className="text-2xl font-bold font-mono tabular-nums text-white">
                ${order.totalPrice.toFixed(2)} <span className="font-cabin text-xs text-[#1dd8e1]">USD</span>
              </span>
            </div>
          </div>

          {/* Audit Trail: Status Logs */}
          <div className="admin-card p-6">
            <span className="admin-subtitle">Trazabilidad & Seguridad</span>
            <h3 className="admin-title text-base mb-4">Historial de Cambios de Estado</h3>

            {order.statusLogs?.length > 0 ? (
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#e5e4e2]">
                {order.statusLogs.map((log: any, idx: number) => (
                  <div key={log.id || idx} className="flex items-start gap-3 relative pl-8">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1c1917] absolute left-2.5 top-1.5" />
                    <div className="bg-[#fafaf9] border border-[#e5e4e2] p-3 rounded-[3px] flex-1 text-[12px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[#1c1917]">
                          De {log.fromStatus || 'inicial'} → {log.toStatus}
                        </span>
                        <span className="font-cabin text-[10px] text-[#78716c]">
                          {formatDate(log.createdAt, 'long')}
                        </span>
                      </div>
                      {log.note && <p className="text-[#78716c] mt-1">{log.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[#78716c] italic">
                Sin cambios de estado adicionales registrados en el historial de auditoría.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Customer Details & Internal Notes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <div className="admin-card p-5">
            <div className="flex items-center justify-between border-b border-[#e5e4e2] pb-3 mb-4">
              <span className="font-cabin text-[10px] uppercase tracking-[0.14em] font-semibold text-[#78716c]">
                Ficha del Cliente
              </span>
              <button
                type="button"
                onClick={() => setIsEditingClient(!isEditingClient)}
                className="text-[11px] font-cabin uppercase font-bold text-[#1c1917] hover:underline"
              >
                {isEditingClient ? 'Cancelar' : 'Editar Datos'}
              </button>
            </div>

            {isEditingClient ? (
              <div className="space-y-3 text-[13px]">
                <div>
                  <label className="admin-label">Nombre del Cliente</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Roberto Sánchez"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ej. +57 310 540 1603"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label">Correo Electrónico</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cliente@ejemplo.com"
                    className="admin-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="admin-btn admin-btn-primary w-full mt-2"
                >
                  {savingNotes ? 'Guardando...' : 'Guardar Datos del Cliente'}
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-[13px]">
                <div>
                  <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] block">Nombre</span>
                  <p className="font-medium text-[#1c1917] mt-0.5">{clientName || 'Sin nombre registrado'}</p>
                </div>
                <div>
                  <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] block">Teléfono / WA</span>
                  {clientPhone ? (
                    <a
                      href={`https://wa.me/${clientPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[#166534] hover:underline block mt-0.5"
                    >
                      {clientPhone} ↗
                    </a>
                  ) : (
                    <p className="text-[#a8a29e] italic mt-0.5">No proporcionado</p>
                  )}
                </div>
                <div>
                  <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] block">Email</span>
                  <p className="text-[#1c1917] mt-0.5">{clientEmail || 'No proporcionado'}</p>
                </div>
                {order.clientNotes && (
                  <div className="pt-2 border-t border-[#e5e4e2]">
                    <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] block">Mensaje del Cliente</span>
                    <p className="text-[#1c1917] text-[12px] bg-[#fafaf9] p-2.5 rounded-[3px] mt-1 leading-relaxed">
                      "{order.clientNotes}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Internal Workshop Notes */}
          <div className="admin-card p-5">
            <span className="font-cabin text-[10px] uppercase tracking-[0.14em] font-semibold text-[#78716c] block mb-1">
              Cuaderno del Taller
            </span>
            <h3 className="font-jost font-bold text-sm text-[#1c1917] mb-2">
              Notas Internas de Fabricación
            </h3>
            <p className="text-[12px] text-[#78716c] mb-3 leading-relaxed">
              Registra números de guía, tiempos de secado, regulación de cronocomparador o detalles exclusivos para el equipo. El cliente nunca verá este campo.
            </p>

            <textarea
              rows={5}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Ej. Regulación en cronocomparador a +4s/día. Caja pulida. Envío confirmado para el viernes."
              className="admin-input mb-3"
            />

            <div className="flex items-center justify-between">
              {notesSaved ? (
                <span className="text-[12px] font-cabin uppercase font-bold text-[#166534]">
                  ✓ Notas guardadas
                </span>
              ) : (
                <span className="text-[11px] text-[#a8a29e]">Sin cambios pendientes</span>
              )}

              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="admin-btn admin-btn-primary"
              >
                {savingNotes ? 'Guardando...' : 'Guardar Notas'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
