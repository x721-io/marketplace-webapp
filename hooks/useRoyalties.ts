import { contracts } from "@/config/contracts";
import { useReadContract } from "wagmi";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { NFT, Royalties } from "@/types";
import { toast } from "react-toastify";
import { Address } from "abitype";
import { Web3Functions } from "@/services/web3";

export const useReadCollectionRoyalties = (collectionAddress: Address) => {
  const royaltiesRegistryContract = contracts.royaltiesRegistry;

  return useReadContract({
    ...royaltiesRegistryContract,
    functionName: "getRoyaltiesByToken",
    args: [collectionAddress],
    query: {
      enabled: !!collectionAddress,
      select: ([_, royalties]) => royalties,
    },
  });
};

export const useUpdateCollectionRoyalties = () => {
  const royaltiesRegistryContract = contracts.royaltiesRegistry;

  return async (collectionAddress: Address, royalties: Royalties) => {
    if (!royalties || !collectionAddress) {
      return toast.error("Collection not found", {
        autoClose: 1000,
        closeButton: true,
      });
    }

    return await Web3Functions.writeContract({
      ...royaltiesRegistryContract,
      functionName: "setRoyaltiesByToken",
      args: [collectionAddress, royalties],
      value: BigInt(0) as any,
    });
  };
};

export const useReadNFTRoyalties = (nft: NFT) => {
  const royaltiesRegistryContract = contracts.royaltiesRegistry;

  return useReadContract({
    ...royaltiesRegistryContract,
    functionName: "getRoyalties",
    args: [nft.collection.address, (nft.u2uId || nft.id) as any],
    query: {
      enabled: !!nft,
    },
  });
};
