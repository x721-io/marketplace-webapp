import { NFT } from "@/types";

export type SearchKey = "users";

export interface UserState {
  queryString: Record<SearchKey, string>;
  bulkList: NFT[];
}

export interface UserAction {
  setQueryString: (key: SearchKey, text: string) => void;
  addToBulkList: (nft: NFT) => void;
  removeFromBulkList: (nftId: string) => void;
}
