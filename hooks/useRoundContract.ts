import { AssetType, Collection, Round } from "@/types";
import { waitForTransaction, writeContract } from "wagmi/actions";
import { getRoundAbi } from "@/utils";
import { formatUnits } from "ethers";
import { contracts } from "@/config/contracts";

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
      const tx = await writeContract({
        address: round.address,
        abi: roundAbi,
        functionName,
        args,
        value: price,
        gas: BigInt(500000),
      });

      return {
        hash: tx.hash,
        waitForTransaction: () => waitForTransaction({ hash: tx.hash }),
      };
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
      const tx = await writeContract({
        address: round.address,
        abi: roundAbi,
        functionName,
        args,
        value: price,
        gas: BigInt(500000),
      });

      return {
        hash: tx.hash,
        waitForTransaction: () => waitForTransaction({ hash: tx.hash }),
      };
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
    const tx = await writeContract({
      address: round.address,
      abi: roundAbi,
      functionName,
      args: [],
      value: BigInt(0) as any,
    });

    return {
      hash: tx.hash,
      waitForTransaction: () => waitForTransaction({ hash: tx.hash }),
    };
  };

  const onClaimMemetaverse = async () => {
    try {
      const tx = await writeContract({
        address: round.address,
        abi: contracts.memeTaVerseContract.abi,
        functionName: "claim",
        args: [] as any,
      });

      return {
        hash: tx.hash,
        waitForTransaction: () => waitForTransaction({ hash: tx.hash }),
      };
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
