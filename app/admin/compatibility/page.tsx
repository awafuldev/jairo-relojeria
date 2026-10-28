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
  const [searchPiece, setSearchPiece] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Local state of selected piece IDs per target category
  const [compatMap, setCompatMap] = useState<Record<string, string[]>>({})

  const loadData = async () => {
    setLoading(true)
    try {
      const [resPieces, resCats, resRules] = await Promise.all([
        fetch('/api/admin/pieces'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/compatibility'),
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
  const targetCategories = categories.filter(c => c.id !== selectedPiece?.categoryId)

  const togglePieceCompat = (targetCatId: string, targetPieceId: string) => {
    const currentList = compatMap[targetCatId]
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
      [targetCatId]: updated,
    }))
  }

  const setAllInCat = (targetCatId: string, makeCompatible: boolean) => {
    const piecesInCat = pieces.filter(p => p.categoryId === targetCatId).map(p => p.id)
    setCompatMap(prev => ({
      ...prev,
      [targetCatId]: makeCompatible ? piecesInCat : [],
    }))
  }

  const handleSaveCompatibility = async () => {
    if (!selectedPieceId) return
    setSaving(true)
    setSavedSuccess(false)

    try {
      const existingPieceRules = rules.filter(r => r.pieceId === selectedPieceId)
      for (const r of existingPieceRules) {
        await fetch(`/api/admin/compatibility?id=${r.id}`, { method: 'DELETE' })
      }

      for (const targetCat of targetCategories) {
        const selectedIds = compatMap[targetCat.id]
        const allPiecesInCat = pieces.filter(p => p.categoryId === targetCat.id)

        if (selectedIds !== undefined && selectedIds.length < allPiecesInCat.length) {
          await fetch('/api/admin/compatibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pieceId: selectedPieceId,
              targetCategoryId: targetCat.id,
              ruleType: 'whitelist',
              targetPieceIds: selectedIds,
              description: `Compatible exclusivamente con las opciones validadas de ${targetCat.name}`,
            }),
          })
        }
      }

      const resRules = await fetch('/api/admin/compatibility')
      const rulesData = await resRules.json()
      setRules(rulesData || [])
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3500)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const filteredPieces = pieces.filter(p =>
    p.name.toLowerCase().includes(searchPiece.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchPiece.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(searchPiece.toLowerCase())
  )

  return (
    <div className="admin-page font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f] pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e4e2]">
        <div>
          <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#78716c] font-semibold block mb-1">
            Mecánica de Precisión · Jairo Relojería
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl font-bold text-[#1c1917] tracking-tight">
            Motor de Compatibilidad Física
          </h1>
          <p className="text-[13px] text-[#78716c] mt-1">
            Garantiza que coronas, biseles, calibres y cajas encajen mecánicamente sin holguras ni desajustes.
          </p>
        </div>

        <button
          onClick={handleSaveCompatibility}
          disabled={saving}
          className="admin-btn admin-btn-primary self-start"
        >
          {saving ? 'Guardando en Servidor...' : savedSuccess ? '✓ Reglas Físicas Guardadas' : 'Guardar Reglas Físicas'}
        </button>
      </div>

      {/* Explanatory Banner with Clear Icons */}
      <div className="bg-white p-5 rounded-[4px] mb-8 border border-[#e5e4e2] text-[13px] text-[#1c1917] shadow-xs">
        <h3 className="font-jost font-bold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1dd8e1]" />
          ¿Cómo funciona la validación en tiempo real?
        </h3>
        <p className="text-[#78716c] leading-relaxed mb-3">
          1. Selecciona la pieza motriz a la izquierda (ejemplo: una Caja de 40mm).<br />
          2. En cada categoría de ensamble, marca las piezas con <strong className="text-green-800">«✓ Compatible»</strong>. Aquellas no seleccionadas quedarán automáticamente marcadas como <strong className="text-[#78716c]">«✕ No compatible»</strong> para el cliente.<br />
          3. Si el cliente cambia la caja en el configurador, el sistema invalida en cascada las piezas no aptas para evitar órdenes fallidas.
        </p>
        <div className="flex items-center gap-4 text-xs font-cabin uppercase font-bold pt-1 border-t border-[#e5e4e2]">
          <span className="text-[#166534] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#166534]" />
            Verde = Físicamente Compatible
          </span>
          <span className="text-[#78716c] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#78716c]" />
            Gris = No Compatible (Bloqueado)
          </span>
        </div>
      </div>

      {loading ? (
        <div className="admin-card admin-empty">
          <p className="admin-empty-title">Cargando matriz física de ensamble...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Source Piece Selector */}
          <div className="md:col-span-4 admin-card p-4 space-y-3">
            <div className="pb-2 border-b border-[#e5e4e2]">
              <label className="admin-label">1. Seleccionar Pieza Base</label>
              <input
                type="text"
                placeholder="Filtrar por nombre, SKU o categoría..."
                value={searchPiece}
                onChange={(e) => setSearchPiece(e.target.value)}
                className="admin-input text-xs"
              />
            </div>

            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredPieces.map(piece => {
                const isSelected = piece.id === selectedPieceId
                const ruleCount = rules.filter(r => r.pieceId === piece.id).length

                return (
                  <button
                    key={piece.id}
                    onClick={() => setSelectedPieceId(piece.id)}
                    className={`w-full text-left p-3 rounded-[3px] transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'border-[#1c1917] bg-[#1c1917] text-white shadow-xs'
                        : 'border-[#e5e4e2] bg-white hover:bg-[#fafaf9] text-[#1c1917]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[13px] font-medium truncate">{piece.name}</p>
                      <p className={`text-[11px] font-mono truncate ${isSelected ? 'text-[#1dd8e1]' : 'text-[#78716c]'}`}>
                        {piece.sku} · {piece.category?.name}
                      </p>
                    </div>
                    {ruleCount > 0 ? (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-[2px] font-cabin uppercase font-bold shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {ruleCount} regla(s)
                      </span>
                    ) : (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-[2px] font-cabin uppercase font-semibold shrink-0 ${
                        isSelected ? 'bg-white/10 text-white/70' : 'bg-[#e5e4e2] text-[#78716c]'
                      }`}>
                        Universal
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column (8 cols): Compatibility Matrix Checklist */}
          <div className="md:col-span-8 space-y-6">
            {selectedPiece ? (
              <>
                <div className="admin-card p-5 bg-[#fafaf9] border-l-4 border-l-[#1c1917]">
                  <span className="admin-subtitle">Configurando Reglas para:</span>
                  <h2 className="font-jost font-bold text-lg text-[#1c1917] mt-0.5">
                    {selectedPiece.name}
                  </h2>
                  <p className="font-mono text-xs text-[#78716c] mt-1">
                    SKU: {selectedPiece.sku} · Categoría: {selectedPiece.category?.name}
                  </p>
                </div>

                {targetCategories.map(cat => {
                  const piecesInCat = pieces.filter(p => p.categoryId === cat.id)
                  if (piecesInCat.length === 0) return null

                  const allowedIds = compatMap[cat.id]
                  const isUniversal = allowedIds === undefined
                  const compatibleCount = isUniversal ? piecesInCat.length : allowedIds.length

                  return (
                    <div key={cat.id} className="admin-card p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#e5e4e2] gap-2">
                        <div>
                          <h3 className="font-jost font-bold text-base text-[#1c1917]">
                            Paso {cat.step}: {cat.name} ({piecesInCat.length} opciones)
                          </h3>
                          <p className="text-[11px] text-[#78716c] font-cabin">
                            {isUniversal
                              ? '✓ Universal: todas las piezas de esta categoría son compatibles.'
                              : `${compatibleCount} de ${piecesInCat.length} piezas marcadas como compatibles.`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAllInCat(cat.id, true)}
                            className="text-[11px] font-cabin uppercase font-bold text-[#166534] hover:underline"
                          >
                            ✓ Todas Compatibles
                          </button>
                          <span className="text-[#e5e4e2]">|</span>
                          <button
                            type="button"
                            onClick={() => setAllInCat(cat.id, false)}
                            className="text-[11px] font-cabin uppercase font-bold text-[#78716c] hover:underline"
                          >
                            ✕ Desmarcar Todas
                          </button>
                        </div>
                      </div>

                      {/* Items Grid with Clear Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {piecesInCat.map(p => {
                          const isCompatible = isUniversal || (allowedIds && allowedIds.includes(p.id))

                          return (
                            <label
                              key={p.id}
                              onClick={() => togglePieceCompat(cat.id, p.id)}
                              className={`flex items-start gap-3 p-3 rounded-[4px] border transition-all cursor-pointer ${
                                isCompatible
                                  ? 'border-[#166534] bg-green-50/40 text-[#1c1917] shadow-2xs'
                                  : 'border-[#e5e4e2] bg-white opacity-60 text-[#78716c]'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={!!isCompatible}
                                onChange={() => {}} // handled by label onClick
                                className="w-4 h-4 mt-0.5 rounded-[2px] accent-[#166534] shrink-0 pointer-events-none"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="text-[13px] font-medium leading-tight truncate">
                                    {p.name}
                                  </p>
                                  <span className={`text-[9px] font-cabin font-bold uppercase shrink-0 px-1 py-0.2 rounded-[2px] ${
                                    isCompatible ? 'text-[#166534] bg-green-100' : 'text-[#78716c] bg-[#e5e4e2]'
                                  }`}>
                                    {isCompatible ? 'Compatible' : 'No apta'}
                                  </span>
                                </div>
                                <p className="font-mono text-[11px] text-[#78716c] mt-0.5">
                                  {p.sku}
                                </p>
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
              <div className="admin-card admin-empty">
                <p className="admin-empty-title">Selecciona una pieza a la izquierda</p>
                <p className="text-[12px] max-w-sm mt-1">
                  Elige una caja, bisel o movimiento para visualizar y editar sus reglas físicas de ensamble.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
