export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma, ensureDbReady } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge, formatPrice, formatDate } from '@/components/admin/AdminUtils'

interface ConfigurationsPageProps {
  searchParams: Promise<{
    search?: string
    page?: string
  }>
}

export default async function AdminConfigurationsPage({ searchParams }: ConfigurationsPageProps) {
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  await ensureDbReady()

  const { search, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1'))
  const pageSize = 12

  const where: any = {}

  if (search && search.trim()) {
    const q = search.trim()
    where.OR = [
      { shareCode: { contains: q } },
      { shareToken: { contains: q } },
      { name: { contains: q } },
      { clientName: { contains: q } },
    ]
  }

  const [totalCount, configs] = await Promise.all([
    prisma.configuration.count({ where }),
    prisma.configuration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        items: {
          include: {
            piece: {
              select: {
                id: true,
                name: true,
                sku: true,
                productImage: true,
                thumbnail: true,
              },
            },
            category: {
              select: { id: true, name: true, step: true },
            },
          },
        },
      },
    }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Diseños Bespoke · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Configuraciones de Clientes ({totalCount})
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Todos los diseños y combinaciones creados por usuarios en el configurador en vivo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/configurator"
            target="_blank"
            className="admin-btn admin-btn-primary"
          >
            + Abrir Configurador Público ↗
          </Link>
        </div>
      </div>

      {/* Info notice explaining the difference between a saved design and a confirmed order */}
      <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-[4px] mb-6 text-[13px] text-blue-900 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <span className="font-semibold block text-[13px]">Distinción Comercial Clave:</span>
          <p className="text-[12px] text-blue-800 leading-relaxed mt-0.5">
            Una configuración guardada representa una intención de diseño generada por un cliente o visitante. No implica necesariamente una compra en firme hasta que sea contactado o pase al estado <strong>Confirmado</strong> en la sección de <Link href="/admin/orders" className="underline font-semibold">Pedidos</Link>.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-[#e5e4e2] rounded-[4px] mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form method="GET" action="/admin/configurations" className="flex-1 w-full sm:max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Buscar por código de diseño o nombre..."
              className="admin-input pl-9"
            />
            <svg className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button type="submit" className="admin-btn admin-btn-secondary">
            Buscar
          </button>
          {search && (
            <Link href="/admin/configurations" className="text-[12px] text-[#78716c] hover:text-black underline ml-1">
              Limpiar
            </Link>
          )}
        </form>

        <span className="text-[12px] text-[#78716c] font-cabin uppercase tracking-wider">
          {totalCount} diseños registrados
        </span>
      </div>

      {/* Configurations Grid */}
      {configs.length === 0 ? (
        <div className="admin-card admin-empty">
          <p className="admin-empty-title">No hay configuraciones guardadas</p>
          <p className="text-[12px] max-w-sm">
            Los diseños que los clientes guarden en el taller interactivo se listarán en esta cuadrícula.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configs.map((config) => {
            const code = config.shareCode || config.shareToken.slice(0, 8).toUpperCase()
            const previewItem = config.items.find(i => i.piece.productImage || i.piece.thumbnail)

            return (
              <div key={config.id} className="admin-card overflow-hidden flex flex-col justify-between hover:border-[#1c1917] transition-all duration-200">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#92680a] bg-amber-50 px-2 py-0.5 rounded-[2px] block w-fit mb-1">
                        {code}
                      </span>
                      <h3 className="font-jost font-bold text-base text-[#1c1917] leading-snug">
                        {config.name || 'Diseño Bespoke Seiko'}
                      </h3>
                      <p className="text-[11px] text-[#78716c] mt-0.5">
                        Creado el {formatDate(config.createdAt, 'short')}
                      </p>
                    </div>

                    <StatusBadge status={config.status} size="xs" />
                  </div>

                  {/* Thumbnail and items count */}
                  <div className="my-4 p-3 bg-[#fafaf9] rounded-[4px] border border-[#e5e4e2] flex items-center gap-3">
                    <div className="w-14 h-14 bg-white border border-[#e5e4e2] rounded-[3px] p-1 flex items-center justify-center shrink-0">
                      {previewItem?.piece.thumbnail || previewItem?.piece.productImage ? (
                        <img
                          src={previewItem.piece.thumbnail || previewItem.piece.productImage || ''}
                          alt="Diseño"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 text-[12px]">
                      <p className="font-semibold text-[#1c1917]">
                        {config.items.length} piezas seleccionadas
                      </p>
                      {config.clientName && (
                        <p className="text-[11px] text-[#78716c] truncate">
                          Cliente: {config.clientName}
                        </p>
                      )}
                      {config.engravingText && (
                        <p className="text-[10px] text-[#92680a] truncate">
                          Láser: "{config.engravingText}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-cabin text-[10px] uppercase tracking-wider text-[#78716c]">
                      Inversión Calculada
                    </span>
                    <span className="font-mono text-base font-bold text-[#1c1917] tabular-nums">
                      ${config.totalPrice.toFixed(0)} <span className="font-cabin text-xs text-[#78716c]">USD</span>
                    </span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-[#fafaf9] border-t border-[#e5e4e2] flex items-center justify-between gap-2">
                  <Link
                    href={`/admin/orders/${config.id}`}
                    className="admin-btn admin-btn-secondary text-[10px] py-1.5 flex-1"
                  >
                    Ficha Comercial →
                  </Link>
                  <Link
                    href={`/configurator/${config.shareCode || config.shareToken}`}
                    target="_blank"
                    className="admin-btn admin-btn-primary text-[10px] py-1.5 flex-1"
                  >
                    Ver en 1:1 ↗
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
