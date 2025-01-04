import { APIResponse } from "@/services/api/types";
import { NFT } from "@/types";

export type SearchKey = "users";

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

export type CartItem = {
  marketData: APIResponse.NFTMarketData;
  nftData: NFT;
  qty: number;
};

export type Cart = {
  items: CartItem[];
  isOpen: boolean;
};

export type AppSettingsState = {
  theme: Theme;
  cart: Cart;
};

export interface AppSettingsActions {
  setTheme: (theme: Theme) => void;
  toggleCart: (cartState: boolean) => void;
  setCartItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart(item: CartItem): void;
  updateCartItem: (item: CartItem) => void;
}
