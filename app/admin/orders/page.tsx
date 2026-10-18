import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminOrdersPage() {
  const configs = await prisma.configuration.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          piece: true,
          category: true,
        },
      },
    },
  })

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="caption text-[#a5a7a8] mb-1">Pedidos & Diseños Guardados</p>
        <h1 className="heading-lg">Configuraciones ({configs.length})</h1>
      </div>

      {configs.length === 0 ? (
        <div className="py-20 text-center text-[#a5a7a8] text-[13px] border border-[#dbdbdb] rounded-[2px]">
          No hay configuraciones guardadas por clientes aún.
        </div>
      ) : (
        <div className="space-y-6">
          {configs.map(config => (
            <div key={config.id} className="border border-[#dbdbdb] rounded-[2px] bg-white p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#dbdbdb] gap-2">
                <div>
                  <h2 className="heading text-[16px] text-black">
                    {config.name || 'Reloj Personalizado'}
                  </h2>
                  <p className="caption text-[#686c6d]">
                    Fecha: {new Date(config.createdAt).toLocaleString()} · ID: {config.id.slice(0, 8)}...
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="caption text-[#a5a7a8]">Total</p>
                    <p className="text-[16px] tabular-nums font-medium">${config.totalPrice.toFixed(2)}</p>
                  </div>
                  <Link
                    href={`/configurator/${config.shareToken}`}
                    target="_blank"
                    className="btn-ghost text-[11px] py-2"
                  >
                    Ver en Configurador ↗
                  </Link>
                </div>
              </div>

              {/* Pieces Breakdown */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {config.items.map(item => (
                  <div key={item.id} className="p-3 bg-[#ededed] rounded-[2px] text-[12px]">
                    <span className="caption text-[#a5a7a8] block">{item.category.name}</span>
                    <p className="font-medium text-black mt-0.5 truncate">{item.piece.name}</p>
                    <p className="caption text-[#686c6d] font-mono">{item.piece.sku}</p>
                    <p className="caption text-[#262626] mt-1 tabular-nums">${item.priceAtTime.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
