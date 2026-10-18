import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Add/update attributes for a piece
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  // body.attributes = [{attributeDefinitionId, value}]

  try {
    // Upsert each attribute
    for (const attr of body.attributes || []) {
      await prisma.pieceAttribute.upsert({
        where: {
          pieceId_attributeDefinitionId: {
            pieceId: id,
            attributeDefinitionId: attr.attributeDefinitionId,
          },
        },
        create: {
          pieceId: id,
          attributeDefinitionId: attr.attributeDefinitionId,
          value: attr.value,
        },
        update: { value: attr.value },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
