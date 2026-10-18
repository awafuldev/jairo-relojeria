import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rules = await prisma.compatibilityRule.findMany({
      include: { piece: { select: { id: true, name: true, categoryId: true } } },
    })

    // Parse JSON fields
    const parsed = rules.map(r => ({
      ...r,
      targetPieceIds: r.targetPieceIds ? JSON.parse(r.targetPieceIds) : null,
    }))

    return NextResponse.json(parsed)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 })
  }
}
