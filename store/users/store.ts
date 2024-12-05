import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UserAction, UserState } from "@/store/users/types";
import { FormState } from "@/types";

const DEFAULT_STATE: UserState = {
  queryString: {
    users: "",
  },
  bulkOrders: [],
};

export const useUserStore = create(
  devtools(
    persist<UserState & UserAction>(
      (set, get) => ({
        ...DEFAULT_STATE,
        setQueryString: (key, text) =>
          set((state) => ({
            queryString: {
              ...state.queryString,
              [key]: text,
            },
          })),
        upsertBulkOrdersItem: (item: FormState.SellNFTV2) =>
          set((state) => ({
            bulkOrders: state.bulkOrders.find(
              (o) =>
                o.nft?.collectionId === item.nft?.collectionId &&
                o.nft?.id === item.nft?.id
            )
              ? [
                  ...state.bulkOrders.filter(
                    (o) =>
                      o.nft?.id !== item.nft?.id &&
                      o.nft?.collectionId !== item.nft?.collectionId
                  ),
                  item,
                ]
              : [...state.bulkOrders, item],
          })),
        removeBulkOrdersItem: (index: number) =>
          set((state) => ({
            bulkOrders: state.bulkOrders.toSpliced(index, 1),
          })),
      }),
      { name: "user-storage" }
    )
  )
);
