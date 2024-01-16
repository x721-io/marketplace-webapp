import {Address} from "wagmi";
import {BigNumberish} from "ethers/lib.esm";
import {RoundType} from "@/types/launchpad";

export interface Round {
  id: number,
  name: string,
  description: string
  projectId: string,
  roundId: number,
  address: Address,
  start: string,
  end: string,
  type: RoundType
  price: BigNumberish
  maxPerWallet: number
  totalNftt: number
  claimableStart: string
  claimableIds: any[],
  requiredStaking: BigNumberish,
  instruction: string,
  stakeBefore: string,
}