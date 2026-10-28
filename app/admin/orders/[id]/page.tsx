export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import OrderDetailClient from './OrderDetailClient'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  const { id } = await params

  const order = await prisma.configuration.findUnique({
    where: { id },
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
              price: true,
              material: true,
              color: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              step: true,
              slug: true,
            },
          },
        },
      },
      statusLogs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-[12px] font-cabin uppercase tracking-wider text-[#78716c]">
        <Link href="/admin" className="hover:text-black">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/admin/orders" className="hover:text-black">
          Pedidos
        </Link>
        <span>/</span>
        <span className="text-black font-bold">
          {order.shareCode || order.shareToken.slice(0, 8).toUpperCase()}
        </span>
      </div>

      <OrderDetailClient order={order} />
    </div>
  )
}
