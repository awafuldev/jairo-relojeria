'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <aside className="w-64 min-h-screen border-r border-[#d5d6d7] flex flex-col sticky top-0 h-screen overflow-y-auto shrink-0 bg-[#ffffff] font-poppins">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#d5d6d7]">
        <Link href="/" className="font-jost font-bold tracking-[0.14em] uppercase text-[#0a0d0f] text-[13px]">
          Jairo Relojería
        </Link>
        <span className="font-cabin text-[9px] uppercase tracking-wider text-[#1dd8e1] font-semibold bg-[#0a0d0f] px-1.5 py-0.5 rounded-[2px]">
          Taller
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-6">
        {/* Dashboard */}
        <div>
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2 text-[12px] font-cabin uppercase tracking-[0.08em] rounded-[3px] transition-all ${
              pathname === '/admin'
                ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
                : 'text-[#2e3438] hover:bg-[#f7f7f7] hover:text-[#0a0d0f]'
            }`}
          >
            <span className={`text-[13px] w-4 ${pathname === '/admin' ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}`}>◈</span>
            <span>Dashboard</span>
          </Link>
        </div>

        {/* TIENDA DE RELOJES SEIKO */}
        <div className="space-y-1">
          <p className="px-3 text-[9px] font-cabin uppercase tracking-[0.16em] text-[#a5a7a8] font-bold">
            Tienda (Relojes Completos)
          </p>
          <Link
            href="/admin/watches"
            className={`flex items-center gap-3 px-3 py-2 text-[12px] font-cabin uppercase tracking-[0.08em] rounded-[3px] transition-all ${
              pathname.startsWith('/admin/watches')
                ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
                : 'text-[#2e3438] hover:bg-[#f7f7f7] hover:text-[#0a0d0f]'
            }`}
          >
            <span className={`text-[13px] w-4 ${pathname.startsWith('/admin/watches') ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}`}>⌚</span>
            <span>Relojes Seiko ({'Catálogo'})</span>
          </Link>
        </div>

        {/* PERSONALIZACIÓN & CONFIGURADOR */}
        <div className="space-y-1">
          <p className="px-3 text-[9px] font-cabin uppercase tracking-[0.16em] text-[#a5a7a8] font-bold">
            Personalización (Componentes)
          </p>
          <Link
            href="/admin/pieces"
            className={`flex items-center gap-3 px-3 py-2 text-[12px] font-cabin uppercase tracking-[0.08em] rounded-[3px] transition-all ${
              pathname.startsWith('/admin/pieces')
                ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
                : 'text-[#2e3438] hover:bg-[#f7f7f7] hover:text-[#0a0d0f]'
            }`}
          >
            <span className={`text-[13px] w-4 ${pathname.startsWith('/admin/pieces') ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}`}>◇</span>
            <span>Componentes del Taller</span>
          </Link>

          <Link
            href="/admin/categories"
            className={`flex items-center gap-3 px-3 py-2 text-[12px] font-cabin uppercase tracking-[0.08em] rounded-[3px] transition-all ${
              pathname.startsWith('/admin/categories')
                ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
                : 'text-[#2e3438] hover:bg-[#f7f7f7] hover:text-[#0a0d0f]'
            }`}
          >
            <span className={`text-[13px] w-4 ${pathname.startsWith('/admin/categories') ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}`}>≡</span>
            <span>Categorías (12 Pasos)</span>
          </Link>

          <Link
            href="/admin/compatibility"
            className={`flex items-center gap-3 px-3 py-2 text-[12px] font-cabin uppercase tracking-[0.08em] rounded-[3px] transition-all ${
              pathname.startsWith('/admin/compatibility')
                ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
                : 'text-[#2e3438] hover:bg-[#f7f7f7] hover:text-[#0a0d0f]'
            }`}
          >
            <span className={`text-[13px] w-4 ${pathname.startsWith('/admin/compatibility') ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}`}>⊕</span>
            <span>Reglas Físicas</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 px-3 py-2 text-[12px] font-cabin uppercase tracking-[0.08em] rounded-[3px] transition-all ${
              pathname.startsWith('/admin/orders')
                ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
                : 'text-[#2e3438] hover:bg-[#f7f7f7] hover:text-[#0a0d0f]'
            }`}
          >
            <span className={`text-[13px] w-4 ${pathname.startsWith('/admin/orders') ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}`}>◻</span>
            <span>Diseños Guardados</span>
          </Link>
        </div>

        {/* AJUSTES & SISTEMA */}
        <div className="space-y-1">
          <p className="px-3 text-[9px] font-cabin uppercase tracking-[0.16em] text-[#a5a7a8] font-bold">
            Sistema
          </p>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2 text-[12px] font-cabin uppercase tracking-[0.08em] rounded-[3px] transition-all ${
              pathname.startsWith('/admin/settings')
                ? 'bg-[#0a0d0f] text-[#ffffff] font-semibold'
                : 'text-[#2e3438] hover:bg-[#f7f7f7] hover:text-[#0a0d0f]'
            }`}
          >
            <span className={`text-[13px] w-4 ${pathname.startsWith('/admin/settings') ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}`}>⚙</span>
            <span>Ajustes & Contraseña</span>
          </Link>
        </div>
      </nav>

      {/* Footer Quick Links */}
      <div className="p-3 border-t border-[#d5d6d7] space-y-1">
        <Link
          href="/catalog"
          className="flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-cabin uppercase tracking-[0.08em] text-[#2e3438] hover:text-[#0a0d0f] hover:bg-[#f7f7f7] rounded-[3px] transition-colors"
          target="_blank"
        >
          <span className="text-[12px] text-[#1dd8e1]">↗</span>
          <span>Ver Tienda</span>
        </Link>
        <Link
          href="/configurator"
          className="flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-cabin uppercase tracking-[0.08em] text-[#2e3438] hover:text-[#0a0d0f] hover:bg-[#f7f7f7] rounded-[3px] transition-colors"
          target="_blank"
        >
          <span className="text-[12px] text-[#1dd8e1]">↗</span>
          <span>Ver Configurador</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-[11px] font-cabin uppercase tracking-[0.08em] text-[#2e3438] hover:text-[#dc2626] hover:bg-[#f7f7f7] rounded-[3px] transition-colors text-left"
        >
          <span className="text-[12px]">→</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
