import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const settings = await prisma.$queryRawUnsafe<{ key: string; value: string }[]>(
      `SELECT "key", "value" FROM "StoreSetting"`
    )
    const result: Record<string, string> = {}
    for (const s of settings) {
      result[s.key] = s.value
    }
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const body = await req.json()
    const updates = Object.entries(body as Record<string, string>)
    
    for (const [key, value] of updates) {
      const now = new Date().toISOString()
      const existing = await prisma.$queryRawUnsafe<any[]>(
        `SELECT "id" FROM "StoreSetting" WHERE "key" = ?`,
        key
      )
      if (existing && existing.length > 0) {
        await prisma.$executeRawUnsafe(
          `UPDATE "StoreSetting" SET "value" = ?, "updatedAt" = ? WHERE "key" = ?`,
          String(value),
          now,
          key
        )
      } else {
        const id = 'set_' + Math.random().toString(36).substring(2, 9)
        await prisma.$executeRawUnsafe(
          `INSERT INTO "StoreSetting" ("id", "key", "value", "updatedAt") VALUES (?, ?, ?, ?)`,
          id,
          key,
          String(value),
          now
        )
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
