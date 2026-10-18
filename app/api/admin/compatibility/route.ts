import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rules = await prisma.compatibilityRule.findMany({
    include: {
      piece: { select: { id: true, name: true, sku: true, category: { select: { name: true } } } },
      targetCategory: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { piece: { name: 'asc' } },
  })

  return NextResponse.json(
    rules.map(r => ({ ...r, targetPieceIds: r.targetPieceIds ? JSON.parse(r.targetPieceIds) : null }))
  )
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { pieceId, targetCategoryId, ruleType, targetPieceIds, attributeKey, attributeValue, description } = body

  const rule = await prisma.compatibilityRule.create({
    data: {
      pieceId, targetCategoryId, ruleType,
      targetPieceIds: targetPieceIds ? JSON.stringify(targetPieceIds) : null,
      attributeKey, attributeValue, description,
    },
    include: {
      piece: { select: { id: true, name: true, sku: true } },
      targetCategory: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json({ ...rule, targetPieceIds: rule.targetPieceIds ? JSON.parse(rule.targetPieceIds) : null })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await prisma.compatibilityRule.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
