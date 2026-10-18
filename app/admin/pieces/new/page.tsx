import PieceForm from '../PieceForm'

export default function NewPiecePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="caption text-[#a5a7a8] mb-1">Catálogo</p>
        <h1 className="heading-lg">Nueva Pieza</h1>
      </div>
      <PieceForm />
    </div>
  )
}
