import { contracts } from "@/config/contracts";
import useAuthStore from "@/store/auth/store";
import { NFT } from "@/types";
import { useMemo } from "react";
import { tokens } from "@/config/tokens";
import { Web3Functions } from "@/services/web3";
import { useReadContract } from "wagmi";
import { Address } from "abitype";
import { useQueryClient } from "@tanstack/react-query";

export const useMarketApproveNFT = (nft: NFT) => {
  const queryClient = useQueryClient();
  const type = nft.collection.type;
  const marketContract =
    type === "ERC721" ? contracts.erc721Market : contracts.erc1155Market;
  const wallet = useAuthStore((state) => state.profile?.publicKey);

  const {
    data: isMarketContractApprovedForAll,
    queryKey: isApproveAllQueryKey,
  } = useReadContract({
    address: nft.collection.address,
    abi: (type === "ERC721"
      ? contracts.erc721Base.abi
      : contracts.erc1155Base.abi) as any,
    functionName: "isApprovedForAll",
    args: [wallet as Address, marketContract.address],
    scopeKey: "isMarketContractApprovedForAll",
    query: { enabled: !!wallet },
  });

  const {
    data: isMarketContractApprovedForSingle,
    queryKey: isApproveSingleQueryKey,
  } = useReadContract({
    address: nft.collection.address,
    abi: contracts.erc721Base.abi,
    functionName: "getApproved",
    args: [(nft.u2uId || nft.id) as any],
    scopeKey: "isMarketContractApprovedForSingle",
    query: {
      enabled: type === "ERC721",
      select: (data) => {
        return data !== "0x0000000000000000000000000000000000000000";
      },
    },
  });

  const isMarketContractApprovedToken = useMemo(() => {
    if (nft.collection.address === tokens.wu2u.address) return true;
    if (
      type === "ERC721" &&
      (isMarketContractApprovedForAll || isMarketContractApprovedForSingle)
    )
      return true;
    if (type !== "ERC721" && isMarketContractApprovedForAll) return true;
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isMarketContractApprovedForAll,
    isMarketContractApprovedForSingle,
    nft.collection.address,
    tokens.wu2u.address,
  ]);

  const onApproveTokenForAll = async () => {
    try {
      const response = await Web3Functions.writeContract({
        address: nft.collection.address,
        abi: (type === "ERC721"
          ? contracts.erc721Base.abi
          : contracts.erc1155Base.abi) as any,
        functionName: "setApprovalForAll",
        args: [marketContract.address, true],
        value: BigInt(0) as any,
      });
      queryClient.invalidateQueries({ queryKey: isApproveAllQueryKey });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };

  const onApprovalTokenForSingle = async () => {
    try {
      const response = await Web3Functions.writeContract({
        address: nft.collection.address,
        abi: contracts.erc721Base.abi,
        functionName: "approve",
        args: [contracts.erc721Market.address, BigInt(nft.u2uId ?? nft.id)],
        value: BigInt(0) as any,
      });
      queryClient.invalidateQueries({ queryKey: isApproveSingleQueryKey });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    isMarketContractApprovedForAll,
    onApproveTokenForAll,
    onApprovalTokenForSingle,
    isMarketContractApprovedForSingle,
    isMarketContractApprovedToken,
  };
};
