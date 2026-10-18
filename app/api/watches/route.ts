import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const watches = await prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM "WatchProduct"
      WHERE "isAvailable" = 1
      ORDER BY "isFeatured" DESC, "createdAt" DESC
    `)

    const parsed = watches.map(w => ({
      ...w,
      isAvailable: Boolean(w.isAvailable),
      isFeatured: Boolean(w.isFeatured),
      gallery: typeof w.gallery === 'string' ? JSON.parse(w.gallery || '[]') : (w.gallery || [])
    }))

    return NextResponse.json(parsed)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching watches' }, { status: 500 })
  }
}
