import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type OrderItem = {
  itemId: number
  qty: number
}

type TableOrder = {
  items: OrderItem[]
  createdAt: number // timestamp
}

type OrderStoreState = {
  orders: Record<string, TableOrder>

  startOrder: (tableId: string) => void
  addItem: (tableId: string, itemId: number) => void
  removeItem: (tableId: string, itemId: number) => void
  clearTable: (tableId: string) => void
  resetAll: () => void
}

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: {},

      startOrder: (tableId) =>
        set((state) => ({
          orders: {
            ...state.orders,
            [tableId]: state.orders[tableId] ?? {
              items: [],
              createdAt: Date.now(),
            },
          },
        })),

      addItem: (tableId, itemId) =>
        set((state) => {
          const order = state.orders[tableId]
          if (!order) return state

          const existing = order.items.find((i) => i.itemId === itemId)

          let newItems
          if (existing) {
            newItems = order.items.map((i) => (i.itemId === itemId ? { ...i, qty: i.qty + 1 } : i))
          } else {
            newItems = [...order.items, { itemId, qty: 1 }]
          }

          return {
            orders: {
              ...state.orders,
              [tableId]: { ...order, items: newItems },
            },
          }
        }),

      removeItem: (tableId, itemId) =>
        set((state) => {
          const order = state.orders[tableId]
          if (!order) return state

          const newItems = order.items
            .map((i) => (i.itemId === itemId ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0)

          return {
            orders: {
              ...state.orders,
              [tableId]: { ...order, items: newItems },
            },
          }
        }),

      clearTable: (tableId) =>
        set((state) => {
          const copy = { ...state.orders }
          delete copy[tableId]
          return { orders: copy }
        }),

      resetAll: () => set({ orders: {} }),
    }),

    {
      name: 'pos-orders',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
