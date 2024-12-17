import { tokens } from "@/config/tokens";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useReadContracts,
} from "wagmi";
import Image from "next/image";
import { BigNumberish, formatUnits } from "ethers";
import { formatDisplayedNumber } from "@/utils";
import Button from "@/components/Button";
import WETH_ABI from "@/abi/WETH";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Address } from "abitype";
import { erc20Abi } from "viem";
import { useQueryClient } from "@tanstack/react-query";
import { Web3Functions } from "@/services/web3";

export default function TokenBalances() {
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [claiming, setClaiming] = useState(false);
  const { address } = useAccount();

  const { data: tokenBalances, queryKey: getTokenBalancesQK } =
    useReadContracts({
      contracts: Object.values(tokens)
        .filter((t) => t.symbol !== "U2U")
        .map((token) => {
          return {
            address: token.address,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [address as Address],
          };
        }),
      query: { enabled: !!address },
    });

  const wu2uBalance = useMemo(() => {
    if (!tokenBalances) return BigInt(0);
    return tokenBalances[0].result as bigint;
  }, [tokenBalances]);

  const { data: u2uBalance, queryKey: getU2UBalanceQK } = useBalance({
    address,
  });

  const handleClaimToken = async () => {
    try {
      setClaiming(true);
      await Web3Functions.writeContract({
        ...tokens.wu2u,
        abi: WETH_ABI,
        functionName: "withdraw",
        args: [wu2uBalance],
      });
      toast.success("Convert successfully");
    } catch (e: any) {
      toast.error(`Error report: ${e.message || e}`, {
        autoClose: 1000,
        closeButton: true,
      });
      console.error(e);
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: getTokenBalancesQK });
    queryClient.invalidateQueries({ queryKey: getU2UBalanceQK });
  }, [blockNumber, queryClient]);

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="border rounded-xl p-2">
        <div className="flex gap-2 items-center p-1">
          <Image
            src={tokens.wu2u.logo}
            alt=""
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
          />
          {formatDisplayedNumber(u2uBalance?.formatted || "0")}
          <span>U2U</span>
        </div>

        {Object.values(tokens)
          .filter((t) => t.symbol !== "U2U")
          .map((token, index) => {
            const balance = tokenBalances
              ? formatUnits(
                  tokenBalances[index].result ?? "0" as BigNumberish,
                  token.decimal
                )
              : 0;
            return (
              <div
                className="flex flex-col gap-3 p-1 justify-between "
                key={token.address}
              >
                <div className="flex gap-2 items-center">
                  <Image
                    src={token.logo}
                    alt=""
                    width={30}
                    height={30}
                    className="w-6 h-6 rounded-full"
                  />
                  <a
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Hello world!"
                  >
                    <p className="font-semibold break-all w-auto overflow-hidden whitespace-nowrap block desktop:max-w-[60px] tablet:max-w-[60px] max-w-[150px] text-ellipsis ">
                      {balance}
                    </p>
                  </a>
                  <Tooltip id="my-tooltip" />
                  <span className="text-secondary">{token.symbol}</span>
                </div>
                {token.address === tokens.wu2u.address && (
                  <Button
                    scale="sm"
                    className="text-body-12"
                    loading={claiming}
                    disabled={Number(balance) === 0}
                    onClick={handleClaimToken}
                  >
                    Convert to U2U
                  </Button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
