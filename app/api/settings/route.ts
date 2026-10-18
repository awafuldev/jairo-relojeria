import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.$queryRawUnsafe<{ key: string; value: string }[]>(
      `SELECT "key", "value" FROM "StoreSetting"`
    )
    const result: Record<string, string> = {
      brandName: 'Jairo Relojería',
      currency: 'USD',
      contactEmail: 'taller@jairorelojeria.com',
      baseWatchPrice: '250',
    }
    for (const s of settings) {
      result[s.key] = s.value
    }
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({
      brandName: 'Jairo Relojería',
      currency: 'USD',
      contactEmail: 'taller@jairorelojeria.com',
      baseWatchPrice: '250',
    })
  }
}
