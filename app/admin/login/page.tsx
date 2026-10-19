export const dynamic = 'force-dynamic'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales incorrectas')
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-8">
      {/* Top logo */}
      <div className="flex items-center justify-between">
        <Link href="/" className="font-jost font-bold tracking-[0.14em] uppercase text-[#0a0d0f] text-[14px]">
          Jairo Relojería
        </Link>
        <span className="font-cabin text-[10px] uppercase tracking-wider text-[#1dd8e1] font-semibold bg-[#0a0d0f] px-2 py-0.5 rounded-[2px]">
          Portal de Taller
        </span>
      </div>

      {/* Center form */}
      <div className="max-w-sm w-full mx-auto">
        <div className="mb-8">
          <p className="caption text-[#a5a7a8] mb-1">Acceso Seguro</p>
          <h1 className="heading-lg">Iniciar Sesión</h1>
          <p className="caption text-[#686c6d] mt-2">
            Gestiona el catálogo de piezas, reglas de compatibilidad y configuraciones.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#ededed] border border-[#dbdbdb] text-[12px] text-black rounded-[2px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          <div>
            <label className="caption text-[#686c6d] block mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label className="caption text-[#686c6d] block mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#dbdbdb] rounded-[2px] focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 mt-2"
          >
            {loading ? 'Accediendo...' : 'Entrar al Dashboard →'}
          </button>
        </form>



      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="caption text-[#a5a7a8]">© {new Date().getFullYear()} Jairo Relojería — Sistema de Catálogo Administrable</p>
      </div>
    </div>
  )
}
