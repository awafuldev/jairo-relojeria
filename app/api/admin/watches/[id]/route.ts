import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const watches = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "WatchProduct" WHERE "id" = $1 LIMIT 1`,
      id
    )

    if (!watches || watches.length === 0) {
      return NextResponse.json({ error: 'Watch not found' }, { status: 404 })
    }

    const w = watches[0]
    return NextResponse.json({
      ...w,
      isAvailable: Boolean(w.isAvailable),
      isFeatured: Boolean(w.isFeatured),
      gallery: typeof w.gallery === 'string' ? JSON.parse(w.gallery || '[]') : (w.gallery || [])
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const {
      name, slug, reference, description, price, stock,
      isAvailable, isFeatured, caliber, caseSize, waterResist,
      glass, bracelet, mainImage, gallery
    } = body

    const galleryJson = typeof gallery === 'string' ? gallery : JSON.stringify(gallery || [])

    await prisma.$executeRawUnsafe(`
      UPDATE "WatchProduct" SET
        "name" = $1,
        "slug" = $2,
        "reference" = $3,
        "description" = $4,
        "price" = $5,
        "stock" = $6,
        "isAvailable" = $7,
        "isFeatured" = $8,
        "caliber" = $9,
        "caseSize" = $10,
        "waterResist" = $11,
        "glass" = $12,
        "bracelet" = $13,
        "mainImage" = $14,
        "gallery" = $15,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = $16
    `,
      name, slug, reference || null, description || null, parseFloat(price),
      parseInt(stock || 1), isAvailable ? 1 : 0, isFeatured ? 1 : 0, caliber || null,
      caseSize || null, waterResist || null, glass || null, bracelet || null,
      mainImage, galleryJson, id
    )

    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await prisma.$executeRawUnsafe(
      `DELETE FROM "WatchProduct" WHERE "id" = $1`,
      id
    )
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
