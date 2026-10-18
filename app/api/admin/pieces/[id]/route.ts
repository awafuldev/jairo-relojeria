import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const piece = await prisma.piece.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      attributes: { include: { attributeDefinition: true } },
      compatibilityRules: { include: { targetCategory: true } },
    },
  })

  if (!piece) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    ...piece,
    compatibilityRules: piece.compatibilityRules.map(r => ({
      ...r,
      targetPieceIds: r.targetPieceIds ? JSON.parse(r.targetPieceIds) : null,
    })),
  })
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  try {
    const compImg = body.compositionImage || body.layerImage
    const prodImg = body.productImage || compImg
    const thumb = body.thumbnail || prodImg

    const piece = await prisma.piece.update({
      where: { id },
      data: {
        sku: body.sku,
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
        price: parseFloat(body.price) || 0,
        stock: parseInt(body.stock) || 0,
        isActive: body.isActive ?? true,
        sortOrder: parseInt(body.sortOrder) || 0,
        tags: JSON.stringify(body.tags || []),
        material: body.material,
        color: body.color,
        compositionImage: compImg,
        productImage: prodImg,
        thumbnail: thumb,
        layerImage: compImg,
        layerScale: body.layerScale !== undefined ? parseFloat(body.layerScale) : 1,
        layerX: body.layerX !== undefined ? parseFloat(body.layerX) : 0,
        layerY: body.layerY !== undefined ? parseFloat(body.layerY) : 0,
        layerRotation: body.layerRotation !== undefined ? parseFloat(body.layerRotation) : 0,
        layerZIndex: body.layerZIndex !== undefined ? parseInt(body.layerZIndex) : 10,
        layerOpacity: body.layerOpacity !== undefined ? parseFloat(body.layerOpacity) : 1,
        layerVisible: body.layerVisible ?? true,
      },
      include: { category: true, images: true },
    })
    return NextResponse.json(piece)
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

  const { id } = await params

  try {
    // Retrieve piece images before deletion to clean up uploaded files
    const piece = await prisma.piece.findUnique({
      where: { id },
      include: { images: true }
    })

    if (piece) {
      const urlsToClean = [
        piece.productImage,
        piece.compositionImage,
        piece.layerImage,
        piece.thumbnail,
        ...piece.images.map(img => img.url)
      ].filter((u): u is string => typeof u === 'string' && u.startsWith('/uploads/'))

      // Remove duplicates
      const uniqueUploads = [...new Set(urlsToClean)]
      const fs = await import('fs/promises')
      const path = await import('path')

      for (const uploadUrl of uniqueUploads) {
        try {
          const filePath = path.join(process.cwd(), 'public', uploadUrl)
          await fs.unlink(filePath)
        } catch {
          // File might already be gone, continue safely
        }
      }
    }

    // Cascade: delete dependent records first
    await prisma.compatibilityRule.deleteMany({ where: { pieceId: id } })
    await prisma.pieceAttribute.deleteMany({ where: { pieceId: id } })
    await prisma.pieceImage.deleteMany({ where: { pieceId: id } })
    await prisma.configurationItem.deleteMany({ where: { pieceId: id } })
    await prisma.piece.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
