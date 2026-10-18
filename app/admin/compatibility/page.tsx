'use client'

import { useEffect, useState } from 'react'

interface Piece {
  id: string
  name: string
  sku: string
  categoryId: string
  category: { id: string; name: string }
}

interface Category {
  id: string
  name: string
  slug: string
  step: number
}

interface CompatRule {
  id: string
  pieceId: string
  targetCategoryId: string
  ruleType: string
  targetPieceIds: string[] | null
  attributeKey: string | null
  attributeValue: string | null
  description: string | null
  piece?: { id: string; name: string; sku: string }
  targetCategory?: { id: string; name: string }
}

export default function AdminCompatibilityPage() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [rules, setRules] = useState<CompatRule[]>([])
  const [selectedPieceId, setSelectedPieceId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Local state of selected piece IDs per target category
  // Record<targetCategoryId, string[]> (array of compatible piece IDs)
  const [compatMap, setCompatMap] = useState<Record<string, string[]>>({})

  const loadData = async () => {
    setLoading(true)
    try {
      const [resPieces, resCats, resRules] = await Promise.all([
        fetch('/api/admin/pieces'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/compatibility')
      ])

      const piecesData = await resPieces.json()
      const catsData = await resCats.json()
      const rulesData = await resRules.json()

      setPieces(piecesData || [])
      setCategories(catsData || [])
      setRules(rulesData || [])

      if (piecesData?.length > 0 && !selectedPieceId) {
        setSelectedPieceId(piecesData[0].id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Whenever selected piece changes, parse rules for that piece into compatMap
  useEffect(() => {
    if (!selectedPieceId) return

    const pieceRules = rules.filter(r => r.pieceId === selectedPieceId)
    const map: Record<string, string[]> = {}

    for (const r of pieceRules) {
      if (r.ruleType === 'whitelist' && r.targetPieceIds) {
        map[r.targetCategoryId] = r.targetPieceIds
      }
    }

    setCompatMap(map)
  }, [selectedPieceId, rules])

  const selectedPiece = pieces.find(p => p.id === selectedPieceId)

  // Filter out the selected piece's own category from targets
  const targetCategories = categories.filter(c => c.id !== selectedPiece?.categoryId)

  const togglePieceCompat = (targetCatId: string, targetPieceId: string) => {
    const currentList = compatMap[targetCatId]

    // If undefined or null, it was universal (all compatible). Initialize with all pieces from that category
    const piecesInCat = pieces.filter(p => p.categoryId === targetCatId).map(p => p.id)
    const activeList = currentList !== undefined ? currentList : piecesInCat

    let updated: string[]
    if (activeList.includes(targetPieceId)) {
      updated = activeList.filter(id => id !== targetPieceId)
    } else {
      updated = [...activeList, targetPieceId]
    }

    setCompatMap(prev => ({
      ...prev,
      [targetCatId]: updated
    }))
  }

  const setAllInCat = (targetCatId: string, makeCompatible: boolean) => {
    const piecesInCat = pieces.filter(p => p.categoryId === targetCatId).map(p => p.id)
    setCompatMap(prev => ({
      ...prev,
      [targetCatId]: makeCompatible ? piecesInCat : []
    }))
  }

  const handleSaveCompatibility = async () => {
    if (!selectedPieceId) return
    setSaving(true)
    setSavedSuccess(false)

    try {
      // Find existing rules for this piece and remove them
      const existingPieceRules = rules.filter(r => r.pieceId === selectedPieceId)
      for (const r of existingPieceRules) {
        await fetch(`/api/admin/compatibility?id=${r.id}`, { method: 'DELETE' })
      }

      // Create new rules for each category that has a restricted whitelist
      for (const targetCat of targetCategories) {
        const selectedIds = compatMap[targetCat.id]
        const allPiecesInCat = pieces.filter(p => p.categoryId === targetCat.id)

        // Only create a rule if it's restricted (not all pieces selected)
        if (selectedIds !== undefined && selectedIds.length < allPiecesInCat.length) {
          await fetch('/api/admin/compatibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pieceId: selectedPieceId,
              targetCategoryId: targetCat.id,
              ruleType: 'whitelist',
              targetPieceIds: selectedIds,
              description: `Compatible sólo con ciertas opciones de ${targetCat.name}`
            })
          })
        }
      }

      // Refresh rules
      const resRules = await fetch('/api/admin/compatibility')
      const rulesData = await resRules.json()
      setRules(rulesData || [])
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="caption text-[#a5a7a8] mb-1">Motor de Reglas Físicas</p>
          <h1 className="heading-lg">Gestor de Compatibilidad</h1>
        </div>
        <button
          onClick={handleSaveCompatibility}
          disabled={saving}
          className="btn-primary self-start"
        >
          {saving ? 'Guardando...' : savedSuccess ? '✓ Guardado con éxito' : 'Guardar Reglas'}
        </button>
      </div>

      <div className="bg-[#ededed] p-4 rounded-[2px] mb-8 border border-[#dbdbdb] text-[13px] text-[#484a4c]">
        <p className="font-medium text-black mb-1">¿Cómo funciona?</p>
        <p>
          Selecciona una pieza principal (ejemplo: una Caja). A continuación marca con casillas de verificación cuáles piezas son físicamente compatibles con ella. Las piezas no marcadas aparecerán automáticamente deshabilitadas para el cliente con una explicación clara y sin términos técnicos.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#a5a7a8] text-[13px]">Cargando matriz de compatibilidad...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Piece Selector */}
          <div className="border border-[#dbdbdb] rounded-[2px] p-4 bg-white md:col-span-1 h-fit">
            <label className="caption text-[#686c6d] block mb-2 font-medium">1. Seleccionar Pieza:</label>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {pieces.map(piece => {
                const isSelected = piece.id === selectedPieceId
                const ruleCount = rules.filter(r => r.pieceId === piece.id).length
                return (
                  <button
                    key={piece.id}
                    onClick={() => setSelectedPieceId(piece.id)}
                    className={`w-full text-left p-2.5 rounded-[2px] transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-black text-white' : 'hover:bg-[#ededed] text-[#262626]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[13px] truncate">{piece.name}</p>
                      <p className={`caption truncate ${isSelected ? 'text-[#a5a7a8]' : 'text-[#686c6d]'}`}>
                        {piece.category?.name} · {piece.sku}
                      </p>
                    </div>
                    {ruleCount > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-[1px] shrink-0 ${
                        isSelected ? 'bg-[#262626] text-white' : 'bg-[#dbdbdb] text-[#484a4c]'
                      }`}>
                        {ruleCount} regla(s)
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Compatibility Checklist */}
          <div className="md:col-span-2 space-y-6">
            {selectedPiece ? (
              <>
                <div className="border border-[#dbdbdb] p-4 rounded-[2px] bg-white flex items-center justify-between">
                  <div>
                    <span className="caption text-[#a5a7a8]">Definiendo compatibilidad para:</span>
                    <h2 className="heading text-[16px] text-black">{selectedPiece.name}</h2>
                    <p className="caption text-[#686c6d] font-mono">{selectedPiece.sku} ({selectedPiece.category?.name})</p>
                  </div>
                </div>

                {targetCategories.map(cat => {
                  const piecesInCat = pieces.filter(p => p.categoryId === cat.id)
                  if (piecesInCat.length === 0) return null

                  const allowedIds = compatMap[cat.id]
                  // If undefined, all are compatible
                  const isUniversal = allowedIds === undefined

                  return (
                    <div key={cat.id} className="border border-[#dbdbdb] rounded-[2px] p-5 bg-white space-y-4">
                      <div className="flex items-center justify-between border-b border-[#dbdbdb] pb-3">
                        <div>
                          <h3 className="text-[14px] font-medium text-black">
                            {cat.name} ({piecesInCat.length})
                          </h3>
                          <p className="caption text-[#a5a7a8]">
                            {isUniversal
                              ? 'Universal (todas son compatibles actualmente)'
                              : `${allowedIds.length} de ${piecesInCat.length} compatibles`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAllInCat(cat.id, true)}
                            className="caption text-[#484a4c] hover:text-black underline"
                          >
                            Marcar Todas
                          </button>
                          <span className="text-[#dbdbdb]">|</span>
                          <button
                            type="button"
                            onClick={() => setAllInCat(cat.id, false)}
                            className="caption text-[#484a4c] hover:text-black underline"
                          >
                            Desmarcar Todas
                          </button>
                        </div>
                      </div>

                      {/* Checkbox grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
                        {piecesInCat.map(p => {
                          const isChecked = isUniversal || (allowedIds && allowedIds.includes(p.id))
                          return (
                            <label
                              key={p.id}
                              className={`flex items-start gap-3 p-2.5 rounded-[2px] border transition-colors cursor-pointer ${
                                isChecked
                                  ? 'border-black bg-[#fafafa]'
                                  : 'border-[#dbdbdb] bg-white opacity-60'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={!!isChecked}
                                onChange={() => togglePieceCompat(cat.id, p.id)}
                                className="w-4 h-4 mt-0.5 rounded-[2px] accent-black shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-normal text-black leading-snug">{p.name}</p>
                                <p className="caption text-[#686c6d] font-mono text-[11px]">{p.sku}</p>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              <div className="py-20 text-center text-[#a5a7a8] text-[13px] border border-[#dbdbdb] rounded-[2px]">
                Selecciona una pieza a la izquierda para configurar sus compatibilidades.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
