'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    brandName: '',
    currency: 'USD',
    contactEmail: '',
    baseWatchPrice: '0',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Credential management state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [credSaving, setCredSaving] = useState(false)
  const [credMsg, setCredMsg] = useState({ text: '', type: '' })

  const handleUpdateCredentials = async () => {
    if (!currentPassword) {
      setCredMsg({ text: 'Por favor introduce tu contraseña actual para confirmar el cambio', type: 'error' })
      return
    }
    setCredSaving(true)
    setCredMsg({ text: '', type: '' })
    try {
      const res = await fetch('/api/admin/auth/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword: newPassword || undefined,
          newEmail: newEmail || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setCredMsg({ text: data.message || '✓ Credenciales actualizadas exitosamente', type: 'success' })
        setCurrentPassword('')
        setNewPassword('')
        setNewEmail('')
      } else {
        setCredMsg({ text: data.error || 'Error al actualizar credenciales', type: 'error' })
      }
    } catch {
      setCredMsg({ text: 'Error de conexión con el servidor', type: 'error' })
    } finally {
      setCredSaving(false)
    }
  }

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }))
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load settings:', err)
        setLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setMessage({ text: '✓ Ajustes de la tienda guardados correctamente', type: 'success' })
      } else {
        setMessage({ text: 'Error al guardar los ajustes', type: 'error' })
      }
    } catch {
      setMessage({ text: 'Error de comunicación', type: 'error' })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-card admin-empty">
          <p className="admin-empty-title">Cargando configuración del sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Sistema & Seguridad · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Configuración de la Plataforma
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Parámetros comerciales, moneda por defecto y credenciales seguras del administrador.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary self-start"
        >
          {saving ? 'Guardando...' : 'Guardar Ajustes'}
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-[4px] text-[13px] border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand & Commercial Settings */}
        <div className="admin-card p-6 space-y-4">
          <span className="admin-subtitle">Parámetros Comerciales</span>
          <h2 className="admin-title text-base mb-3">Información de la Marca</h2>

          <div>
            <label className="admin-label">Nombre Comercial</label>
            <input
              type="text"
              name="brandName"
              value={settings.brandName}
              onChange={handleChange}
              className="admin-input"
            />
          </div>

          <div>
            <label className="admin-label">Moneda de Facturación</label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="admin-input"
            >
              <option value="USD">USD ($) - Dólares Estadounidenses</option>
              <option value="EUR">EUR (€) - Euros</option>
              <option value="COP">COP ($) - Pesos Colombianos</option>
              <option value="DOP">DOP ($) - Pesos Dominicanos</option>
            </select>
          </div>

          <div>
            <label className="admin-label">Email Oficial de Notificaciones</label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="admin-input"
            />
          </div>

          <div>
            <label className="admin-label">Precio Base del Reloj (Ensamblado Inicial)</label>
            <input
              type="number"
              name="baseWatchPrice"
              value={settings.baseWatchPrice}
              onChange={handleChange}
              className="admin-input font-mono tabular-nums"
            />
          </div>
        </div>

        {/* Engine Physics & Security Settings */}
        <div className="space-y-8">
          <div className="admin-card p-6 space-y-3">
            <span className="admin-subtitle">Motor del Configurador</span>
            <h2 className="admin-title text-base mb-2">Comportamiento del Taller</h2>

            <div className="flex items-start gap-3 p-3 bg-[#fafaf9] rounded-[4px] border border-[#e5e4e2]">
              <input
                type="checkbox"
                id="enforceStrict"
                defaultChecked
                className="w-4 h-4 mt-0.5 rounded-[2px] accent-[#1c1917]"
              />
              <label htmlFor="enforceStrict" className="text-[12px] text-[#1c1917] leading-snug">
                <strong>Bloqueo estricto de combinaciones incompatibles:</strong> Evita que un cliente guarde o solicite piezas mecánicamente inviables.
              </label>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#fafaf9] rounded-[4px] border border-[#e5e4e2]">
              <input
                type="checkbox"
                id="showUnavailable"
                defaultChecked
                className="w-4 h-4 mt-0.5 rounded-[2px] accent-[#1c1917]"
              />
              <label htmlFor="showUnavailable" className="text-[12px] text-[#1c1917] leading-snug">
                <strong>Mostrar piezas no aptas en gris:</strong> Informa al usuario visualmente por qué una pieza no encaja con la caja seleccionada.
              </label>
            </div>
          </div>

          {/* Admin Credentials */}
          <div className="admin-card p-6 space-y-4">
            <span className="admin-subtitle">Seguridad de la Cuenta</span>
            <h2 className="admin-title text-base mb-1">Credenciales de Acceso</h2>
            <p className="text-[12px] text-[#78716c] leading-relaxed">
              Actualiza de forma segura el usuario o contraseña del panel sin tocar la base de datos.
            </p>

            {credMsg.text && (
              <div className={`p-3 rounded-[4px] text-[12px] border ${credMsg.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                {credMsg.text}
              </div>
            )}

            <div>
              <label className="admin-label">Nuevo Correo Electrónico (Opcional)</label>
              <input
                type="email"
                placeholder="nuevo-admin@jairorelojeria.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Nueva Contraseña (mínimo 6 caracteres)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Contraseña Actual * (Requerida para confirmar)</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="admin-input"
              />
            </div>

            <button
              type="button"
              onClick={handleUpdateCredentials}
              disabled={credSaving}
              className="admin-btn admin-btn-primary w-full"
            >
              {credSaving ? 'Actualizando...' : 'Actualizar Credenciales'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
