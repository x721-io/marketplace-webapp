import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UserAction, UserState } from "@/store/users/types";

const DEFAULT_STATE: UserState = {
  queryString: {
    users: "",
  },
  bulkList: [],
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
        addToBulkList: (nft) =>
          set((state) => ({
            bulkList: [...state.bulkList, nft],
          })),
        removeFromBulkList: (nftId: string) =>
          set((state) => ({
            bulkList: state.bulkList.filter((nft) => nft.id !== nftId),
          })),
      }),
      { name: "user-storage" }
    )
  )
);
