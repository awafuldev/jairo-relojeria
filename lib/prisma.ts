import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function initDatabaseUrl(): void {
  // If running in production / serverless environment (like Vercel)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDb = path.join('/tmp', 'dev.db')
    const localDb = path.join(process.cwd(), 'prisma', 'dev.db')

    try {
      if (!fs.existsSync(tmpDb) && fs.existsSync(localDb)) {
        fs.copyFileSync(localDb, tmpDb)
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
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
