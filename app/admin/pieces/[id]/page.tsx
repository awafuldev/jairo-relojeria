export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import PieceForm from '../PieceForm'

export default async function EditPiecePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const piece = await prisma.piece.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
      attributes: { include: { attributeDefinition: true } },
      compatibilityRules: true,
    }
  })

  if (!piece) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="caption text-[#a5a7a8] mb-1">Catálogo</p>
        <h1 className="heading-lg">Editar: {piece.name}</h1>
      </div>
      <PieceForm initialData={piece} isEditing={true} />
    </div>
  )
}
