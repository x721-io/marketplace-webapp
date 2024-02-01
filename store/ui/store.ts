import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UIAction, UIState } from "@/store/ui/types";

const DEFAULT_STATE: UIState = {
  showFilters: {
    collections: false,
    nfts: false,
    profile: false,
  },
  queryString: {
    collection: "",
    collections: "",
    nfts: "",
    users: "",
  },
};

export const useUIStore = create(
  devtools<UIState & UIAction>(
    (set, get) => ({
      ...DEFAULT_STATE,
      toggleFilter: (key, bool) =>
        set((state) => {
          return {
            showFilters: {
              ...state.showFilters,
              [key]: bool ?? !state.showFilters[key],
            },
          };
        }),
      setQueryString: (key, text) =>
        set((state) => ({
          queryString: {
            ...state.queryString,
            [key]: text,
          },
        })),
    }),
    { name: "ui-storage" },
  ),
);
