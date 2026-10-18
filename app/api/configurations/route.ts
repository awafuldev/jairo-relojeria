import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, shareCode, engravingText, engravingFont, items } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const BASE_WATCH_PRICE = 250
    const componentsTotal = items.reduce((sum: number, i: any) => sum + (i.priceAtTime || 0), 0)
    const engravingFee = engravingText && engravingText.trim().length > 0 ? 30 : 0
    const totalPrice = BASE_WATCH_PRICE + componentsTotal + engravingFee

    const token = uuidv4()
    const code = shareCode || `WM-${token.slice(0, 5).toUpperCase()}`

    // If shareCode already exists, delete old config first (idempotent upsert)
    if (shareCode) {
      const existing = await prisma.configuration.findUnique({ where: { shareCode } })
      if (existing) {
        await prisma.configurationItem.deleteMany({ where: { configurationId: existing.id } })
        await prisma.configuration.delete({ where: { shareCode } })
      }
    }

    const config = await prisma.configuration.create({
      data: {
        name: name || `Bespoke Watch ${code}`,
        shareToken: token,
        shareCode: code,
        engravingText: engravingText || null,
        engravingFont: engravingFont || null,
        totalPrice,
        status: 'saved',
        items: {
          create: items.map((item: any) => ({
            pieceId: item.pieceId,
            categoryId: item.categoryId,
            priceAtTime: item.priceAtTime,
          })),
        },
      },
      include: { items: { include: { piece: true, category: true } } },
    })

    return NextResponse.json(config)
  } catch (error: any) {
    console.error('Error saving configuration:', error)
    return NextResponse.json({ error: error.message || 'Failed to save configuration' }, { status: 500 })
  }
}
