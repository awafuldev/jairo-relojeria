export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma, ensureDbReady } from '@/lib/prisma'
import Link from 'next/link'
import { StatusBadge, formatPrice, formatDate } from '@/components/admin/AdminUtils'

export default async function AdminReportsPage() {
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  await ensureDbReady()

  // 1. Group orders by status
  const ordersByStatus = await prisma.configuration.groupBy({
    by: ['status'],
    _count: { id: true },
    _sum: { totalPrice: true },
  })

  // 2. Verified revenue vs potential estimates
  let confirmedRevenue = 0
  let pendingEstimate = 0
  let completedRevenue = 0
  let totalVolume = 0

  ordersByStatus.forEach(group => {
    const sum = group._sum.totalPrice || 0
    totalVolume += sum
    if (group.status === 'confirmed') confirmedRevenue += sum
    if (group.status === 'completed') completedRevenue += sum
    if (['pending', 'saved', 'ordered'].includes(group.status)) pendingEstimate += sum
  })

  // 3. Most popular pieces in bespoke builds
  const popularPiecesGroup = await prisma.configurationItem.groupBy({
    by: ['pieceId'],
    _count: { pieceId: true },
    orderBy: {
      _count: { pieceId: 'desc' },
    },
    take: 8,
  })

  const popularPieceIds = popularPiecesGroup.map(p => p.pieceId)
  const pieceDetails = await prisma.piece.findMany({
    where: { id: { in: popularPieceIds } },
    include: {
      category: { select: { name: true, step: true } },
    },
  })

  const popularPieces = popularPiecesGroup.map(item => {
    const detail = pieceDetails.find(p => p.id === item.pieceId)
    return {
      id: item.pieceId,
      name: detail?.name || 'Pieza desconocida',
      sku: detail?.sku || '-',
      category: detail?.category?.name || 'General',
      step: detail?.category?.step || 0,
      price: detail?.price || 0,
      count: item._count.pieceId,
    }
  })

  // 4. Boutique Watches Inventory summary
  const watches = await prisma.watchProduct.findMany({
    orderBy: { price: 'desc' },
    take: 6,
  })

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Analítica Comercial · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Informes & Rendimiento del Taller
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Métricas reales auditadas directamente sobre la base de datos de producción.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="admin-btn admin-btn-secondary"
        >
          Ver Todos los Pedidos →
        </Link>
      </div>

      {/* Financial Health Overview - Transparent Accounting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="admin-card p-5 border-l-4 border-l-[#166534]">
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#166534] font-bold block mb-1">
            Cobrado / Entregado
          </span>
          <p className="font-jost text-2xl font-bold text-[#1c1917] tabular-nums">
            {formatPrice(completedRevenue)}
          </p>
          <p className="text-[11px] text-[#78716c] mt-1">
            Total de pedidos con ensamble completado y entregados al cliente.
          </p>
        </div>

        <div className="admin-card p-5 border-l-4 border-l-[#92680a]">
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#92680a] font-bold block mb-1">
            Confirmado en Taller
          </span>
          <p className="font-jost text-2xl font-bold text-[#92680a] tabular-nums">
            {formatPrice(confirmedRevenue)}
          </p>
          <p className="text-[11px] text-[#78716c] mt-1">
            Encargos confirmados por clientes, pendientes de finalización.
          </p>
        </div>

        <div className="admin-card p-5 border-l-4 border-l-[#78716c]">
          <span className="font-cabin text-[9px] uppercase tracking-wider text-[#78716c] font-bold block mb-1">
            Presupuesto Potencial en Espera
          </span>
          <p className="font-jost text-2xl font-bold text-[#78716c] tabular-nums">
            {formatPrice(pendingEstimate)}
          </p>
          <p className="text-[11px] text-[#78716c] mt-1">
            Valor de configuraciones guardadas pendientes de cierre comercial.
          </p>
        </div>
      </div>

      {/* Distribution by Status Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-6 admin-card overflow-hidden">
          <div className="p-4 bg-[#fafaf9] border-b border-[#e5e4e2]">
            <h3 className="font-jost font-bold text-sm text-[#1c1917] uppercase tracking-wide">
              Distribución de Pedidos por Estado
            </h3>
            <p className="text-[11px] text-[#78716c]">
              Segmentación operativa de los pedidos en curso y cerrados.
            </p>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th className="text-right">Cantidad</th>
                <th className="text-right">Volumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e4e2]">
              {ordersByStatus.map(row => (
                <tr key={row.status}>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="text-right font-mono font-medium text-[#1c1917]">
                    {row._count.id}
                  </td>
                  <td className="text-right font-mono font-bold text-[#1c1917] tabular-nums">
                    ${(row._sum.totalPrice || 0).toFixed(0)} <span className="font-cabin text-[10px] text-[#78716c]">USD</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Most Selected Pieces */}
        <div className="lg:col-span-6 admin-card overflow-hidden">
          <div className="p-4 bg-[#fafaf9] border-b border-[#e5e4e2]">
            <h3 className="font-jost font-bold text-sm text-[#1c1917] uppercase tracking-wide">
              Componentes más Seleccionados en Configurador
            </h3>
            <p className="text-[11px] text-[#78716c]">
              Piezas preferidas por los clientes para sus ensambles.
            </p>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Componente</th>
                <th>Categoría</th>
                <th className="text-right">Elecciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e4e2]">
              {popularPieces.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-[#78716c] italic text-[12px]">
                    No hay suficientes datos de componentes montados aún.
                  </td>
                </tr>
              ) : (
                popularPieces.map(piece => (
                  <tr key={piece.id}>
                    <td>
                      <span className="font-medium text-[#1c1917] block truncate max-w-[200px]">
                        {piece.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#78716c]">
                        {piece.sku}
                      </span>
                    </td>
                    <td className="text-[#78716c] font-cabin text-[11px]">
                      {piece.category}
                    </td>
                    <td className="text-right font-mono font-bold text-[#1c1917]">
                      {piece.count} veces
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Boutique Seiko Watches In Stock */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 bg-[#fafaf9] border-b border-[#e5e4e2] flex items-center justify-between">
          <div>
            <h3 className="font-jost font-bold text-sm text-[#1c1917] uppercase tracking-wide">
              Catálogo de Relojes Seiko Boutique
            </h3>
            <p className="text-[11px] text-[#78716c]">
              Modelos completos listados para venta inmediata.
            </p>
          </div>
          <Link href="/admin/watches" className="text-[11px] font-cabin uppercase font-bold text-[#1c1917] hover:underline">
            Gestionar Relojes →
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Reloj</th>
              <th>Referencia / Calibre</th>
              <th>Stock</th>
              <th>Disponibilidad</th>
              <th className="text-right">Precio de Venta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e4e2]">
            {watches.map(w => (
              <tr key={w.id}>
                <td>
                  <span className="font-medium text-[#1c1917] block">
                    {w.name}
                  </span>
                  <span className="text-[11px] text-[#78716c]">
                    {w.caseSize || '40mm'} · {w.glass || 'Zafiro'}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-[11px] text-[#1c1917] block">
                    {w.reference || '-'}
                  </span>
                  <span className="text-[10px] text-[#78716c]">
                    {w.caliber || 'Seiko Automático'}
                  </span>
                </td>
                <td className="font-mono text-[#1c1917]">
                  {w.stock} uds.
                </td>
                <td>
                  <span className={`inline-flex px-2 py-0.5 rounded-[2px] text-[10px] font-cabin uppercase font-bold ${
                    w.isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {w.isAvailable ? 'Disponible' : 'Agotado'}
                  </span>
                </td>
                <td className="text-right font-mono font-bold text-[#1c1917]">
                  ${w.price.toFixed(2)} USD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
