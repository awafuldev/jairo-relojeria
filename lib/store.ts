import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  configurationEngine,
  detectInvalidatedSelections,
  type PieceData,
  type CategoryData,
  type CompatibilityRule,
  type VisualLayer,
  type PriceBreakdown,
} from './configurationEngine'

export interface PendingInvalidation {
  newPiece: PieceData
  invalidatedList: Array<{ categoryId: string; categoryName: string; invalidPiece: PieceData; reason: string }>
}

interface ConfiguratorStore {
  // Categories & navigation
  categories: CategoryData[]
  currentStepIndex: number

  // Selections & Engraving
  selections: Record<string, PieceData>
  engravingText: string
  engravingFont: string

  // Catalog cache & rules
  availablePieces: PieceData[]
  isLoadingPieces: boolean
  allRules: CompatibilityRule[]

  // Invalidation modal state
  pendingInvalidation: PendingInvalidation | null

  // Computed engine state
  totalPrice: number
  basePrice: number
  priceBreakdown: PriceBreakdown
  visualLayers: VisualLayer[]
  compatiblePartIds: string[]
  incompatibleParts: Record<string, { reason: string; blockedBy?: string }>
  isComplete: boolean

  // Actions
  setCategories: (cats: CategoryData[]) => void
  setAllRules: (rules: CompatibilityRule[]) => void
  setCurrentStep: (index: number) => void
  nextStep: () => void
  prevStep: () => void
  setAvailablePieces: (pieces: PieceData[]) => void
  setLoadingPieces: (loading: boolean) => void

  selectPiece: (piece: PieceData) => void
  confirmInvalidationChange: () => void
  cancelInvalidationChange: () => void
  clearSelection: (categoryId: string) => void

  setEngravingText: (text: string) => void
  setEngravingFont: (font: string) => void
  loadSavedConfiguration: (selections: Record<string, PieceData>, engraving?: string) => void
  reset: () => void
}

const DEFAULT_BASE_PRICE = 250 // Base luxury assembly, pressure testing & Swiss timing regulation

export const useConfiguratorStore = create<ConfiguratorStore>()(
  persist(
    (set, get) => ({
      categories: [],
      currentStepIndex: 0,
      selections: {},
      engravingText: '',
      engravingFont: 'classic',
      availablePieces: [],
      isLoadingPieces: false,
      allRules: [],
      pendingInvalidation: null,

      totalPrice: DEFAULT_BASE_PRICE,
      basePrice: DEFAULT_BASE_PRICE,
      priceBreakdown: {
        basePrice: DEFAULT_BASE_PRICE,
        componentsTotal: 0,
        totalPrice: DEFAULT_BASE_PRICE,
        addons: [],
      },
      visualLayers: [],
      compatiblePartIds: [],
      incompatibleParts: {},
      isComplete: false,

      setCategories: (categories) => {
        set({ categories })
        const state = get()
        const engineRes = configurationEngine({
          selectedPieces: state.selections,
          categories,
          allRules: state.allRules,
          candidatePieces: state.availablePieces,
          engravingText: state.engravingText,
          baseWatchPrice: state.basePrice,
        })
        set({
          totalPrice: engineRes.totalPrice,
          priceBreakdown: engineRes.priceBreakdown,
          visualLayers: engineRes.visualLayers,
          isComplete: engineRes.isComplete,
        })
      },

      setAllRules: (allRules) => {
        set({ allRules })
        const state = get()
        const engineRes = configurationEngine({
          selectedPieces: state.selections,
          categories: state.categories,
          allRules,
          candidatePieces: state.availablePieces,
          engravingText: state.engravingText,
          baseWatchPrice: state.basePrice,
        })
        set({
          totalPrice: engineRes.totalPrice,
          priceBreakdown: engineRes.priceBreakdown,
          visualLayers: engineRes.visualLayers,
          compatiblePartIds: engineRes.compatiblePartIds,
          incompatibleParts: engineRes.incompatibleParts,
          isComplete: engineRes.isComplete,
        })
      },

      setCurrentStep: (index) => {
        const { categories } = get()
        const clamped = Math.max(0, Math.min(index, categories.length))
        set({ currentStepIndex: clamped, availablePieces: [] })
      },

      nextStep: () => {
        const { currentStepIndex, categories } = get()
        const next = Math.min(currentStepIndex + 1, categories.length)
        set({ currentStepIndex: next, availablePieces: [] })
      },

      prevStep: () => {
        const { currentStepIndex } = get()
        const prev = Math.max(currentStepIndex - 1, 0)
        set({ currentStepIndex: prev, availablePieces: [] })
      },

      setLoadingPieces: (isLoadingPieces) => set({ isLoadingPieces }),

      setAvailablePieces: (availablePieces) => {
        const state = get()
        const engineRes = configurationEngine({
          selectedPieces: state.selections,
          categories: state.categories,
          allRules: state.allRules,
          candidatePieces: availablePieces,
          engravingText: state.engravingText,
          baseWatchPrice: state.basePrice,
        })
        set({
          availablePieces,
          compatiblePartIds: engineRes.compatiblePartIds,
          incompatibleParts: engineRes.incompatibleParts,
          isLoadingPieces: false,
        })
      },

      selectPiece: (piece) => {
        const state = get()
        const currentSelected = state.selections[piece.categoryId]
        if (currentSelected?.id === piece.id) {
          return // Already selected
        }

        // Check if this change will invalidate any subsequent selected parts
        const invalidated = detectInvalidatedSelections(
          piece,
          state.selections,
          state.categories,
          state.allRules
        )

        if (invalidated.length > 0) {
          // Open user-friendly confirmation modal as required in prompt
          set({
            pendingInvalidation: {
              newPiece: piece,
              invalidatedList: invalidated,
            }
          })
          return
        }

        // Apply selection directly
        const updatedSelections = { ...state.selections, [piece.categoryId]: piece }
        const engineRes = configurationEngine({
          selectedPieces: updatedSelections,
          categories: state.categories,
          allRules: state.allRules,
          candidatePieces: state.availablePieces,
          engravingText: state.engravingText,
          baseWatchPrice: state.basePrice,
        })

        set({
          selections: updatedSelections,
          totalPrice: engineRes.totalPrice,
          priceBreakdown: engineRes.priceBreakdown,
          visualLayers: engineRes.visualLayers,
          compatiblePartIds: engineRes.compatiblePartIds,
          incompatibleParts: engineRes.incompatibleParts,
          isComplete: engineRes.isComplete,
        })
      },

      confirmInvalidationChange: () => {
        const state = get()
        if (!state.pendingInvalidation) return

        const { newPiece, invalidatedList } = state.pendingInvalidation
        const updatedSelections = { ...state.selections, [newPiece.categoryId]: newPiece }

        // Remove the incompatible future pieces cleanly
        for (const item of invalidatedList) {
          delete updatedSelections[item.categoryId]
        }

        const engineRes = configurationEngine({
          selectedPieces: updatedSelections,
          categories: state.categories,
          allRules: state.allRules,
          candidatePieces: state.availablePieces,
          engravingText: state.engravingText,
          baseWatchPrice: state.basePrice,
        })

        set({
          selections: updatedSelections,
          pendingInvalidation: null,
          totalPrice: engineRes.totalPrice,
          priceBreakdown: engineRes.priceBreakdown,
          visualLayers: engineRes.visualLayers,
          compatiblePartIds: engineRes.compatiblePartIds,
          incompatibleParts: engineRes.incompatibleParts,
          isComplete: engineRes.isComplete,
        })
      },

      cancelInvalidationChange: () => {
        set({ pendingInvalidation: null })
      },

      clearSelection: (categoryId) => {
        const state = get()
        const updatedSelections = { ...state.selections }
        delete updatedSelections[categoryId]

        const engineRes = configurationEngine({
          selectedPieces: updatedSelections,
          categories: state.categories,
          allRules: state.allRules,
          candidatePieces: state.availablePieces,
          engravingText: state.engravingText,
          baseWatchPrice: state.basePrice,
        })

        set({
          selections: updatedSelections,
          totalPrice: engineRes.totalPrice,
          priceBreakdown: engineRes.priceBreakdown,
          visualLayers: engineRes.visualLayers,
          compatiblePartIds: engineRes.compatiblePartIds,
          incompatibleParts: engineRes.incompatibleParts,
          isComplete: engineRes.isComplete,
        })
      },

      setEngravingText: (text) => {
        set({ engravingText: text })
        const state = get()
        const engineRes = configurationEngine({
          selectedPieces: state.selections,
          categories: state.categories,
          allRules: state.allRules,
          candidatePieces: state.availablePieces,
          engravingText: text,
          baseWatchPrice: state.basePrice,
        })
        set({
          totalPrice: engineRes.totalPrice,
          priceBreakdown: engineRes.priceBreakdown,
        })
      },

      setEngravingFont: (font) => set({ engravingFont: font }),

      loadSavedConfiguration: (loadedSelections, engraving = '') => {
        const state = get()
        const engineRes = configurationEngine({
          selectedPieces: loadedSelections,
          categories: state.categories,
          allRules: state.allRules,
          candidatePieces: state.availablePieces,
          engravingText: engraving,
          baseWatchPrice: state.basePrice,
        })
        set({
          selections: loadedSelections,
          engravingText: engraving,
          totalPrice: engineRes.totalPrice,
          priceBreakdown: engineRes.priceBreakdown,
          visualLayers: engineRes.visualLayers,
          isComplete: engineRes.isComplete,
        })
      },

      reset: () => {
        const state = get()
        const engineRes = configurationEngine({
          selectedPieces: {},
          categories: state.categories,
          allRules: state.allRules,
          baseWatchPrice: DEFAULT_BASE_PRICE,
        })
        set({
          selections: {},
          currentStepIndex: 0,
          engravingText: '',
          engravingFont: 'classic',
          pendingInvalidation: null,
          totalPrice: engineRes.totalPrice,
          priceBreakdown: engineRes.priceBreakdown,
          visualLayers: engineRes.visualLayers,
          isComplete: false,
        })
      },
    }),
    {
      name: 'chrono-v5-clean-layers',
      partialize: (s) => ({
        selections: s.selections,
        currentStepIndex: s.currentStepIndex,
        engravingText: s.engravingText,
        engravingFont: s.engravingFont,
      }),
    }
  )
)
