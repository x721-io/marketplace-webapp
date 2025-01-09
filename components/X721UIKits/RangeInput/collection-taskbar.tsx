import { NFT } from "@/types";
import { ToggleSwitch } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import "./slider.css";

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
  const sliderRef = useRef<HTMLInputElement>(null);
  const view = searchParams.get("view") ?? "nfts";
  const selectedQty = selectedItems.reduce(
    (prev, curr) => prev + (curr.sellInfo?.quantity ?? 0),
    0
  );

  useEffect(() => {
    const activeColor = "#040404";
    const inactiveColor = "#e3e3e3";
    if (!sliderRef.current) return;
    const ratio = ((selectedQty - 0) / (maxSweepAmt - 0)) * 100;
    sliderRef.current.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
    if (ratio < 100) {
      sliderRef.current.style.borderRadius = "0px";
    } else {
      sliderRef.current.style.borderRadius = "0px 10px 10px 0px";
    }
  }, [maxSweepAmt, selectedQty]);

  return (
    <div className="fixed bottom-0 left-0 w-full h-[70px] bg-[white] border-solid border-t-[1px] flex items-center justify-between px-20">
      <div className="flex items-center gap-4 h-full">
        <h1 className="font-semibold text-[18px] text-[#252525]">
          Order Sweep ({selectedQty} / {maxSweepAmt})
        </h1>
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
        <div>
          <input
            ref={sliderRef}
            name="range"
            className="inputRange"
            type="range"
            value={selectedQty}
            min={0}
            max={maxSweepAmt}
            step={1}
            onChange={(e) => {
              setSweepAmt?.(Number(e.target.value));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionTaskbar;
