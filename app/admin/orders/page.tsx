export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge, formatPrice, formatDate } from '@/components/admin/AdminUtils'

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
    page?: string
  }>
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  const { status, search, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1'))
  const pageSize = 15

  // Build filter
  const where: any = {}

  if (status && status !== 'all') {
    if (status === 'pending') {
      where.status = { in: ['pending', 'saved', 'ordered'] }
    } else {
      where.status = status
    }
  }

  if (search && search.trim()) {
    const q = search.trim()
    where.OR = [
      { shareCode: { contains: q } },
      { shareToken: { contains: q } },
      { name: { contains: q } },
      { clientName: { contains: q } },
      { clientEmail: { contains: q } },
      { clientPhone: { contains: q } },
      { engravingText: { contains: q } },
    ]
  }

  const [totalCount, orders, statusCounts] = await Promise.all([
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
                compositionImage: true,
                thumbnail: true,
                price: true,
              },
            },
            category: {
              select: { id: true, name: true, step: true, slug: true },
            },
          },
        },
        statusLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }),
    Promise.all([
      prisma.configuration.count(),
      prisma.configuration.count({ where: { status: { in: ['pending', 'saved', 'ordered'] } } }),
      prisma.configuration.count({ where: { status: 'confirmed' } }),
      prisma.configuration.count({ where: { status: 'in_progress' } }),
      prisma.configuration.count({ where: { status: 'completed' } }),
      prisma.configuration.count({ where: { status: 'cancelled' } }),
    ]),
  ])

  const [allCount, pendingCount, confirmedCount, inProgressCount, completedCount, cancelledCount] = statusCounts
  const totalPages = Math.ceil(totalCount / pageSize) || 1

  const filterTabs = [
    { id: 'all', label: 'Todos', count: allCount },
    { id: 'pending', label: 'Pendientes', count: pendingCount },
    { id: 'confirmed', label: 'Confirmados', count: confirmedCount },
    { id: 'in_progress', label: 'En Preparación', count: inProgressCount },
    { id: 'completed', label: 'Completados', count: completedCount },
    { id: 'cancelled', label: 'Cancelados', count: cancelledCount },
  ]

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Gestión Comercial · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Pedidos & Encargos Personalizados
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Control de producción bespoke, seguimiento de clientes y confirmación de presupuestos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/configurator"
            target="_blank"
            className="admin-btn admin-btn-primary"
          >
            + Crear Encargo en Configurador ↗
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#e5e4e2]">
        {filterTabs.map((tab) => {
          const isActive = (!status && tab.id === 'all') || status === tab.id
          const href = tab.id === 'all'
            ? search ? `/admin/orders?search=${encodeURIComponent(search)}` : '/admin/orders'
            : `/admin/orders?status=${tab.id}${search ? `&search=${encodeURIComponent(search)}` : ''}`

          return (
            <Link
              key={tab.id}
              href={href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[4px] text-[12px] font-cabin uppercase tracking-[0.08em] whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1c1917] text-white font-bold'
                  : 'bg-white text-[#78716c] hover:bg-[#f5f4f2] hover:text-[#1c1917] border border-[#e5e4e2]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-[#1dd8e1] text-[#0a0d0f] font-bold' : 'bg-[#e5e4e2] text-[#78716c]'
              }`}>
                {tab.count}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white p-4 border border-[#e5e4e2] rounded-[4px] mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form method="GET" action="/admin/orders" className="flex-1 w-full sm:max-w-md flex items-center gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="relative flex-1">
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Buscar por código, cliente, teléfono, email..."
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
            <Link
              href={status ? `/admin/orders?status=${status}` : '/admin/orders'}
              className="text-[12px] text-[#78716c] hover:text-black underline ml-1"
            >
              Limpiar
            </Link>
          )}
        </form>

        <span className="text-[12px] text-[#78716c] font-cabin uppercase tracking-wider">
          Mostrando {orders.length} de {totalCount} pedidos
        </span>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="admin-card admin-empty">
          <svg className="w-12 h-12 text-[#a8a29e] mb-3 stroke-[1.25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="admin-empty-title">No se encontraron pedidos con este criterio</p>
          <p className="text-[13px] text-[#78716c] max-w-sm">
            {search
              ? 'Prueba con otros términos de búsqueda o elimina los filtros aplicados.'
              : 'Los pedidos que los clientes realicen desde el configurador o catálogo aparecerán en este panel.'}
          </p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">Preview</th>
                  <th>Pedido / Código</th>
                  <th>Cliente & Contacto</th>
                  <th>Desglose del Ensamble</th>
                  <th>Importe Total</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e4e2]">
                {orders.map((order) => {
                  const code = order.shareCode || order.shareToken.slice(0, 8).toUpperCase()
                  // Find dial or case for preview
                  const previewItem = order.items.find(i => i.piece.productImage || i.piece.thumbnail)

                  return (
                    <tr key={order.id} className="hover:bg-[#fafaf9] transition-colors">
                      {/* Thumbnail */}
                      <td className="w-16">
                        <div className="w-12 h-12 bg-[#f5f4f2] border border-[#e5e4e2] rounded-[3px] flex items-center justify-center p-1 overflow-hidden shrink-0">
                          {previewItem?.piece.thumbnail || previewItem?.piece.productImage ? (
                            <img
                              src={previewItem.piece.thumbnail || previewItem.piece.productImage || ''}
                              alt="Reloj"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <svg className="w-6 h-6 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </td>

                      {/* Code & Date */}
                      <td>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-[13px] font-bold text-[#1c1917] hover:text-[#92680a] underline underline-offset-2 block"
                        >
                          {code}
                        </Link>
                        <span className="font-cabin text-[11px] text-[#78716c] block mt-0.5">
                          {formatDate(order.createdAt, 'long')}
                        </span>
                        {order.statusLogs[0] && (
                          <span className="text-[10px] text-[#a8a29e] block">
                            Último cambio: {formatDate(order.statusLogs[0].createdAt, 'relative')}
                          </span>
                        )}
                      </td>

                      {/* Client */}
                      <td>
                        <span className="font-medium text-[#1c1917] block">
                          {order.clientName || 'Cliente Particular (Vía Web)'}
                        </span>
                        {order.clientPhone ? (
                          <a
                            href={`https://wa.me/${order.clientPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] text-[#166534] hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>WA: {order.clientPhone}</span>
                            <span className="text-[9px]">↗</span>
                          </a>
                        ) : order.clientEmail ? (
                          <span className="text-[11px] text-[#78716c] block mt-0.5">
                            {order.clientEmail}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#a8a29e] italic block mt-0.5">
                            Sin contacto directo registrado
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td>
                        <p className="font-medium text-[#1c1917] text-[13px]">
                          {order.name || 'Bespoke Custom Watch'}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.5 bg-[#f5f4f2] text-[#78716c] text-[10px] rounded-[2px] font-cabin uppercase font-semibold">
                            {order.items.length} piezas
                          </span>
                          {order.engravingText && (
                            <span className="px-1.5 py-0.5 bg-amber-50 text-[#92680a] text-[10px] rounded-[2px] font-cabin font-semibold">
                              Láser: "{order.engravingText}"
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td>
                        <span className="font-mono font-bold text-[14px] text-[#1c1917] tabular-nums block">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                        <span className="font-cabin text-[10px] text-[#78716c] uppercase">
                          USD Validados
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Actions */}
                      <td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="admin-btn admin-btn-primary text-[10px] py-1.5 px-3"
                          >
                            Abrir Ficha →
                          </Link>
                          <Link
                            href={`/configurator/${order.shareCode || order.shareToken}`}
                            target="_blank"
                            className="admin-btn admin-btn-secondary text-[10px] py-1.5 px-2.5"
                            title="Ver en el configurador 1:1"
                          >
                            Configurador ↗
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#e5e4e2] flex items-center justify-between bg-[#fafaf9]">
              <span className="text-[12px] text-[#78716c]">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/admin/orders?page=${currentPage - 1}${status ? `&status=${status}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                    className="admin-btn admin-btn-secondary text-[10px] py-1 px-3"
                  >
                    ← Anterior
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={`/admin/orders?page=${currentPage + 1}${status ? `&status=${status}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                    className="admin-btn admin-btn-secondary text-[10px] py-1 px-3"
                  >
                    Siguiente →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
