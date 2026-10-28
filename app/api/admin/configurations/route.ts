import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const where: Record<string, unknown> = {}

  if (status) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { clientName: { contains: search } },
      { clientEmail: { contains: search } },
      { clientPhone: { contains: search } },
      { shareCode: { contains: search } },
    ]
  }

  const configurations = await prisma.configuration.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          piece: { select: { id: true, name: true, sku: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      },
      statusLogs: {
        orderBy: { createdAt: 'desc' },
        take: 1, // last status log
      },
      _count: {
        select: { statusLogs: true },
      },
    },
  })

  return NextResponse.json({ configurations })
}
