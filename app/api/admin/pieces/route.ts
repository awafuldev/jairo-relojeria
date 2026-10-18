import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pieces = await prisma.piece.findMany({
    orderBy: [{ category: { step: 'asc' } }, { sortOrder: 'asc' }],
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      attributes: { include: { attributeDefinition: true } },
      _count: { select: { compatibilityRules: true } },
    },
  })

  return NextResponse.json(pieces)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      sku, name, description, categoryId, price, stock,
      isActive, sortOrder, tags, material, color,
      compositionImage, productImage, thumbnail, layerImage,
      layerScale, layerX, layerY, layerRotation, layerZIndex, layerOpacity, layerVisible,
    } = body

    const compImg = compositionImage || layerImage
    const prodImg = productImage || compImg
    const thumb = thumbnail || prodImg

    const piece = await prisma.piece.create({
      data: {
        sku, name, description, categoryId,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        isActive: isActive ?? true,
        sortOrder: parseInt(sortOrder) || 0,
        tags: JSON.stringify(tags || []),
        material, color,
        compositionImage: compImg,
        productImage: prodImg,
        thumbnail: thumb,
        layerImage: compImg,
        layerScale: layerScale !== undefined ? parseFloat(layerScale) : 1,
        layerX: layerX !== undefined ? parseFloat(layerX) : 0,
        layerY: layerY !== undefined ? parseFloat(layerY) : 0,
        layerRotation: layerRotation !== undefined ? parseFloat(layerRotation) : 0,
        layerZIndex: layerZIndex !== undefined ? parseInt(layerZIndex) : 10,
        layerOpacity: layerOpacity !== undefined ? parseFloat(layerOpacity) : 1,
        layerVisible: layerVisible ?? true,
      },
      include: { category: true, images: true },
    })

    return NextResponse.json(piece)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
