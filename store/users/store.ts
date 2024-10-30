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
        addOrRemoveBulkList: (_nft) =>
          set((state) => ({
            bulkList: !state.bulkList.find((nft) => nft.id === _nft.id)
              ? [...state.bulkList, _nft]
              : state.bulkList.filter((nft) => nft.id !== _nft.id),
          })),
        clearBulkList: () =>
          set((state) => ({
            bulkList: [],
          })),
      }),
      { name: "user-storage" }
    )
  )
);
