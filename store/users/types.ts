import { FormState } from "@/types";

export type SearchKey = "users";

export interface UserState {
  queryString: Record<SearchKey, string>;
  bulkOrders: FormState.SellNFTV2[];
}

export interface UserAction {
  setQueryString: (key: SearchKey, text: string) => void;
  upsertBulkOrdersItem: (item: FormState.SellNFTV2) => void;
  removeBulkOrdersItem: (index: number) => void;
  removeAllBulkOrderItems: () => void;
}
