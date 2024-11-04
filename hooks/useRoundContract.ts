import { AssetType, Collection, Round } from "@/types";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { getRoundAbi } from "@/utils";
import { formatUnits } from "ethers";
import { contracts } from "@/config/contracts";
import { Web3Functions } from "@/services/web3";

type BuyFunctionName = `buy${AssetType}`;
type ClaimFunctionName = `claim${AssetType}`;

const getBuyFunctionName = (assetType: AssetType): BuyFunctionName => {
  return <"buyERC721" | "buyERC1155">`buy${assetType}`;
};

const getClaimFunctionName = (assetType: AssetType): ClaimFunctionName => {
  return <"claimERC721" | "claimERC1155">`claim${assetType}`;
};

export const useWriteRoundContract = (round: Round, collection: Collection) => {
  const roundAbi = getRoundAbi(round);

  const onBuyNFT = async (amount?: number) => {
    const functionName = getBuyFunctionName(collection.type);
    const args = functionName === "buyERC1155" ? [amount] : [];
    const price =
      functionName === "buyERC1155"
        ? BigInt(round.price) * BigInt(amount || 0)
        : BigInt(round.price);

    try {
      const receipt = await Web3Functions.writeContract({
        address: round.address,
        abi: roundAbi,
        functionName,
        args,
        value: price,
      });

      return receipt.transactionHash;
    } catch (e: any) {
      if (e.message.includes("rejected")) {
        throw new Error(`user rejected the transaction`, {
          cause: e,
        });
      } else {
        throw new Error(`unexpected error. Try again later`, {
          cause: e,
        });
      }
    }
  };

  const onBuyNFTCustomized = async () => {
    const functionName = getBuyFunctionName(collection.type);
    const args: any[] = [];
    const price = BigInt(round.price);

    try {
      const hash = await Web3Functions.writeContract({
        address: round.address,
        abi: roundAbi,
        functionName,
        args,
        value: price,
      });

      return hash.transactionHash;
    } catch (e: any) {
      if (e.message.includes("rejected")) {
        throw new Error(`user rejected the transaction`, {
          cause: e,
        });
      } else {
        throw new Error(`unexpected error. Try again later`, {
          cause: e,
        });
      }
    }
  };

  const onClaimNFT = async () => {
    const functionName = getClaimFunctionName(collection.type);
    const receipt = await Web3Functions.writeContract({
      address: round.address,
      abi: roundAbi,
      functionName,
      args: [],
      value: BigInt(0) as any,
    });

    return receipt.transactionHash;
  };

  const onClaimMemetaverse = async () => {
    try {
      const receipt = await Web3Functions.writeContract({
        address: round.address,
        abi: contracts.memeTaVerseContract.abi,
        functionName: "claim",
        args: [] as any,
      });

      return receipt.transactionHash;
    } catch (error) {
      console.error("Error in onClaimMemetaverse:", error);
    }
  };

  return {
    onClaimNFT,
    onBuyNFT,
    onBuyNFTCustomized,
    onClaimMemetaverse,
  };
};
