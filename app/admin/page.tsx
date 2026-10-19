export const dynamic = 'force-dynamic'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await auth()

  const [pieceCount, categoryCount, configCount, ruleCount] = await Promise.all([
    prisma.piece.count(),
    prisma.category.count(),
    prisma.configuration.count(),
    prisma.compatibilityRule.count(),
  ])

  // Count Seiko watches in store
  const watchCountRes = await prisma.$queryRawUnsafe<any[]>(`
    SELECT count(*) as count FROM "WatchProduct"
  `)
  const watchCount = Number(watchCountRes[0]?.count || 0)

  const recentConfigs = await prisma.configuration.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { category: true, piece: true } } },
  })

  return (
    <div className="p-8 max-w-5xl font-poppins">
      <div className="mb-8">
        <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-[#1dd8e1] font-semibold block mb-1">
          Taller & Tienda
        </span>
        <h1 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em]">
          Panel de Control — Jairo Relojería
        </h1>
        <p className="text-[13px] text-[#2e3438] mt-1">
          Administración centralizada de la tienda de relojes Seiko y del taller de personalización bespoke.
        </p>
      </div>

      {/* Two-Tier Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <Link
          href="/admin/watches"
          className="blok-card p-5 hover:border-[#0a0d0f] transition-all group col-span-2 md:col-span-1 bg-[#f7f7f7]"
        >
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#1dd8e1] font-bold block mb-1">Tienda</span>
          <p className="font-jost text-3xl font-bold text-[#0a0d0f] tracking-tight group-hover:text-[#1dd8e1] transition-colors">
            {watchCount}
          </p>
          <p className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438] mt-1 font-semibold">
            Relojes Seiko
          </p>
        </Link>

        {[
          { label: 'Componentes', value: pieceCount, href: '/admin/pieces', tag: 'Taller' },
          { label: 'Categorías', value: categoryCount, href: '/admin/categories', tag: 'Taller' },
          { label: 'Diseños', value: configCount, href: '/admin/orders', tag: 'Bespoke' },
          { label: 'Reglas Físicas', value: ruleCount, href: '/admin/compatibility', tag: 'Taller' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="blok-card p-5 hover:border-[#0a0d0f] transition-all group"
          >
            <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] block mb-1">{stat.tag}</span>
            <p className="font-jost text-3xl font-bold text-[#0a0d0f] tracking-tight group-hover:text-[#1dd8e1] transition-colors">
              {stat.value}
            </p>
            <p className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438] mt-1 font-semibold">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions split into Shop and Customizer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Shop actions */}
        <div className="border border-[#d5d6d7] p-5 rounded-[3px] bg-[#ffffff] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold text-[#0a0d0f]">
              Tienda de Relojes Seiko
            </h3>
            <span className="font-cabin text-[9px] uppercase tracking-wider text-[#1dd8e1] bg-[#0a0d0f] px-1.5 py-0.5 rounded-[2px] font-bold">
              Catálogo
            </span>
          </div>
          <p className="text-[12px] text-[#2e3438]">
            Gestiona los modelos terminados que los clientes pueden comprar directamente.
          </p>
          <div className="flex gap-2 pt-1">
            <Link href="/admin/watches/new" className="btn-teal text-[10px] py-2 px-3">
              + Nuevo Reloj
            </Link>
            <Link href="/admin/watches" className="btn-outline-dark text-[10px] py-2 px-3">
              Ver Catálogo Tienda
            </Link>
          </div>
        </div>

        {/* Customizer actions */}
        <div className="border border-[#d5d6d7] p-5 rounded-[3px] bg-[#ffffff] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold text-[#0a0d0f]">
              Taller de Personalización
            </h3>
            <span className="font-cabin text-[9px] uppercase tracking-wider text-[#0a0d0f] bg-[#f7f7f7] border border-[#d5d6d7] px-1.5 py-0.5 rounded-[2px] font-bold">
              Configurador
            </span>
          </div>
          <p className="text-[12px] text-[#2e3438]">
            Administra piezas, fotos transparentes de composición y compatibilidad.
          </p>
          <div className="flex gap-2 pt-1">
            <Link href="/admin/pieces/new" className="btn-outline-dark text-[10px] py-2 px-3">
              + Nueva Pieza
            </Link>
            <Link href="/admin/pieces" className="btn-outline-dark text-[10px] py-2 px-3">
              Ver Componentes
            </Link>
            <Link href="/admin/compatibility" className="btn-outline-dark text-[10px] py-2 px-3">
              Reglas
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Configurations */}
      {recentConfigs.length > 0 && (
        <div>
          <p className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f] mb-3">
            Últimos Diseños Creados por Clientes en el Configurador
          </p>
          <div className="border border-[#d5d6d7] rounded-[3px] bg-[#ffffff] divide-y divide-[#d5d6d7] overflow-hidden">
            {recentConfigs.map(config => (
              <div key={config.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-poppins font-medium text-[13px] text-[#0a0d0f]">
                    {config.name || 'Diseño Bespoke'}
                  </p>
                  <p className="font-cabin text-[11px] text-[#2e3438] mt-0.5">
                    {config.items.length} componentes montados · {new Date(config.createdAt).toLocaleDateString()}
                    {config.shareCode && <span className="font-mono text-[#1dd8e1] font-bold ml-2">[{config.shareCode}]</span>}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[14px] font-semibold text-[#0a0d0f] tabular-nums">
                    ${config.totalPrice.toFixed(0)} USD
                  </p>
                  <Link
                    href={`/configurator/${config.shareCode || config.shareToken}`}
                    target="_blank"
                    className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] hover:text-[#0a0d0f] underline"
                  >
                    Ver en 1:1 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
