import { NFT, FormState } from "@/types";

export type SearchKey = "users";

export interface UserState {
  queryString: Record<SearchKey, string>;
  bulkList: Array<NFT & FormState.SellNFT>;
}

export interface UserAction {
  setQueryString: (key: SearchKey, text: string) => void;
  addOrRemoveBulkList: (nft: NFT & FormState.SellNFT) => void;
  clearBulkList: () => void;
}
