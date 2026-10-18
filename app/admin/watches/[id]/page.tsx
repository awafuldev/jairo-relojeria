import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import WatchForm from '../WatchForm'

export default async function EditWatchPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const watches = await prisma.$queryRawUnsafe<any[]>(
    `SELECT * FROM "WatchProduct" WHERE "id" = $1 LIMIT 1`,
    id
  )

  if (!watches || watches.length === 0) {
    notFound()
  }

  const watch = watches[0]
  const parsed = {
    ...watch,
    isAvailable: Boolean(watch.isAvailable),
    isFeatured: Boolean(watch.isFeatured),
    gallery: typeof watch.gallery === 'string' ? JSON.parse(watch.gallery || '[]') : (watch.gallery || [])
  }

  return (
    <div className="p-8 max-w-6xl font-poppins">
      <div className="mb-8">
        <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-[#1dd8e1] font-semibold block mb-1">
          Inventario de Tienda
        </span>
        <h1 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em]">
          Editar Reloj: {parsed.name}
        </h1>
        <p className="text-[13px] text-[#2e3438] mt-1">
          Modifica precios, disponibilidad, imágenes o especificaciones mecánicas del reloj.
        </p>
      </div>

      <WatchForm initialData={parsed} isEditing />
    </div>
  )
}
