import { create } from "zustand";
import { LaunchpadStoreAction, LaunchpadStoreState } from "./types";

const DEFAULT_STATE: LaunchpadStoreState = {
  round: {
    id: 0,
    name: "",
    description: "",
    projectId: "",
    roundId: 0,
    address: "0x",
    start: "",
    end: "",
    type: "U2UMintRoundFCFS",
    price: BigInt(0),
    maxPerWallet: 0,
    totalNftt: 0,
    claimableStart: "",
    claimableIds: [],
    requiredStaking: BigInt(0),
    instruction: "",
    stakeBefore: "",
  },
  isSpecial: false,
  collection: {
    id: "",
    txCreationHash: "",
    name: null,
    symbol: "",
    address: "0x",
    isU2U: false,
    description: null,
    categoryId: null,
    createdAt: "",
    updatedAt: "",
    metadata: "",
    shortUrl: null,
    status: "PENDING",
    type: "ERC721",
    creators: [
      {
        userId: "",
        user: {
          id: "",
          email: "",
          avatar: "",
          username: "",
          signature: "0x",
          signedMessage: "",
          signer: "0x",
          publicKey: "0x",
          signDate: "",
          acceptedTerms: false,
          createdAt: "",
          updatedAt: "",
          bio: "",
          coverImage: "",
          facebookLink: "",
          twitterLink: "",
          telegramLink: "",
          discordLink: "",
          webURL: "",
          shortLink: "",
          isFollowed: false,
          following: "0",
          followers: "0",
        },
      },
    ],
    coverImage: null,
    avatar: null,
    volumn: "",
    totalOwner: 0,
    totalNft: 0,
    floorPrice: "",
    isVerified: false,
  },
};

const useLaunchpadStore = create<LaunchpadStoreState & LaunchpadStoreAction>(
  (set) => ({
    ...DEFAULT_STATE,
    setRound: (round) => set(() => ({ round: round })),
    setIsSpecial: (isSpecial) => set(() => ({ isSpecial: isSpecial })),
    setCollection: (collection) => set(() => ({ collection: collection })),
  })
);

export default useLaunchpadStore;
