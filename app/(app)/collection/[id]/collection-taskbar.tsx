import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import RangeInput from "@/components/X721UIKits/RangeInput";
import { ADDRESS_ZERO } from "@/config/constants";
import { tokenOptions } from "@/config/tokens";
import { NFT } from "@/types";
import { findTokenByAddress } from "@/utils/token";
import { formatUnits } from "ethers";
import { ToggleSwitch } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

type Props = {
  selectedItems?: NFT[];
  setSweepAmt?: React.Dispatch<React.SetStateAction<number>>;
  maxSweepAmt?: number;
  quoteToken?: string;
  onChangeQuoteToken?: (value: string) => void;
  priceMax?: string | null;
  onChangePriceMax?: (value: string) => void;
  onSweep?: () => void;
};

const CollectionTaskbar: React.FC<Props> = ({
  selectedItems = [],
  maxSweepAmt = 0,
  setSweepAmt,
  quoteToken,
  onChangeQuoteToken,
  priceMax = 0,
  onChangePriceMax,
  onSweep,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "nfts";
  const selectedQty = selectedItems.reduce(
    (prev, curr) => prev + (curr.sellInfo?.quantity ?? 0),
    0
  );

  const totalSweepPrice = useMemo(() => {
    // if (!filters.quoteToken) return 0;
    if (selectedItems.length === 0) return 0;
    const totalPrice = selectedItems.reduce(
      (acc, item) => acc + BigInt(item?.sellInfo?.price ?? 0),
      BigInt(0)
    );
    const token = findTokenByAddress(ADDRESS_ZERO.toLowerCase() as any);
    return formatUnits(BigInt(totalPrice), token?.decimal ?? 18);
  }, [selectedItems]);

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full h-[80px] bg-[white] border-solid border-t-[1px] flex items-center justify-between desktop:px-20 px-5">
        <div className="flex items-center gap-8 h-full w-full">
          <div className="font-semibold text-[18px] text-[#252525]">
            Order Sweep
          </div>
          <div>
            <ToggleSwitch
              color="purple"
              checked={view === "orders"}
              onChange={() => {
                if (view === "orders") {
                  router.push(pathName + "?view=nfts");
                  return;
                }
                router.push(pathName + "?view=orders");
              }}
            />
          </div>
          {view === "orders" && (
            <div className="flex-1 h-full flex items-center gap-8">
              <div className="flex items-center justify-center rounded-xl bg-surface-soft h-[48px] pl-4 gap-4">
                <RangeInput
                  width={"300px"}
                  value={maxSweepAmt > 0 ? selectedQty : 1}
                  min={0}
                  max={maxSweepAmt > 0 ? maxSweepAmt : 1}
                  onChange={(value) => {
                    setSweepAmt?.(value);
                  }}
                />
                <div className="h-[48px] w-[48px] border-solid border-[#E3E3E3] border-l-[1px] flex items-center justify-center text-[16px] !font-medium text-[#252525]">
                  {selectedQty}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-[16px] font-normal text-[#6A6A6A]">
                  Max price per items
                </div>
                <div className="py-1 px-2 rounded-xl bg-surface-soft flex items-center justify-center w-[200px]">
                  <div className="flex-1 flex items-center justify-center">
                    <input
                      type="text"
                      value={priceMax?.toString()}
                      onChange={(e) => onChangePriceMax?.(e.target.value)}
                      className="text-[16px] w-full font-medium text-[#252525] bg-transparent !outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="w-[100px] flex items-center justify-center text-[16px] font-medium text-[#A4A4A4]">
                    {quoteToken && (
                      <select
                        onChange={(e) => onChangeQuoteToken?.(e.target.value)}
                        value={quoteToken}
                        className="text-[#A4A4A4] w-auto text-[16px] outline-none !border-none bg-transparent"
                      >
                        {tokenOptions.map((token) => (
                          <option key={token.value} value={token.value}>
                            {token.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 h-full flex items-center justify-end gap-4">
                <Button
                  onClick={onSweep}
                  className="!text-[16px] font-normal text-[#FFFFFF] h-[48px] px-4"
                >
                  Sweep up to {totalSweepPrice}{" "}
                  {
                    tokenOptions.find((token) => token.value === quoteToken)
                      ?.label
                  }
                </Button>
                <Button
                  variant="secondary"
                  className="!text-[16px] font-normal text-[#FFFFFF] h-[48px] px-4"
                >
                  Make collection offer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {view === "orders" && (
        <div
          style={{
            boxShadow: "-1px -11px 28px -3px rgba(0,0,0,0.3)",
          }}
          className="fixed flex flex-col desktop:hidden bottom-0 rounded-2xl py-2 left-0 w-full bg-[white] border-solid border-t-[1px] items-center gap-6"
        >
          <div className="w-full border-solid border-b-[1px] px-5 flex items-center justify-between pb-2 font-semibold text-[20px]">
            Order Sweep
            <button
              className="flex items-center justify-center w-[48px] h-[48px] rounded-[10px] bg-surface-soft"
              onClick={() => {
                router.push(pathName + "?view=nfts");
              }}
            >
              <Icon name="close" width={20} />
            </button>
          </div>
          <div className="w-[90%] flex items-center justify-center rounded-xl bg-surface-soft h-[48px] px-5 gap-4">
            <RangeInput
              width={"100%"}
              value={maxSweepAmt > 0 ? selectedQty : 1}
              min={0}
              max={maxSweepAmt > 0 ? maxSweepAmt : 1}
              onChange={(value) => {
                setSweepAmt?.(value);
              }}
            />
            <div className="h-[48px] w-[48px] border-solid border-[#E3E3E3] border-l-[1px] flex items-center justify-center text-[16px] !font-medium text-[#252525]">
              {selectedQty}
            </div>
          </div>
          <div className="w-full flex items-center px-5">
            <div className="flex-1 text-[16px] font-normal text-[#6A6A6A]">
              Max price per items
            </div>
            <div className="py-1 px-2 rounded-xl bg-surface-soft flex items-center justify-center w-[55%]">
              <div className="flex-1 flex items-center justify-center">
                <input
                  type="text"
                  value={priceMax?.toString()}
                  onChange={(e) => onChangePriceMax?.(e.target.value)}
                  className="text-[16px] w-full font-medium text-[#252525] bg-transparent !outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="w-[100px] flex items-center justify-center text-[16px] font-medium text-[#A4A4A4]">
                {quoteToken && (
                  <select
                    onChange={(e) => onChangeQuoteToken?.(e.target.value)}
                    value={quoteToken}
                    className="text-[#A4A4A4] w-full text-[16px] outline-none !border-none bg-transparent"
                  >
                    {tokenOptions.map((token) => (
                      <option key={token.value} value={token.value}>
                        {token.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-end gap-4 px-5">
            <Button
              onClick={onSweep}
              className="!text-[16px] font-normal text-[#FFFFFF] h-[48px] px-4 !w-full"
            >
              Sweep up to {totalSweepPrice}{" "}
              {tokenOptions.find((token) => token.value === quoteToken)?.label}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionTaskbar;
