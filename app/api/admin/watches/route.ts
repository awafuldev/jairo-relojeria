import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const watches = await prisma.$queryRawUnsafe<any[]>(`
      SELECT * FROM "WatchProduct" ORDER BY "createdAt" DESC
    `)

    const parsed = watches.map(w => ({
      ...w,
      isAvailable: Boolean(w.isAvailable),
      isFeatured: Boolean(w.isFeatured),
      gallery: typeof w.gallery === 'string' ? JSON.parse(w.gallery || '[]') : (w.gallery || [])
    }))

    return NextResponse.json(parsed)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      name, slug: rawSlug, reference, description, price, stock,
      isAvailable, isFeatured, caliber, caseSize, waterResist,
      glass, bracelet, mainImage, gallery
    } = body

    if (!name || !price || !mainImage) {
      return NextResponse.json({ error: 'Nombre, precio e imagen principal son requeridos' }, { status: 400 })
    }

    const id = `watch-${uuidv4().slice(0, 8)}`
    const slug = rawSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const galleryJson = JSON.stringify(gallery || [])

    await prisma.$executeRawUnsafe(`
      INSERT INTO "WatchProduct" (
        "id", "slug", "name", "reference", "description", "price",
        "stock", "isAvailable", "isFeatured", "caliber", "caseSize",
        "waterResist", "glass", "bracelet", "mainImage", "gallery"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      )
    `,
      id, slug, name, reference || null, description || null, parseFloat(price),
      parseInt(stock || 1), isAvailable ? 1 : 0, isFeatured ? 1 : 0, caliber || null,
      caseSize || null, waterResist || null, glass || null, bracelet || null,
      mainImage, galleryJson
    )

    return NextResponse.json({ success: true, id, slug })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
