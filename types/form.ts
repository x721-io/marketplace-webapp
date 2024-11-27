import { Address } from "abitype";
import { NFT, Trait } from "@/types/entitites";

export const daysRanges = ["1_DAY", "7_DAYS", "30_DAYS", "90_DAYS"] as const;
export namespace FormState {
  export interface SignUp {
    username: string;
    email: string;
  }

  export interface UpdateProfile {
    bio: string;
    username: string;
    shortLink: string;
    twitterLink: string;
    webURL: string;
    facebookLink: string;
    telegram: string;
    discord: string;
  }

  export interface CreateCollection {
    avatar: string;
    name: string;
    symbol: string;
    description: string;
    shortUrl: string;
  }

  export interface CreateNFT {
    media: Blob[];
    name: string;
    description: string;
    collection: Address;
    royalties: number;
    amount: number;
    traits: Trait[];
  }

  export interface SellNFT {
    price: number;
    quantity: number;
    quoteToken: Address;
  }

  export interface BuyNFT {
    quantity: string;
    quoteToken: Address;
    allowance: string;
    price: string;
  }

  export interface BidNFT {
    quoteToken: Address;
    price: string;
    quantity: string;
    allowance: string;
  }

  export interface AcceptBidNFT {
    quantity: number;
    price: number;
    quoteToken: Address;
  }

  export interface TransferToken {
    quantity: number;
    recipient: Address;
  }

  export interface VerifyAccount {
    accountStatus: boolean;
    listVerify: ListVerify;
  }

  export interface ListVerify {
    email: boolean;
    username: boolean;
    shortLink: boolean;
    avatar: boolean;
    bio: boolean;
    twitterLink: boolean;
    ownerOrCreater: boolean;
  }

  export type DaysRange = (typeof daysRanges)[number];

  export interface SellNFTV2 {
    price: number;
    quantity: number;
    quoteToken: Address;
    start: number;
    salt: string;
    end: number;
    daysRange: DaysRange;
    netPrice: number;
    totalPrice: number;
    nft?: NFT;
    proof?: string[];
    root?: string;
    sig?: string;
  }

  export interface BidNFTV2 {
    quoteToken: Address;
    price: string;
    quantity: string;
    start: number;
    salt: string;
    end: number;
    daysRange: DaysRange;
    netPrice: number;
    totalPrice: number;
  }
}
