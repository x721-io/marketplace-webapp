import { BigNumberish } from "ethers";
import { Collection, User } from "@/types/entitites";
import { Address } from "abitype";

export enum OrderStatus {
  OPEN = 0,
  CANCELLED = 1,
  FILLED = 2,
  PENDING = 3,
}

export enum OrderType {
  SINGLE = 0,
  BULK = 1,
  BID = 2,
}

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

export type Royalty = { account: Address; value: bigint };

export type Royalties = Royalty[];

export interface MarketEventV2 {
  Maker: User | null;
  Taker: User | null;
  id: string;
  index: number;
  netPrice: string;
  netPriceNum: number;
  orderStatus: OrderStatus;
  orderType: string;
  price: string;
  priceNum: number;
  quoteToken: Address;
  sig: string;
  timestamp: number;
  start: number;
  end: number;
  quantity: number;
  filledQty: number;
}

export interface PartialOrderDetails {
  tokenId: string;
  collectionId: string;
  updatedAt: string;
  filled: number;
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
  root: string;
  proof: string[];
}

export interface OrderDetails extends PartialOrderDetails, MarketEventV2 {}

export interface PriceHistoryItem {
  id: string;
  index: number;
  sig: string;
  nonce: string;
  fromId: string;
  toId: string;
  qtyMatch: number;
  price: string;
  priceNum: number;
  timestamp: number;
  From: {
    id: string;
    email: string;
    avatar: any;
    username: string;
    publicKey: string;
    accountStatus: boolean;
    verifyEmail: boolean;
    signer: string;
  };
  To: {
    id: string;
    email: string;
    avatar: any;
    username: string;
    publicKey: string;
    accountStatus: boolean;
    verifyEmail: boolean;
    signer: string;
  };
}
