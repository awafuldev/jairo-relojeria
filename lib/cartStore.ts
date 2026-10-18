'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  reference?: string
  price: number
  quantity: number
  image: string
  slug: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  totalCount: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) => {
        set(state => {
          const existing = state.items.find(i => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { ...item, quantity }],
            isOpen: true,
          }
        })
      },

      removeItem: (id: string) => {
        set(state => ({
          items: state.items.filter(i => i.id !== id),
        }))
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      totalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0)
      },

      totalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'jairo_cart_storage',
    }
  )
)
