import { tokens } from "@/config/tokens";
import {
  Address,
  erc20ABI,
  useAccount,
  useBalance,
  useContractReads,
  useContractWrite,
} from "wagmi";
import Image from "next/image";
import { BigNumberish, formatUnits } from "ethers";
import { formatDisplayedNumber } from "@/utils";
import Button from "@/components/Button";
import WETH_ABI from "@/abi/WETH";
import { useMemo, useState } from "react";
import { waitForTransaction } from "wagmi/actions";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ADDRESS_ZERO } from "@/config/constants";

export default function TokenBalances() {
  const [claiming, setClaiming] = useState(false);
  const { address } = useAccount();

  const { data: tokenBalances } = useContractReads({
    contracts: Object.values(tokens)
      .filter((token) => token.address !== ADDRESS_ZERO)
      .map((token) => {
        return {
          address: token.address,
          abi: erc20ABI,
          functionName: "balanceOf",
          args: [address as Address],
        };
      }),
    enabled: !!address,
    watch: true,
  });

  const wu2uBalance = useMemo(() => {
    if (!tokenBalances) return BigInt(0);
    return tokenBalances[0].result as bigint;
  }, [tokenBalances]);

  const { data: u2uBalance } = useBalance({
    address,
    formatUnits: "ether",
    watch: true,
  });

  const { writeAsync } = useContractWrite({
    ...tokens.wu2u,
    abi: WETH_ABI,
    functionName: "withdraw",
  });

  const handleClaimToken = async () => {
    try {
      setClaiming(true);
      const { hash } = await writeAsync({ args: [wu2uBalance] });
      await waitForTransaction({ hash });
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
          .filter((token) => token.address !== ADDRESS_ZERO)
          .map((token, index) => {
            const balance = tokenBalances
              ? formatUnits(
                  tokenBalances[index].result as BigNumberish,
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
