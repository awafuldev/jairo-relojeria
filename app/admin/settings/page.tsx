'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    brandName: '',
    currency: 'USD',
    contactEmail: '',
    baseWatchPrice: '0'
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
      setCredMsg({ text: 'Por favor introduce tu contraseña actual para confirmar', type: 'error' })
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
        setCredMsg({ text: data.message || 'Credenciales actualizadas exitosamente', type: 'success' })
        setCurrentPassword('')
        setNewPassword('')
        setNewEmail('')
      } else {
        setCredMsg({ text: data.error || 'Error al actualizar credenciales', type: 'error' })
      }
    } catch {
      setCredMsg({ text: 'Error de conexión', type: 'error' })
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
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        setMessage({ text: 'Settings saved successfully', type: 'success' })
      } else {
        setMessage({ text: 'Failed to save settings', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'An error occurred', type: 'error' })
    }
    setSaving(false)
  }

  if (loading) return <div className="p-8 text-[13px] text-[#686c6d]">Loading settings...</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="caption text-[#a5a7a8] mb-1">Ajustes del Sistema</p>
          <h1 className="heading-lg">Configuración de la Tienda</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-[2px] text-[13px] ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className="border border-[#dbdbdb] rounded-[2px] p-6 bg-white space-y-4 text-[13px]">
          <h2 className="label text-[#262626]">Información de la Marca</h2>
          <div>
            <label className="caption text-[#686c6d] block mb-1">Nombre de la Marca</label>
            <input
              type="text"
              name="brandName"
              value={settings.brandName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="caption text-[#686c6d] block mb-1">Moneda Principal</label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] bg-white focus:outline-none focus:border-black"
            >
              <option value="USD">USD ($) - Dólares Estadounidenses</option>
              <option value="EUR">EUR (€) - Euros</option>
              <option value="MXN">MXN ($) - Pesos Mexicanos</option>
            </select>
          </div>
          <div>
            <label className="caption text-[#686c6d] block mb-1">Email de Notificación de Pedidos</label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="caption text-[#686c6d] block mb-1">Precio Base del Reloj</label>
            <input
              type="number"
              name="baseWatchPrice"
              value={settings.baseWatchPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="border border-[#dbdbdb] rounded-[2px] p-6 bg-white space-y-4 text-[13px]">
          <h2 className="label text-[#262626]">Motor de Configurador</h2>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enforceStrict"
              defaultChecked
              className="w-4 h-4 rounded-[2px] accent-black"
            />
            <label htmlFor="enforceStrict" className="text-[#262626]">
              Bloqueo estricto de combinaciones incompatibles (recomendado)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showUnavailable"
              defaultChecked
              className="w-4 h-4 rounded-[2px] accent-black"
            />
            <label htmlFor="showUnavailable" className="text-[#262626]">
              Mostrar piezas incompatibles en gris con tooltip explicativo
            </label>
          </div>
        </div>

        {/* Security / Credentials Section */}
        <div className="border border-[#dbdbdb] rounded-[2px] p-6 bg-white space-y-4 text-[13px]">
          <h2 className="label text-[#262626]">Seguridad de la Cuenta de Administrador</h2>
          <p className="caption text-[#686c6d]">
            Cambia tus credenciales de acceso al panel administrativo sin necesidad de tocar la base de datos manualmente.
          </p>

          {credMsg.text && (
            <div className={`p-3 rounded-[2px] text-[12px] ${credMsg.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {credMsg.text}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="caption text-[#686c6d] block mb-1">Nuevo Correo Electrónico (Opcional)</label>
              <input
                type="email"
                placeholder="nuevo-admin@tudominio.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="caption text-[#686c6d] block mb-1">Nueva Contraseña (mínimo 6 caracteres)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="caption text-[#686c6d] block mb-1">Contraseña Actual * (Requerida para confirmar)</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black"
              />
            </div>
            <button
              type="button"
              onClick={handleUpdateCredentials}
              disabled={credSaving}
              className="btn-primary text-[11px] py-2.5 px-4"
            >
              {credSaving ? 'Actualizando...' : 'Actualizar Credenciales de Administrador'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
