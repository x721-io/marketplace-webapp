import { Address } from "wagmi";
import { BigNumberish } from "ethers";
import { Collection, User } from "@/types/entitites";

export type MarketEventType =
  | "AskNew"
  | "AskCancel"
  | "Trade"
  | "AcceptBid"
  | "Bid"
  | "CancelBid"
  | "Mint"
  | "Transfer";

export interface MarketEvent {
  id: string;
  event: MarketEventType;

  NFT?: {
    animationUrl: string;
    id: string;
    image: string;
    name: string;
    u2uId: string;
  };

  collection?: Pick<
    Collection,
    | "address"
    | "id"
    | "isU2U"
    | "name"
    | "shortUrl"
    | "status"
    | "txCreationHash"
    | "type"
  >;
  price: BigNumberish;
  to: Partial<User> | null;
  from: Partial<User> | null;
  quoteToken: Address;
  operationId: string;
  quantity: string;
  timestamp: number;
}

export interface MarketEventV2 {
  id: string;
  index: number;
  sig: string;
  makeAssetType: number;
  makeAssetAddress: Address;
  makeAssetValue: string;
  makeAssetId: string;
  takeAssetType: 1;
  takeAssetAddress: Address;
  takeAssetValue: string;
  takeAssetId: string;
  salt: string;
  start: number;
  end: number;
  dataOrder: string;
  orderStatus: "OPEN" | "CANCELLED" | "FILLED" | "PENDING";
  orderType: "SINGLE" | "BULK" | "BID";
  root: string;
  proof: string[];
  tokenId: string;
  collectionId: string;
  quantity: number;
  price: string;
  priceNum: number;
  netPrice: string;
  netPriceNum: number;
  createAt: string;
  updatedAt: string;
  quoteToken: Address;
  filled: number;
  Maker: User | null;
  Taker: User | null;
}

export type Royalty = { account: Address; value: bigint };

export type Royalties = Royalty[];
