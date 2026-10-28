import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const VALID_STATUSES = [
  'draft',
  'saved',
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'ordered',
] as const

type ValidStatus = typeof VALID_STATUSES[number]

function isValidStatus(value: string): value is ValidStatus {
  return VALID_STATUSES.includes(value as ValidStatus)
}

// GET /api/admin/configurations/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const configuration = await prisma.configuration.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          piece: {
            select: {
              id: true,
              name: true,
              sku: true,
              productImage: true,
              thumbnail: true,
            },
          },
          category: { select: { id: true, name: true, slug: true } },
        },
      },
      statusLogs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!configuration) {
    return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
  }

  return NextResponse.json({ configuration })
}

// PATCH /api/admin/configurations/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.configuration.findUnique({
    where: { id },
    select: { id: true, status: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
  }

  const body = await request.json() as {
    status?: string
    adminNotes?: string
    clientName?: string
    clientEmail?: string
    clientPhone?: string
    clientNotes?: string
  }

  const { status, adminNotes, clientName, clientEmail, clientPhone, clientNotes } = body

  // Validate status if provided
  if (status !== undefined && !isValidStatus(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const updateData: Record<string, unknown> = {}

  if (status !== undefined) updateData.status = status
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes
  if (clientName !== undefined) updateData.clientName = clientName
  if (clientEmail !== undefined) updateData.clientEmail = clientEmail
  if (clientPhone !== undefined) updateData.clientPhone = clientPhone
  if (clientNotes !== undefined) updateData.clientNotes = clientNotes

  // Use a transaction to update configuration and optionally log status change
  const configuration = await prisma.$transaction(async (tx) => {
    const updated = await tx.configuration.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            piece: { select: { id: true, name: true, sku: true } },
            category: { select: { id: true, name: true, slug: true } },
          },
        },
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    // If status changed, log it
    if (status !== undefined && status !== existing.status) {
      await tx.configurationStatusLog.create({
        data: {
          configurationId: id,
          fromStatus: existing.status,
          toStatus: status,
        },
      })

      // Re-fetch statusLogs to include new entry
      const logs = await tx.configurationStatusLog.findMany({
        where: { configurationId: id },
        orderBy: { createdAt: 'desc' },
      })
      return { ...updated, statusLogs: logs }
    }

    return updated
  })

  return NextResponse.json({ configuration })
}

// DELETE /api/admin/configurations/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.configuration.findUnique({
    where: { id },
    select: { id: true, status: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
  }

  if (existing.status !== 'draft' && existing.status !== 'cancelled') {
    return NextResponse.json(
      { error: 'Only draft or cancelled configurations can be deleted' },
      { status: 400 }
    )
  }

  await prisma.configuration.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
