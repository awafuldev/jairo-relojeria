import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const watches = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "WatchProduct" WHERE "slug" = $1 LIMIT 1`,
      slug
    )

    if (!watches || watches.length === 0) {
      return NextResponse.json({ error: 'Watch not found' }, { status: 404 })
    }

    const w = watches[0]
    const parsed = {
      ...w,
      isAvailable: Boolean(w.isAvailable),
      isFeatured: Boolean(w.isFeatured),
      gallery: typeof w.gallery === 'string' ? JSON.parse(w.gallery || '[]') : (w.gallery || [])
    }

    return NextResponse.json(parsed)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching watch' }, { status: 500 })
  }
}
