export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME as string;
export const BLOCK_EXPLORER_URL = process.env
  .NEXT_PUBLIC_BLOCK_EXPLORER_URL as string;
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
export const MARKETPLACE_URL = process.env
  .NEXT_PUBLIC_MARKETPLACE_URL as string;
export const ZERO_COLLECTION = process.env.NEXT_PUBLIC_REQUIRED_COLLECTION;
export const SPECIAL_ROUND = process.env.NEXT_PUBLIC_SPECIAL_ROUND_CONTRACT;
export const CAMPAIGN_URL = "https://voyage.u2nft.io/";
export const LAUNCHPAD_APPLY_URL = "https://forms.gle/SAYoVizSwm16XV7d8";
export const NFT_COLLECTION_VERIFICATION_REQUEST =
  "https://forms.gle/ZH9ippAzReyztyoD9";

export const SIGN_MESSAGE = {
  CONNECT: (time: string) =>
    `I want to login on x721.io at ${time}. I accept the U2U Terms of Service https://u2u.xyz and I am at least 13 years old.`,
};

export const FINGERPRINT =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const ALLOWED_IMAGE_TYPES = ".png,.jpeg, .png, .gif, .webp";
export const ALLOWED_AUDIO_TYPES = ".mp3, .mpeg";
export const ALLOWED_VIDEO_TYPES = ".mp4, .webm";
export const ALLOWED_FILE_TYPES = [
  ALLOWED_IMAGE_TYPES,
  ALLOWED_AUDIO_TYPES,
  ALLOWED_VIDEO_TYPES,
].join(", ");

export const MAX_ROYALTIES = 2000; // 20%

//this mode for get count total number
export const MODE_OWNED = "owner";
export const MODE_CREATED = "creator";
export const MODE_ON_SALES = "onsales";
export const MODE_COLLECTIONS = "collection";

export const ALLOWED_DOMAIN_URL =
  "https://ipfs.io/ipfs/,testnet-api.memetaverse.club,u2u-images.s3.ap-southeast-1.amazonaws.com,copper-defensive-cod-42.mypinata.cloud,ug-assets-dev.s3.ap-southeast-1.amazonaws.com,https://testnet-peer.memetaverse.club/,https://apricot-worried-junglefowl-562.mypinata.cloud/,https://indigo-accessible-raccoon-107.mypinata.cloud/ipfs/";
