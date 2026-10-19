export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import CatalogPageClient from './CatalogPageClient'

export const metadata = {
  title: 'Relojes Seiko — Tienda Oficial — Jairo Relojería',
  description: 'Colección de relojes Seiko completos ensamblados en nuestro taller con calibres automáticos mecánicos, cristales de zafiro y cajas de acero 316L.',
}

export default async function CatalogPage() {
  const rawWatches = await prisma.$queryRawUnsafe<any[]>(`
    SELECT * FROM "WatchProduct"
    WHERE "isAvailable" = 1
    ORDER BY "isFeatured" DESC, "createdAt" DESC
  `)

  const watches = rawWatches.map(w => ({
    ...w,
    isAvailable: Boolean(w.isAvailable),
    isFeatured: Boolean(w.isFeatured),
  }))

  return <CatalogPageClient watches={watches} />
}
