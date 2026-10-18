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
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { pieces: true } } },
  })

  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(category)
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
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        step: body.step !== undefined ? parseInt(body.step) : undefined,
        description: body.description,
        layerZIndex: body.layerZIndex !== undefined ? parseInt(body.layerZIndex) : undefined,
        isRequired: body.isRequired,
        isActive: body.isActive,
      },
    })
    return NextResponse.json(category)
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
    // delete category only if it has 0 pieces
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { pieces: true } } },
    })

    if (!category) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (category._count.pieces > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing pieces. Remove all pieces first.' },
        { status: 400 }
      )
    }

    // Since piece count is 0, we can safely delete
    await prisma.compatibilityRule.deleteMany({ where: { targetCategoryId: id } })
    await prisma.category.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
