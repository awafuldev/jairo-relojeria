export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma, ensureDbReady } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge, formatPrice, formatDate } from '@/components/admin/AdminUtils'

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  await ensureDbReady()

  // 1. Core metrics from real database tables with resilient fallbacks
  let totalConfigs = 0
  let pendingOrdersCount = 0
  let inProgressCount = 0
  let completedCount = 0
  let totalPieces = 0
  let inactivePiecesCount = 0
  let lowStockPiecesCount = 0
  let totalCategories = 0
  let totalRules = 0
  let totalRevenue = 0
  let watchCount = 0
  let recentOrders: any[] = []

  try {
    const [
      cTotal,
      cPending,
      cProgress,
      cCompleted,
      pTotal,
      pInactive,
      pLowStock,
      catTotal,
      rulesTotal,
      valAgg,
    ] = await Promise.all([
      prisma.configuration.count().catch(() => 0),
      prisma.configuration.count({
        where: { status: { in: ['pending', 'ordered', 'saved'] } },
      }).catch(() => 0),
      prisma.configuration.count({
        where: { status: 'in_progress' },
      }).catch(() => 0),
      prisma.configuration.count({
        where: { status: { in: ['confirmed', 'completed'] } },
      }).catch(() => 0),
      prisma.piece.count().catch(() => 0),
      prisma.piece.count({ where: { isActive: false } }).catch(() => 0),
      prisma.piece.count({ where: { stock: { lte: 2 } } }).catch(() => 0),
      prisma.category.count().catch(() => 0),
      prisma.compatibilityRule.count().catch(() => 0),
      prisma.configuration.aggregate({
        _sum: { totalPrice: true },
        where: { status: { notIn: ['cancelled', 'draft'] } },
      }).catch(() => ({ _sum: { totalPrice: 0 } })),
    ])

    totalConfigs = cTotal
    pendingOrdersCount = cPending
    inProgressCount = cProgress
    completedCount = cCompleted
    totalPieces = pTotal
    inactivePiecesCount = pInactive
    lowStockPiecesCount = pLowStock
    totalCategories = catTotal
    totalRules = rulesTotal
    totalRevenue = valAgg._sum.totalPrice || 0

    // Count Seiko watches in boutique
    const watchCountRes = await prisma.$queryRawUnsafe<any[]>(`
      SELECT count(*) as count FROM "WatchProduct"
    `).catch(() => [{ count: 0 }])
    watchCount = Number(watchCountRes[0]?.count || 0)

    // 2. Recent orders & configurations
    recentOrders = await prisma.configuration.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            piece: {
              select: { id: true, name: true, sku: true, productImage: true, thumbnail: true },
            },
            category: {
              select: { id: true, name: true, step: true },
            },
          },
        },
        statusLogs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    }).catch(async (e) => {
      console.warn('Fallback loading configurations without statusLogs:', e)
      return prisma.configuration.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              piece: {
                select: { id: true, name: true, sku: true, productImage: true, thumbnail: true },
              },
              category: {
                select: { id: true, name: true, step: true },
              },
            },
          },
        },
      }).then(list => list.map(item => ({ ...item, statusLogs: [] }))).catch(() => [])
    })
  } catch (err) {
    console.error('AdminDashboard data loading error:', err)
  }

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Centro de Operaciones · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Dashboard del Taller
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Resumen en tiempo real de pedidos personalizados, modelos Seiko y componentes en taller.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="admin-btn admin-btn-secondary"
          >
            Ver Pedidos ({pendingOrdersCount} pendientes)
          </Link>
          <Link
            href="/configurator"
            target="_blank"
            className="admin-btn admin-btn-primary"
          >
            + Nueva Configuración ↗
          </Link>
        </div>
      </div>

      {/* Useful Alerts */}
      {(pendingOrdersCount > 0 || inactivePiecesCount > 0 || lowStockPiecesCount > 0) && (
        <div className="space-y-2.5 mb-8">
          {pendingOrdersCount > 0 && (
            <div className="flex items-center justify-between p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-[4px] text-[13px] text-amber-900">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>
                  Hay <strong>{pendingOrdersCount}</strong> {pendingOrdersCount === 1 ? 'pedido pendiente' : 'pedidos pendientes'} de confirmación o atención con el cliente.
                </span>
              </div>
              <Link href="/admin/orders?status=pending" className="text-[11px] font-cabin uppercase font-bold tracking-wider underline hover:text-amber-950">
                Atender Ahora →
              </Link>
            </div>
          )}

          {lowStockPiecesCount > 0 && (
            <div className="flex items-center justify-between p-3.5 bg-red-50/70 border border-red-200/80 rounded-[4px] text-[13px] text-red-900">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>
                  <strong>{lowStockPiecesCount}</strong> {lowStockPiecesCount === 1 ? 'componente tiene' : 'componentes tienen'} stock crítico (≤ 2 unidades disponibles en taller).
                </span>
              </div>
              <Link href="/admin/pieces" className="text-[11px] font-cabin uppercase font-bold tracking-wider underline hover:text-red-950">
                Revisar Inventario →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Primary KPI Grid (All backed by verified database figures) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/admin/orders"
          className="admin-stat-card group"
        >
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#92680a] font-bold block mb-1">
            Pedidos Activos
          </span>
          <div className="flex items-baseline justify-between">
            <p className="admin-stat-value group-hover:text-[#92680a] transition-colors">
              {pendingOrdersCount}
            </p>
            <span className="font-cabin text-[10px] text-[#78716c]">
              de {totalConfigs} totales
            </span>
          </div>
          <p className="admin-stat-label">
            Pendientes de Confirmar
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="admin-stat-card group"
        >
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#166534] font-bold block mb-1">
            En Producción
          </span>
          <div className="flex items-baseline justify-between">
            <p className="admin-stat-value group-hover:text-[#166534] transition-colors">
              {inProgressCount + completedCount}
            </p>
            <span className="font-cabin text-[10px] text-[#78716c]">
              {completedCount} completados
            </span>
          </div>
          <p className="admin-stat-label">
            En Taller / Finalizados
          </p>
        </Link>

        <div className="admin-stat-card">
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#1c1917] font-bold block mb-1">
            Valoración de Encargos
          </span>
          <p className="admin-stat-value text-[#92680a] tabular-nums">
            {formatPrice(totalRevenue)}
          </p>
          <p className="admin-stat-label">
            Volumen Total Estimado
          </p>
        </div>

        <Link
          href="/admin/watches"
          className="admin-stat-card group"
        >
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] font-bold block mb-1">
            Tienda Boutique
          </span>
          <div className="flex items-baseline justify-between">
            <p className="admin-stat-value group-hover:text-[#1c1917] transition-colors">
              {watchCount}
            </p>
            <span className="font-cabin text-[10px] text-[#78716c]">
              modelos Seiko
            </span>
          </div>
          <p className="admin-stat-label">
            Relojes Terminados
          </p>
        </Link>
      </div>

      {/* Workshop Infrastructure Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 p-4 bg-white border border-[#e5e4e2] rounded-[4px]">
        <Link href="/admin/pieces" className="hover:opacity-80 transition-opacity">
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] font-semibold block">
            Piezas en Taller
          </span>
          <p className="font-jost text-xl font-bold text-[#1c1917] tabular-nums mt-0.5">
            {totalPieces} <span className="text-xs font-normal text-[#78716c]">({inactivePiecesCount} inactivas)</span>
          </p>
        </Link>

        <Link href="/admin/categories" className="hover:opacity-80 transition-opacity">
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] font-semibold block">
            Etapas del Ensamble
          </span>
          <p className="font-jost text-xl font-bold text-[#1c1917] tabular-nums mt-0.5">
            {totalCategories} <span className="text-xs font-normal text-[#78716c]">categorías</span>
          </p>
        </Link>

        <Link href="/admin/compatibility" className="hover:opacity-80 transition-opacity">
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] font-semibold block">
            Reglas Físicas Activas
          </span>
          <p className="font-jost text-xl font-bold text-[#1c1917] tabular-nums mt-0.5">
            {totalRules} <span className="text-xs font-normal text-[#78716c]">matrices validadas</span>
          </p>
        </Link>

        <Link href="/admin/configurations" className="hover:opacity-80 transition-opacity">
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] font-semibold block">
            Diseños de Clientes
          </span>
          <p className="font-jost text-xl font-bold text-[#1c1917] tabular-nums mt-0.5">
            {totalConfigs} <span className="text-xs font-normal text-[#78716c]">guardados</span>
          </p>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="admin-card overflow-hidden mb-10">
        <div className="p-4 sm:p-5 border-b border-[#e5e4e2] flex items-center justify-between bg-[#fafaf9]">
          <div>
            <h2 className="font-jost font-bold text-[15px] text-[#1c1917]">
              Últimos Pedidos & Encargos de Clientes
            </h2>
            <p className="text-[12px] text-[#78716c]">
              Configuraciones guardadas o solicitadas directamente desde la plataforma.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-[11px] font-cabin uppercase font-bold tracking-wider text-[#1c1917] hover:underline"
          >
            Ver todos los pedidos →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="admin-empty">
            <p className="admin-empty-title">Sin pedidos registrados todavía</p>
            <p className="text-[12px] max-w-sm">
              Cuando los clientes configuren un reloj o guarden su diseño en el configurador, aparecerán registrados aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código / Fecha</th>
                  <th>Cliente</th>
                  <th>Reloj / Componentes</th>
                  <th>Importe</th>
                  <th>Estado</th>
                  <th className="text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e4e2]">
                {recentOrders.map((order) => {
                  const code = order.shareCode || order.shareToken.slice(0, 8).toUpperCase()
                  return (
                    <tr key={order.id}>
                      <td>
                        <span className="font-mono text-[12px] font-semibold text-[#1c1917] block">
                          {code}
                        </span>
                        <span className="font-cabin text-[10px] text-[#78716c]">
                          {formatDate(order.createdAt, 'relative')}
                        </span>
                      </td>
                      <td>
                        <span className="font-medium text-[#1c1917] block">
                          {order.clientName || 'Cliente Particular'}
                        </span>
                        {order.clientPhone && (
                          <span className="font-mono text-[11px] text-[#78716c]">
                            {order.clientPhone}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="font-medium text-[#1c1917] block">
                          {order.name || 'Bespoke Custom Build'}
                        </span>
                        <span className="font-cabin text-[10px] text-[#78716c]">
                          {order.items.length} componentes ensamblados
                          {order.engravingText && ' · Con grabado láser'}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono font-semibold text-[#1c1917] tabular-nums">
                          ${order.totalPrice.toFixed(0)} <span className="font-cabin text-[10px] text-[#78716c]">USD</span>
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="admin-btn admin-btn-secondary text-[10px] py-1 px-2.5"
                          >
                            Detalle
                          </Link>
                          <Link
                            href={`/configurator/${order.shareCode || order.shareToken}`}
                            target="_blank"
                            className="admin-btn admin-btn-secondary text-[10px] py-1 px-2"
                            title="Ver en visualizador 1:1"
                          >
                            ↗
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Operations Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-jost font-bold text-sm text-[#1c1917] uppercase tracking-wide">
              Piezas & Taller
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#1dd8e1]" />
          </div>
          <p className="text-[12px] text-[#78716c] leading-relaxed mb-4">
            Añade nuevos diales, cajas o agujas con calibración milimétrica de escala y posición visual.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/admin/pieces/new" className="admin-btn admin-btn-primary justify-start">
              + Añadir Componente
            </Link>
            <Link href="/admin/pieces" className="admin-btn admin-btn-secondary justify-start">
              Gestionar Inventario
            </Link>
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-jost font-bold text-sm text-[#1c1917] uppercase tracking-wide">
              Compatibilidad Física
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#92680a]" />
          </div>
          <p className="text-[12px] text-[#78716c] leading-relaxed mb-4">
            Garantiza que coronas, biseles y esferas solo puedan combinarse con cajas mecánicamente compatibles.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/admin/compatibility" className="admin-btn admin-btn-secondary justify-start">
              Revisar Reglas Físicas
            </Link>
            <Link href="/admin/categories" className="admin-btn admin-btn-secondary justify-start">
              Ordenar Pasos del Configurador
            </Link>
          </div>
        </div>

        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-jost font-bold text-sm text-[#1c1917] uppercase tracking-wide">
              Boutique Seiko
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#166534]" />
          </div>
          <p className="text-[12px] text-[#78716c] leading-relaxed mb-4">
            Publica relojes terminados para compra directa en la tienda online con fotos de alta resolución.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/admin/watches/new" className="admin-btn admin-btn-primary justify-start">
              + Nuevo Reloj Seiko
            </Link>
            <Link href="/admin/watches" className="admin-btn admin-btn-secondary justify-start">
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
