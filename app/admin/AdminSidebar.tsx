'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  section?: string
  icon: (active: boolean) => React.ReactNode
  badge?: string | number
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname === '/admin/login') {
    return null
  }

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('jairo_admin_sidebar_collapsed')
    if (saved !== null) {
      setCollapsed(saved === 'true')
    }
  }, [])

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('jairo_admin_sidebar_collapsed', String(next))
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const navSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'Principal',
      items: [
        {
          href: '/admin',
          label: 'Dashboard',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          ),
        },
        {
          href: '/admin/orders',
          label: 'Pedidos',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          href: '/admin/configurations',
          label: 'Diseños Guardados',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Catálogo & Taller',
      items: [
        {
          href: '/admin/watches',
          label: 'Relojes Seiko',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M9 21h6" />
            </svg>
          ),
        },
        {
          href: '/admin/pieces',
          label: 'Componentes',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.46 3.59.835 5.562a.64.64 0 01-.453.738 2.25 2.25 0 00-1.428 2.115c0 1.243 1.007 2.25 2.25 2.25.75 0 1.417-.367 1.834-.932a.64.64 0 01.763-.263c1.69.57 3.535.88 5.449.88 1.913 0 3.759-.31 5.448-.88a.64.64 0 01.764.263 2.25 2.25 0 001.833.932c1.243 0 2.25-1.007 2.25-2.25 0-.91-.54-1.694-1.428-2.115a.64.64 0 01-.453-.738 48.46 48.46 0 00.835-5.562 48.34 48.34 0 00-4.163.3.64.64 0 01-.657-.643v0z" />
            </svg>
          ),
        },
        {
          href: '/admin/categories',
          label: 'Categorías (12 Pasos)',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
            </svg>
          ),
        },
        {
          href: '/admin/compatibility',
          label: 'Compatibilidad Física',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Inteligencia & Control',
      items: [
        {
          href: '/admin/reports',
          label: 'Informes & Métricas',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          ),
        },
        {
          href: '/admin/settings',
          label: 'Ajustes del Sistema',
          icon: (active) => (
            <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-[#1dd8e1]' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
      ],
    },
  ]

  const isItemActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0d0f] text-[#d5d6d7] font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Brand & Collapse Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2e3438] shrink-0">
        <Link href="/admin" className={`flex items-center gap-2.5 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded-[3px] bg-[#1dd8e1] text-[#0a0d0f] flex items-center justify-center font-jost font-bold text-sm shrink-0 tracking-wider">
            JR
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-jost font-bold text-[13px] tracking-[0.14em] uppercase text-white block truncate leading-tight">
                Jairo Relojería
              </span>
              <span className="font-cabin text-[9px] uppercase tracking-[0.16em] text-[#1dd8e1] font-semibold block">
                Taller & Boutique
              </span>
            </div>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={toggleCollapsed}
            aria-label="Contraer barra lateral"
            className="hidden md:flex text-[#525a60] hover:text-white p-1.5 rounded-[3px] hover:bg-[#2e3438]/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {collapsed && (
        <div className="hidden md:flex justify-center py-2 border-b border-[#2e3438]">
          <button
            onClick={toggleCollapsed}
            aria-label="Expandir barra lateral"
            className="text-[#525a60] hover:text-white p-1 rounded-[3px] hover:bg-[#2e3438]/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="flex-1 py-4 px-2 space-y-6 overflow-y-auto">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[9px] font-cabin uppercase tracking-[0.18em] text-[#525a60] font-bold">
                {sec.title}
              </p>
            )}
            {sec.items.map((item) => {
              const active = isItemActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[3px] text-[12px] font-cabin uppercase tracking-[0.08em] transition-all duration-150 group relative ${
                    active
                      ? 'bg-[#1dd8e1] text-[#0a0d0f] font-bold shadow-sm'
                      : 'text-[#d5d6d7] hover:bg-[#2e3438]/60 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  {item.icon(active)}
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {active && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0a0d0f]" />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer Quick Links & User */}
      <div className="p-3 border-t border-[#2e3438] shrink-0 space-y-1.5 bg-[#050708]">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-cabin uppercase tracking-wider text-[#525a60]">
            <span>Accesos Rápidos</span>
            <span className="text-[#1dd8e1]">Vercel Pro</span>
          </div>
        )}

        <Link
          href="/catalog"
          target="_blank"
          title="Ver Catálogo Público"
          className={`flex items-center gap-2.5 px-3 py-2 text-[11px] font-cabin uppercase tracking-[0.08em] text-[#d5d6d7] hover:text-white hover:bg-[#2e3438]/40 rounded-[3px] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-3.5 h-3.5 text-[#1dd8e1] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {!collapsed && <span>Ver Tienda</span>}
        </Link>

        <Link
          href="/configurator"
          target="_blank"
          title="Ver Configurador 3D/Capas"
          className={`flex items-center gap-2.5 px-3 py-2 text-[11px] font-cabin uppercase tracking-[0.08em] text-[#d5d6d7] hover:text-white hover:bg-[#2e3438]/40 rounded-[3px] transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-3.5 h-3.5 text-[#1dd8e1] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          {!collapsed && <span>Ver Configurador</span>}
        </Link>

        <button
          onClick={handleSignOut}
          title="Cerrar Sesión de Administrador"
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-cabin uppercase tracking-[0.08em] text-[#e06c75] hover:text-white hover:bg-[#e06c75]/20 rounded-[3px] transition-colors text-left ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0a0d0f] border-b border-[#2e3438] px-4 h-14 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[3px] bg-[#1dd8e1] text-[#0a0d0f] flex items-center justify-center font-jost font-bold text-xs tracking-wider">
            JR
          </div>
          <span className="font-jost font-bold text-xs uppercase tracking-wider text-white">
            Jairo Relojería Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Abrir menú"
          className="p-2 text-[#d5d6d7] hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-full h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:flex flex-col sticky top-0 h-screen shrink-0 transition-all duration-200 z-30 border-r border-[#2e3438] ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
