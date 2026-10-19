export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import WatchDetailPageClient from './WatchDetailPageClient'

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const watches = await prisma.$queryRawUnsafe<any[]>(
    `SELECT "name", "description" FROM "WatchProduct" WHERE "slug" = $1 LIMIT 1`,
    slug
  )
  if (!watches || watches.length === 0) return { title: 'Reloj no encontrado' }
  return {
    title: `${watches[0].name} — Jairo Relojería`,
    description: watches[0].description,
  }
}

export default async function WatchDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const watches = await prisma.$queryRawUnsafe<any[]>(
    `SELECT * FROM "WatchProduct" WHERE "slug" = $1 LIMIT 1`,
    slug
  )

  if (!watches || watches.length === 0) {
    notFound()
  }

  const rawWatch = watches[0]
  const gallery = typeof rawWatch.gallery === 'string'
    ? JSON.parse(rawWatch.gallery || '[]')
    : (rawWatch.gallery || [])

  const watch = {
    ...rawWatch,
    isAvailable: Boolean(rawWatch.isAvailable),
    isFeatured: Boolean(rawWatch.isFeatured),
    gallery: gallery.length > 0 ? gallery : [rawWatch.mainImage],
  }

  return <WatchDetailPageClient watch={watch} />
}
