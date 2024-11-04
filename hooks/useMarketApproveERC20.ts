import { useMemo } from "react";
import { contracts } from "@/config/contracts";
import useAuthStore from "@/store/auth/store";
import { AssetType } from "@/types";
import { tokens } from "@/config/tokens";
import { isAddress } from "ethers";
import { Web3Functions } from "@/services/web3";
import { Address } from "abitype";
import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";

export const useMarketApproveERC20 = (
  token: Address,
  type: AssetType,
  totalCost: bigint
) => {
  const wallet = useAuthStore((state) => state.profile?.publicKey);
  const marketContract =
    type === "ERC721" ? contracts.erc721Market : contracts.erc1155Market;

  const { data: allowance, isLoading: isFetchingApproval } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [wallet as Address, marketContract.address],
    query: { enabled: !!isAddress },
  });

  const isTokenApproved = useMemo(() => {
    if (token === tokens.wu2u.address) return true;
    if (!allowance) return false;
    return allowance >= totalCost;
  }, [allowance, token, totalCost]);

  const onApproveToken = async (allowance: bigint) => {
    try {
      const response = await Web3Functions.writeContract({
        abi: erc20Abi,
        address: token,
        functionName: "approve",
        args: [marketContract.address, allowance],
      });
      return response.transactionHash;
    } catch (err: any) {
      throw err;
    }
  };
  return {
    isTokenApproved,
    onApproveToken,
    isFetchingApproval,
    allowance,
  };
};
