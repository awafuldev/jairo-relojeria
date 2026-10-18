import { prisma } from '@/lib/prisma'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const rawWatches = await prisma.$queryRawUnsafe<any[]>(`
    SELECT * FROM "WatchProduct"
    WHERE "isAvailable" = 1
    ORDER BY "isFeatured" DESC, "createdAt" DESC
  `)

  const seikoWatches = rawWatches.map(w => ({
    ...w,
    isAvailable: Boolean(w.isAvailable),
    isFeatured: Boolean(w.isFeatured),
  }))

  return <HomeClient watches={seikoWatches} />
}
