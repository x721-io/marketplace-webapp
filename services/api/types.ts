import {
  AssetType,
  Trait,
  Collection,
  NFT,
  User,
  NFTMetadata,
  EntityStatus,
} from "@/types/entitites";
import { Address } from "abitype";
import { MarketEvent, MarketEventType, MarketEventV2 } from "@/types/market";
import { Project, RoundStatus } from "@/types";
import { FormState } from "@/types";

/********** =========== Queries & Params for Api call ========== ***********/
export namespace APIParams {
  export interface PaginationParams {
    page?: number;
    limit?: number;
    hasNext?: boolean;
  }

  export interface Paging {
    page?: number;
    limit?: number;
  }

  export interface WithAuth {
    accessToken?: string;
  }

  export interface Connect {
    date: string;
    publicKey: Address;
    signature: Address;
    signer: string;
  }

  export type UpdateProfile = Partial<
    Pick<
      User,
      | "acceptedTerms"
      | "email"
      | "username"
      | "bio"
      | "facebookLink"
      | "twitterLink"
      | "telegramLink"
      | "discordLink"
      | "webURL"
      | "coverImage"
      | "avatar"
      | "shortLink"
    >
  >;

  export interface ResendVerifyMail {
    email: string | undefined;
  }

  export type UpdateCollection = Partial<Pick<Collection, "coverImage" | "id">>;

  export type CreateCollection = Partial<
    Pick<
      Collection,
      | "txCreationHash"
      | "name"
      | "symbol"
      | "description"
      | "type"
      | "categoryId"
      | "shortUrl"
      | "metadata"
      | "avatar"
    >
  > & { creator: string };

  export type CreateNFT = Partial<
    Pick<
      NFT,
      | "id"
      | "u2uId"
      | "name"
      | "image"
      | "tokenUri"
      | "collectionId"
      | "txCreationHash"
      | "creatorId"
      | "traits"
    >
  >;

  export interface FetchUsers extends PaginationParams {
    search?: string;
  }

  export interface FetchCollections extends PaginationParams {
    name?: string;
    min?: string;
    max?: string;
    creatorAddress?: Address;
    quoteToken?: Address;
    order?: string;
    orderBy?: string;
  }
  export interface FetchCollectionsStatistics extends PaginationParams {
    search?: string;
    min?: string;
    max?: string;
    order?: string;
    orderBy?: string;
    type?: string;
    minMaxBy?: string;
  }

  export interface FetchCollectionById extends PaginationParams {
    userId: string;
    hasBase: boolean;
  }

  export interface FetchNFTs extends PaginationParams {
    traits?: Pick<Trait, "trait_type" | "value">[];
    type?: AssetType;
    collectionAddress?: Address;
    creatorAddress?: Address;
    priceMax?: string;
    priceMin?: string;
    sellStatus?: MarketEventType;
    owner?: Address;
    name?: string;
    quoteToken?: Address;
    order?: string;
    orderBy?: string;
  }

  export interface NFTEvents extends PaginationParams {
    tokenId: string;
    collectionAddress: Address;
  }

  export interface UserActivities extends PaginationParams {
    user: Address;
  }

  export interface PriceHistory {
    collectionAddress: Address;
    id: string;
  }

  export interface Search {
    text: string;
    mode: string;
  }

  export interface ValidateInput {
    key:
      | "username"
      | "email"
      | "shortLink"
      | "collectionName"
      | "collectionShortUrl"
      | "collectionSymbol"
      | "nftName";
    value: string;
    collectionId?: string;
  }

  export interface VerifyAcc {
    email: string;
    username: string;
    shortLink: string;
    bio: string;
    twitterLink: string;
    avatar: string;
  }

  export interface FetchNFTDetails {
    collectionAddress: string;
    id: string;
  }

  export interface FetchNFTMarketData extends FetchNFTDetails {
    bidListPage: number;
    bidListLimit: number;
  }

  export interface FetchEmailVerify {
    token: string;
  }

  export interface FetchProjects {
    mode?: RoundStatus;
  }

  export interface SubscribeRoundZero {
    projectId: string;
    walletAddress: Address;
  }

  export interface FetchSnapshot {
    userId: Address;
    projectId: string | string[];
  }

  export interface CrawlNFTInfo {
    collectionAddress: Address;
    txCreation: Address;
  }

  export interface FollowUser extends WithAuth {
    userId: string;
  }

  export interface CountNumber extends PaginationParams {
    collectionAddress?: Address;
    creatorAddress?: Address;
    owner?: Address;
    mode: string;
  }

  export interface FloorPrice {
    address?: Address;
  }

  export interface LayerGProjects extends Paging {
    name?: string;
  }

  export interface LayerGSmartContract extends Paging {
    projectId?: string;
    networkID?: number;
    contractName?: string;
    contractAddress?: string;
  }

  export interface FetchLayerGNFTs extends Paging {
    collectionAddress?: string;
    collectionName?: string;
    categoryName?: string;
    symbol?: string;
    nftName?: string;
    status?: LayerGStatus;
  }

  export interface LayerGCategory extends Paging {
    name?: string;
  }

  export interface LayerGStatus {
    orderStatus?: string;
    orderType?: string;
    order?: string;
    orderBy?: string;
  }
}

/********** =========== API Response types ========== ***********/
export namespace APIResponse {
  export type FetchProjects = Project[];

  export interface Snapshot {
    stakingTotal: string;
    lastDateRecord: Date;
  }

  export interface Pagination {
    page: number;
    limit: number;
    hasNext: boolean;
  }

  export interface Connect {
    accessToken: string;
    accessTokenExpire: number; // 1700117015092
    refreshToken: string;
    refreshTokenExpire: number; // 1700721515092
    userId: string;
  }

  export type ProfileDetails = User;

  export interface ResendEmail {
    status: boolean;
  }

  export interface UploadImage {
    fileHashes: string[];
    metadataHash: string;
  }

  export interface UploadMetadata {
    metadataHash: string;
  }

  export interface CollectionDetails {
    collection: Collection;
    traitAvailable: {
      key: string;
      count: number;
      traits: {
        value: string;
        count: number;
      }[];
    }[];
    generalInfo: {
      volumn: string;
      totalOwner: number;
      totalNft: number;
      floorPrice: string;
    };
  }

  export interface FetchCollections {
    data: Collection[];
    paging: Pagination;
  }

  export interface GenerateTokenId {
    u2uId: string;
    id: string;
  }

  export interface CreateNFT {
    tokenId: string;
  }

  export type NFTDetails = NFT;

  export interface FetchNFTs {
    data: NFT[];
    paging: Pagination;
  }

  export interface FetchEmailVerify {
    token: string;
  }

  export interface UsersData {
    data: User[];
    paging: Pagination;
  }

  export type NFTEvents = MarketEvent[];

  export type UserActivities = MarketEvent[];

  export interface NFTMarketData {
    sellInfo: MarketEventV2[];
    bidInfo: MarketEventV2[];
    owners: (Pick<
      User,
      | "username"
      | "avatar"
      | "email"
      | "publicKey"
      | "id"
      | "signer"
      | "accountStatus"
    > & { quantity: number })[];
    totalSupply: string;
  }

  export type FetchNFTMetadata = NFTMetadata;

  export type SearchNFTs = FetchNFTs;

  export type SearchCollections = FetchCollections;

  export type SearchUsers = UsersData;

  export type VerifyAccount = FormState.VerifyAccount;

  export interface FollowUser {
    isFollowed: boolean;
  }

  export interface TotalCount {
    total: number;
  }

  export interface FloorPrice {
    address: string;
  }

  export type Category = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };

  export type LayerGCategory = Category[];

  export interface GetLayerGProjects {
    data: LayerGProjects[];
    paging: Paging;
  }

  export interface LayerGProjects {
    id: string;
    name: string;
    apiKeyID: string;
    createdAt: string;
    updatedAt: string;
    platform: string[];
    isEnabled: boolean;
    nameSlug: string;
    categories: CategoryLayerG[];
    collections: Collection[];
    banner: string;
    gameIcon: string;
  }

  export interface CategoryLayerG {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Collection {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
    type: AssetType;
    address: Address;
    txCreationHash: string;
    status: string;
    isVerified: boolean;
    metadata: string;
    shortUrl: any;
    symbol: string;
    categoryId: any;
    avatar: string | null;
    isActive: boolean;
    isU2U: boolean;
    category: any;
    creators: { userId: string; user: User }[];
    coverImage: string | null;
    volumn: string;
    totalOwner: number;
    totalNft: number;
    floorPrice: string;
  }

  export interface SmartContract {
    id: string;
    contractType: string;
    networkID: number;
    contractName: string;
    tokenSymbol: string;
    totalSupply?: number;
    collectionId: string;
    deployedAt: string;
    updatedAt: string;
    contractAddress: string;
    nameSlug: any;
  }

  export interface Paging {
    page: number;
    limit: number;
    total: number;
  }

  export interface GetLayerGSmartContracts {
    data: SmartContract[];
    paging: Paging;
  }

  export interface SmartContract {
    id: string;
    contractType: string;
    networkID: number;
    contractName: string;
    tokenSymbol: string;
    totalSupply?: number;
    collectionId: string;
    deployedAt: string;
    updatedAt: string;
    contractAddress: string;
    nameSlug: any;
    deployedOn: DeployedOn;
    collection: Collection;
  }

  export interface DeployedOn {
    id: number;
    symbol: string;
    name: string;
  }
}
