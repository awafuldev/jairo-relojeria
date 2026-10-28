import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  migrationDone: boolean | undefined
}

function initDatabaseUrl(): void {
  // If running in production / serverless environment (like Vercel)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDb = path.join('/tmp', 'dev.db')
    const localDb = path.join(process.cwd(), 'prisma', 'dev.db')

    try {
      if (fs.existsSync(localDb)) {
        let shouldCopy = !fs.existsSync(tmpDb)
        if (!shouldCopy) {
          try {
            const localStat = fs.statSync(localDb)
            const tmpStat = fs.statSync(tmpDb)
            if (localStat.mtimeMs > tmpStat.mtimeMs || localStat.size !== tmpStat.size) {
              shouldCopy = true
            }
          } catch {
            shouldCopy = true
          }
        }
        if (shouldCopy) {
          fs.copyFileSync(localDb, tmpDb)
        }
      }
      if (fs.existsSync(tmpDb)) {
        process.env.DATABASE_URL = `file:${tmpDb}`
        return
      }
    } catch (e) {
      console.warn('Failed to prepare SQLite in /tmp:', e)
    }

    if (fs.existsSync(localDb)) {
      process.env.DATABASE_URL = `file:${localDb}?mode=ro`
      return
    }
  }

  if (!process.env.DATABASE_URL) {
    const localDb = path.join(process.cwd(), 'prisma', 'dev.db')
    process.env.DATABASE_URL = `file:${localDb}`
  }
}

initDatabaseUrl()

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Auto-heal schema in serverless SQLite if /tmp/dev.db was retained from an older container
export async function ensureDbReady(): Promise<void> {
  if (globalForPrisma.migrationDone) return
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ConfigurationStatusLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "configurationId" TEXT NOT NULL,
        "fromStatus" TEXT,
        "toStatus" TEXT NOT NULL,
        "note" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const tableInfo = await prisma.$queryRawUnsafe<any[]>(`PRAGMA table_info('Configuration')`)
    const existingCols = (tableInfo || []).map((c: any) => c.name)
    const neededCols = ['clientName', 'clientEmail', 'clientPhone', 'clientNotes', 'adminNotes']
    for (const col of neededCols) {
      if (!existingCols.includes(col)) {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Configuration" ADD COLUMN "${col}" TEXT`)
      }
    }
    globalForPrisma.migrationDone = true
  } catch (err) {
    console.warn('Auto-healing SQLite warning:', err)
  }
}
