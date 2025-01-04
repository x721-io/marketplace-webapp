import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  AppSettingsActions,
  AppSettingsState,
  Theme,
} from "@/store/app-settings/types";

const DEFAULT_STATE: AppSettingsState = {
  theme: Theme.LIGHT,
  cart: {
    items: [],
    isOpen: false,
  },
};

export const useAppSettingsStore = create(
  devtools(
    persist<AppSettingsState & AppSettingsActions>(
      (set, get) => ({
        ...DEFAULT_STATE,
        setTheme: (theme) => set(() => ({ theme })),
        toggleCart(cartState) {
          set(() => ({
            cart: {
              ...get().cart,
              isOpen: cartState,
            },
          }));
        },
        setCartItems(items) {
          set(() => ({
            cart: {
              ...get().cart,
              items,
            },
          }));
        },
        addToCart(item) {
          set((state) => {
            const index = state.cart.items.findIndex(
              (_item) =>
                _item.nftData.id === item.nftData.id &&
                _item.nftData.collection.id === item.nftData.collection.id
            );
            if (index !== -1) return state;
            const items = [...state.cart.items, item];
            return {
              cart: {
                ...state.cart,
                items,
              },
            };
          });
        },
        removeFromCart(item) {
          set((state) => {
            const index = state.cart.items.findIndex(
              (_item) =>
                _item.nftData.id === item.nftData.id &&
                _item.nftData.collection.id === item.nftData.collection.id
            );
            if (index === -1) return state;
            const items = state.cart.items.filter((_, i) => i !== index);
            return {
              cart: {
                ...state.cart,
                items,
              },
            };
          });
        },
        updateCartItem(item) {
          set((state) => {
            const index = state.cart.items.findIndex(
              (_item) =>
                _item.nftData.id === item.nftData.id &&
                _item.nftData.collection.id === item.nftData.collection.id
            );
            if (index === -1) return state;
            const items = [...state.cart.items];
            items[index] = item;
            return {
              cart: {
                ...state.cart,
                items,
              },
            };
          });
        },
      }),
      { name: "app-settings" }
    )
  )
);
