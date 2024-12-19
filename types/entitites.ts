import { Address } from "abitype";
import { MarketEventType } from "@/types/market";
import { BigNumberish } from "ethers";

export type AssetType = "ERC721" | "ERC1155";

export type EntityStatus = "PENDING" | "SUCCESS" | "FAILED";

export type ContractName =
  | "erc721Market"
  | "erc721Factory"
  | "erc721Proxy"
  | "erc721Base"
  | "erc1155Market"
  | "erc1155Factory"
  | "erc1155Proxy"
  | "erc1155Base"
  | "royaltiesRegistry";

export interface Contract {
  address: Address;
  abi: any;
}

export interface Trait {
  trait_type?: string;
  value?: string;
  display_type?: string;
}

export interface NFTMetadata {
  name?: string;
  description?: string;
  attributes?: Trait[];
  fileHashes?: string[];
  external_url?: string;
  animation_url?: string;
  type: string;
}

export interface User {
  id: string;
  email: string;
  avatar?: string;
  username: string;
  signature: Address;
  signedMessage: string;
  signer: Address;
  publicKey: Address;
  signDate: string;
  acceptedTerms: boolean;
  createdAt: string;
  updatedAt?: string;
  bio?: string;
  coverImage?: string;
  facebookLink?: string;
  twitterLink?: string;
  telegramLink?: string;
  discordLink?: string;
  webURL?: string;
  shortLink?: string;
  isFollowed: boolean;
  followers: string;
  following: string;
  accountStatus?: boolean;
  verifyEmail?: boolean;
}

export interface SaleInfo {
  price: string;
  priceNum: number;
  netPrice: string;
  netPriceNum: number;
  quantity: number;
  quoteToken: string;
  orderStatus: string;
  orderType: string;
  index: number;
  sig: string;
  filledQty: number;
  start: number;
  end: number;
}
export interface NFT {
  id: string;
  u2uId: string;
  name: string;
  status: EntityStatus;
  tokenUri: string;
  txCreationHash: string;
  creatorId: string;
  collectionId: string;
  image: string;
  animationUrl: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    avatar: null | string;
    email: string | null;
    id: string;
    publicKey: Address;
    username: string;
    accountStatus: boolean;
  } | null;
  collection: Collection;
  traits?: Trait[];
  price?: BigNumberish;
  sellStatus?: MarketEventType;
  quoteToken?: Address;
  sellInfo: SaleInfo | null;
  bidInfo: SaleInfo | null;
}

export interface Collection {
  id: string;
  txCreationHash: string;
  name: string | null;
  symbol: string;
  address: Address;
  isU2U: boolean;
  description?: string | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any> | string;
  shortUrl: string | null;
  status: EntityStatus;
  type: AssetType;
  creators: { userId: string; user: User }[];
  coverImage: string | null;
  avatar: string | null;
  volumn: string;
  totalOwner: number;
  totalNft: number;
  floorPrice: string;
  isVerified: boolean;
  metadataJson: MetadataJson;
  floor: number;
}

export interface Timeframe {
  hourStart: number;
  minuteStart: number;
  hourEnd: number;
  minuteEnd: number;
}

export enum AnalysisType {
  ONEDAY = "ONEDAY",
  ONEWEEK = "ONEWEEK",
  ONEMONTH = "ONEMONTH",
}

export enum AnalysisModeSort {
  floorPrice = "floorPrice",
  volume = "volume",
  owner = "owner",
  items = "items",
}

export enum AnalysisModeMinMax {
  floorPrice = "floorPrice",
  volume = "volume",
}

export type CollectionStatisticItem = {
  volumeChange: number;
  floorPriceChange: string;
  id: string;
  collectionId: string;
  keyTime: string;
  address: string;
  type: string;
  volume: string;
  volumeWei: string;
  floorPrice: string;
  items: string;
  owner: string;
  createdAt: string;
  collection: Collection;
};

export interface LayerGNFT {
  id: string;
  u2uId: string;
  name: string;
  status: EntityStatus;
  tokenUri: string;
  txCreationHash: string;
  creatorId: string;
  collectionId: string;
  image: string;
  animationUrl: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  nameSlug: string;
  isActive: boolean;
  metricPoint: string;
  metricDetail: MetricDetail;
  creator: {
    avatar: null | string;
    email: string | null;
    id: string;
    publicKey: Address;
    username: string;
    accountStatus: boolean;
  } | null;
  collection: Collection;
  sellInfo: SellInfo;
  bidInfo: BidInfo;
  derivedETH: number;
  derivedUSD: number;
  traits?: Trait[];
  sellStatus?: MarketEventType;
  quoteToken?: Address;
}

export interface MetricDetail {
  UserMetric: number;
  VolumeIndividual: number;
}

export interface MetadataJson {
  id: string;
  name: string;
  banner: string;
  category: Category[];
  gameIcon: string;
}

export interface Category {
  id: string;
  name: string;
  extract: string;
}

export interface Paging {
  page?: number;
  limit?: number;
}

export interface FilterLayerGNFTs extends Paging {
  collectionAddress?: string;
  collectionName?: string;
  categoryName?: string;
  symbol?: string;
  nftName?: string;
}

export interface SellInfo {
  price: string;
  quantity: number;
  quoteToken: string;
  orderStatus: string;
  orderType: string;
  index: number;
  sig: string;
  start: number;
  end: number;
}

export interface BidInfo {
  price: string;
  quantity: number;
  quoteToken: string;
  orderStatus: string;
  orderType: string;
  index: number;
  sig: string;
  start: number;
  end: number;
}
