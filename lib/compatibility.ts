/**
 * COMPATIBILITY ENGINE
 *
 * Rules engine that evaluates whether a candidate piece is compatible
 * with the current selections in the configurator.
 *
 * Rules are fetched from the DB and evaluated client-side for instant feedback.
 *
 * Rule types:
 *  - "whitelist":       candidate.id must be in targetPieceIds
 *  - "blacklist":       candidate.id must NOT be in targetPieceIds
 *  - "attribute_match": candidate.attributes[attributeKey] must === attributeValue
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

export interface PieceWithAttrs {
  id: string
  sku: string
  name: string
  categoryId: string
  attributes: Array<{
    attributeDefinition: { name: string }
    value: string
  }>
}

export interface CompatResult {
  compatible: boolean
  reason?: string
  blockedBy?: string // name of the piece that blocked it
}

/**
 * Evaluate whether a candidate piece is compatible with all current selections.
 *
 * @param candidate   The piece to evaluate
 * @param selections  Map of categoryId → selected piece (with attributes)
 * @param allRules    All compatibility rules (pre-fetched from DB)
 */
export function evaluateCompatibility(
  candidate: PieceWithAttrs,
  selections: Map<string, PieceWithAttrs>,
  allRules: CompatibilityRule[]
): CompatResult {
  const candidateAttrs = buildAttrMap(candidate)

  for (const [, selectedPiece] of selections) {
    // Skip if comparing to same piece or same category
    if (selectedPiece.id === candidate.id) continue
    if (selectedPiece.categoryId === candidate.categoryId) continue

    // Find rules from the selected piece targeting candidate's category
    const rulesFromSelected = allRules.filter(
      r => r.pieceId === selectedPiece.id && r.targetCategoryId === candidate.categoryId
    )

    for (const rule of rulesFromSelected) {
      const result = applyRule(rule, candidate, candidateAttrs)
      if (!result.compatible) {
        return {
          compatible: false,
          reason: result.reason ?? `Not compatible with your ${selectedPiece.name}`,
          blockedBy: selectedPiece.name,
        }
      }
    }

    // Also check rules FROM candidate targeting selected piece's category
    const rulesFromCandidate = allRules.filter(
      r => r.pieceId === candidate.id && r.targetCategoryId === selectedPiece.categoryId
    )

    for (const rule of rulesFromCandidate) {
      const result = applyRule(rule, selectedPiece, buildAttrMap(selectedPiece))
      if (!result.compatible) {
        return {
          compatible: false,
          reason: result.reason ?? `Requires a different ${selectedPiece.name}`,
          blockedBy: selectedPiece.name,
        }
      }
    }
  }

  return { compatible: true }
}

function applyRule(
  rule: CompatibilityRule,
  target: PieceWithAttrs,
  targetAttrs: Map<string, string>
): CompatResult {
  switch (rule.ruleType) {
    case 'whitelist': {
      if (!rule.targetPieceIds) return { compatible: true }
      const allowed = rule.targetPieceIds
      if (!allowed.includes(target.id)) {
        return {
          compatible: false,
          reason: rule.description ?? 'Not compatible with current selection',
        }
      }
      return { compatible: true }
    }

    case 'blacklist': {
      if (!rule.targetPieceIds) return { compatible: true }
      const blocked = rule.targetPieceIds
      if (blocked.includes(target.id)) {
        return {
          compatible: false,
          reason: rule.description ?? 'Not compatible with current selection',
        }
      }
      return { compatible: true }
    }

    case 'attribute_match': {
      if (!rule.attributeKey || !rule.attributeValue) return { compatible: true }
      const val = targetAttrs.get(rule.attributeKey)
      if (val !== rule.attributeValue) {
        return {
          compatible: false,
          reason: rule.description ?? `Requires ${rule.attributeKey} = ${rule.attributeValue}`,
        }
      }
      return { compatible: true }
    }

    default:
      return { compatible: true }
  }
}

function buildAttrMap(piece: PieceWithAttrs): Map<string, string> {
  const map = new Map<string, string>()
  for (const attr of piece.attributes) {
    map.set(attr.attributeDefinition.name, attr.value)
  }
  return map
}

/**
 * After a selection changes in step N, find which already-selected pieces
 * in steps N+1..end are now incompatible.
 *
 * Returns array of categoryIds whose selections are now invalid.
 */
export function findInvalidatedSelections(
  changedCategoryId: string,
  selections: Map<string, PieceWithAttrs>,
  categoryOrder: string[], // categoryId in step order
  allRules: CompatibilityRule[]
): string[] {
  const changedIdx = categoryOrder.indexOf(changedCategoryId)
  if (changedIdx === -1) return []

  const invalidated: string[] = []

  // Only check categories AFTER the changed one
  const subsequentCategories = categoryOrder.slice(changedIdx + 1)

  for (const catId of subsequentCategories) {
    const selectedInCat = selections.get(catId)
    if (!selectedInCat) continue

    // Build selections map WITHOUT the current category being checked
    const selectionsWithoutCurrent = new Map(selections)
    selectionsWithoutCurrent.delete(catId)

    const result = evaluateCompatibility(selectedInCat, selectionsWithoutCurrent, allRules)
    if (!result.compatible) {
      invalidated.push(catId)
    }
  }

  return invalidated
}
