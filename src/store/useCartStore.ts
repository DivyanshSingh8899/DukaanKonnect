import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Service } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (service: Service) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (service) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.service.id === service.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.service.id === service.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { service, quantity: 1 }] };
        }),
      removeItem: (serviceId) =>
        set((state) => ({
          items: state.items.filter((item) => item.service.id !== serviceId),
        })),
      updateQuantity: (serviceId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.service.id === serviceId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalAmount: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.service.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
