import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const category = await prisma.category.findUnique({
      where: { slug, isActive: true },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const pieces = await prisma.piece.findMany({
      where: { categoryId: category.id, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        attributes: {
          include: { attributeDefinition: true },
        },
        category: true,
      },
    })

    return NextResponse.json({ category, pieces })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pieces' }, { status: 500 })
  }
}
