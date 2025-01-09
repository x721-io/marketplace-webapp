import Button from "@/components/Button";
import RangeInput from "@/components/X721UIKits/RangeInput";
import { NFT } from "@/types";
import { ToggleSwitch } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

type Props = {
  selectedItems?: NFT[];
  setSweepAmt?: React.Dispatch<React.SetStateAction<number>>;
  maxSweepAmt?: number;
};

const CollectionTaskbar: React.FC<Props> = ({
  selectedItems = [],
  maxSweepAmt = 0,
  setSweepAmt,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "nfts";
  const selectedQty = selectedItems.reduce(
    (prev, curr) => prev + (curr.sellInfo?.quantity ?? 0),
    0
  );

  return (
    <div className="fixed bottom-0 left-0 w-full h-[80px] bg-[white] border-solid border-t-[1px] flex items-center justify-between px-20">
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
                width={300}
                value={selectedQty}
                min={0}
                max={maxSweepAmt}
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
              <div className="py-1 px-2 rounded-xl bg-surface-soft flex items-center justify-center w-[120px]">
                <div className="w-1/2 flex items-center justify-center">
                  <input
                    type="number"
                    className="text-[16px] w-full font-medium text-[#252525] bg-transparent !outline-none border-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="w-1/2 flex items-center justify-center text-[16px] font-medium text-[#A4A4A4]">
                  U2U
                </div>
              </div>
            </div>
            <div className="flex-1 h-full flex items-center justify-end gap-4">
              <Button className="!text-[16px] font-normal text-[#FFFFFF] h-[48px] px-4">
                Sweep up to 0.64 ETH
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
  );
};

export default CollectionTaskbar;
