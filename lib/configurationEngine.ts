/**
 * CONFIGURATION ENGINE
 * Central business logic module for Watch Configurator
 * Pure, data-driven, and testable.
 */

export interface CompatibilityRule {
  id: string
  pieceId: string
  targetCategoryId: string
  ruleType: 'whitelist' | 'blacklist' | 'attribute_match'
  targetPieceIds: string[] | null
  attributeKey: string | null
  attributeValue: string | null
  description: string | null
}

export interface PieceAttribute {
  attributeDefinition: {
    name: string
    label?: string
  }
  value: string
}

export interface PieceData {
  id: string
  sku: string
  name: string
  description?: string | null
  categoryId: string
  price: number
  stock: number
  isActive: boolean
  material?: string | null
  color?: string | null
  compositionImage?: string | null
  productImage?: string | null
  thumbnail?: string | null
  layerImage?: string | null
  layerScale: number
  layerX: number
  layerY: number
  layerRotation: number
  layerZIndex: number
  layerOpacity: number
  layerVisible: boolean
  attributes?: PieceAttribute[]
  category?: {
    id: string
    name: string
    slug: string
    step: number
    layerZIndex: number
  }
}

export interface CategoryData {
  id: string
  name: string
  slug: string
  step: number
  description?: string | null
  isRequired: boolean
  isActive: boolean
  layerZIndex: number
  icon?: string | null
}

export interface VisualLayer {
  categoryId: string
  categorySlug: string
  pieceId: string
  pieceName: string
  image: string
  zIndex: number
  scale: number
  x: number
  y: number
  rotation: number
  opacity: number
}

export interface CompatEvaluation {
  compatible: boolean
  reason?: string
  blockedBy?: string
}

export interface PriceBreakdown {
  basePrice: number
  componentsTotal: number
  totalPrice: number
  addons: Array<{
    categoryName: string
    pieceName: string
    price: number
  }>
}

export interface EngineResult {
  isComplete: boolean
  totalPrice: number
  basePrice: number
  priceBreakdown: PriceBreakdown
  visualLayers: VisualLayer[]
  validationErrors: string[]
  compatiblePartIds: string[]
  incompatibleParts: Record<string, { reason: string; blockedBy?: string }>
}

/**
 * Evaluates compatibility of a candidate piece against all currently selected pieces.
 */
export function evaluatePieceCompatibility(
  candidate: PieceData,
  currentSelections: Record<string, PieceData>,
  allRules: CompatibilityRule[]
): CompatEvaluation {
  const candidateAttrs = new Map<string, string>()
  for (const attr of candidate.attributes || []) {
    candidateAttrs.set(attr.attributeDefinition.name, attr.value)
  }

  for (const [catId, selected] of Object.entries(currentSelections)) {
    if (!selected) continue
    if (selected.id === candidate.id) continue
    if (selected.categoryId === candidate.categoryId) continue

    // Rules defined by the selected piece targeting candidate's category
    const rulesFromSelected = allRules.filter(
      r => r.pieceId === selected.id && r.targetCategoryId === candidate.categoryId
    )

    for (const rule of rulesFromSelected) {
      if (rule.ruleType === 'whitelist') {
        const allowed = rule.targetPieceIds || []
        if (allowed.length > 0 && !allowed.includes(candidate.id)) {
          return {
            compatible: false,
            reason: rule.description || `No compatible con tu selección actual de ${selected.name}`,
            blockedBy: selected.name,
          }
        }
      } else if (rule.ruleType === 'blacklist') {
        const forbidden = rule.targetPieceIds || []
        if (forbidden.includes(candidate.id)) {
          return {
            compatible: false,
            reason: rule.description || `Incompatible con tu ${selected.name}`,
            blockedBy: selected.name,
          }
        }
      } else if (rule.ruleType === 'attribute_match') {
        if (rule.attributeKey && rule.attributeValue) {
          const val = candidateAttrs.get(rule.attributeKey)
          if (val !== rule.attributeValue) {
            return {
              compatible: false,
              reason: rule.description || `Requiere ${rule.attributeKey} = ${rule.attributeValue}`,
              blockedBy: selected.name,
            }
          }
        }
      }
    }

    // Also check rules defined by the candidate piece targeting the selected piece's category
    const rulesFromCandidate = allRules.filter(
      r => r.pieceId === candidate.id && r.targetCategoryId === selected.categoryId
    )

    for (const rule of rulesFromCandidate) {
      if (rule.ruleType === 'whitelist') {
        const allowed = rule.targetPieceIds || []
        if (allowed.length > 0 && !allowed.includes(selected.id)) {
          return {
            compatible: false,
            reason: rule.description || `Requiere una selección diferente de ${selected.name}`,
            blockedBy: selected.name,
          }
        }
      }
    }
  }

  return { compatible: true }
}

/**
 * Checks if changing a selection in step N invalidates any already selected pieces in steps N+1..end.
 */
export function detectInvalidatedSelections(
  newPiece: PieceData,
  currentSelections: Record<string, PieceData>,
  categoriesInOrder: CategoryData[],
  allRules: CompatibilityRule[]
): Array<{ categoryId: string; categoryName: string; invalidPiece: PieceData; reason: string }> {
  const currentStep = categoriesInOrder.findIndex(c => c.id === newPiece.categoryId)
  if (currentStep === -1) return []

  const futureCategories = categoriesInOrder.slice(currentStep + 1)
  const simulatedSelections = { ...currentSelections, [newPiece.categoryId]: newPiece }

  const invalidated: Array<{ categoryId: string; categoryName: string; invalidPiece: PieceData; reason: string }> = []

  for (const cat of futureCategories) {
    const selectedPiece = simulatedSelections[cat.id]
    if (!selectedPiece) continue

    const evalResult = evaluatePieceCompatibility(selectedPiece, simulatedSelections, allRules)
    if (!evalResult.compatible) {
      invalidated.push({
        categoryId: cat.id,
        categoryName: cat.name,
        invalidPiece: selectedPiece,
        reason: evalResult.reason || `No compatible con ${newPiece.name}`
      })
    }
  }

  return invalidated
}

/**
 * The Central Configuration Engine.
 */
export function configurationEngine(params: {
  selectedPieces: Record<string, PieceData> // categoryId -> PieceData
  categories: CategoryData[]
  allRules: CompatibilityRule[]
  candidateCategory?: CategoryData
  candidatePieces?: PieceData[]
  engravingText?: string
  baseWatchPrice?: number
}): EngineResult {
  const {
    selectedPieces,
    categories,
    allRules,
    candidatePieces = [],
    engravingText,
    baseWatchPrice = 250, // Base bespoke watch assembly & Swiss QC
  } = params

  const addons: Array<{ categoryName: string; pieceName: string; price: number }> = []
  let componentsTotal = 0
  const validationErrors: string[] = []

  // 1. Calculate Prices & Addons
  for (const cat of categories) {
    const piece = selectedPieces[cat.id]
    if (piece) {
      componentsTotal += piece.price
      addons.push({
        categoryName: cat.name,
        pieceName: piece.name,
        price: piece.price,
      })
    } else if (cat.isRequired) {
      validationErrors.push(`Falta seleccionar ${cat.name}`)
    }
  }

  // Engraving fee if text is present
  if (engravingText && engravingText.trim().length > 0) {
    addons.push({
      categoryName: 'Grabado Láser',
      pieceName: `"${engravingText.trim()}"`,
      price: 30,
    })
    componentsTotal += 30
  }

  const totalPrice = baseWatchPrice + componentsTotal

  // 2. Build Sorted Visual Layers
  // 2. Build Sorted Visual Layers (strictly 1 layer per category)
  const layerMap = new Map<string, VisualLayer>()
  for (const [catId, piece] of Object.entries(selectedPieces)) {
    if (!piece) continue
    if (!piece.layerVisible) continue

    // Layer image hierarchy: compositionImage -> layerImage -> productImage
    let image = piece.compositionImage || piece.layerImage || piece.productImage
    if (!image) continue
    if (image.endsWith('.svg')) {
      image = image.replace(/\.svg$/, '.png')
    }

    const cat = categories.find(c => c.id === catId)
    const categorySlug = cat?.slug || piece.category?.slug || 'part'
    const zIndex = piece.layerZIndex !== undefined ? piece.layerZIndex : (cat?.layerZIndex ?? 5)

    layerMap.set(categorySlug, {
      categoryId: catId,
      categorySlug,
      pieceId: piece.id,
      pieceName: piece.name,
      image,
      zIndex,
      scale: piece.layerScale || 1.0,
      x: piece.layerX || 0,
      y: piece.layerY || 0,
      rotation: piece.layerRotation || 0,
      opacity: piece.layerOpacity !== undefined ? piece.layerOpacity : 1.0,
    })
  }

  const visualLayers = Array.from(layerMap.values())
  // Sort layers strictly by zIndex ascending (lowest layer on bottom, highest on top)
  visualLayers.sort((a, b) => a.zIndex - b.zIndex || a.categorySlug.localeCompare(b.categorySlug))

  // 3. Evaluate candidate pieces compatibility
  const compatiblePartIds: string[] = []
  const incompatibleParts: Record<string, { reason: string; blockedBy?: string }> = {}

  for (const candidate of candidatePieces) {
    const evalRes = evaluatePieceCompatibility(candidate, selectedPieces, allRules)
    if (evalRes.compatible) {
      compatiblePartIds.push(candidate.id)
    } else {
      incompatibleParts[candidate.id] = {
        reason: evalRes.reason || 'No compatible con tu configuración actual',
        blockedBy: evalRes.blockedBy
      }
    }
  }

  const isComplete = categories.filter(c => c.isRequired).every(c => !!selectedPieces[c.id])

  return {
    isComplete,
    totalPrice,
    basePrice: baseWatchPrice,
    priceBreakdown: {
      basePrice: baseWatchPrice,
      componentsTotal,
      totalPrice,
      addons,
    },
    visualLayers,
    validationErrors,
    compatiblePartIds,
    incompatibleParts,
  }
}
