import Icon from "@/components/Icon";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import { daysRanges } from "@/types";
import { useState } from "react";

type DaysRange = (typeof daysRanges)[number];

export type ApplyInput =
  | {
      type: "price";
      value: number;
    }
  | {
      type: "daysRange";
      value: DaysRange;
    };

type Props = {
  appliedIndexes: number[];
  onApply: (input: ApplyInput) => void;
};

export default function ListingHeader({ onApply, appliedIndexes }: Props) {
  const [price, setPrice] = useState(0);
  const [daysRange, setDaysRange] = useState<DaysRange>("30_DAYS");

  const applyPrice = () => {
    onApply({
      type: "price",
      value: price,
    });
  };

  const applyDaysRange = () => {
    onApply({
      type: "daysRange",
      value: daysRange,
    });
  };

  return (
    <div className="w-full bg-[rgba(0,0,0,0.025)] rounded-md py-3 px-5 flex items-center gap-6 shadow-sm border-solid border-[0.5px]">
      <div className="text-heading-md !font-bold !text-[1.1rem] tracking-[0.5px] text-[rgba(0,0,0,0.6)]">
        Apply to {appliedIndexes.length}{" "}
        {appliedIndexes.length > 1 ? "items" : "item"}
      </div>
      <div className="h-[30px] bg-[rgba(0,0,0,0.25)] w-[1px]" />
      <div className="flex gap-3 items-center">
        <input
          className="border-none rounded-lg w-[125px]"
          type="number"
          value={price}
          onChange={(e) => {
            if (Number(e.target.value) < 0) return;
            setPrice(Number(e.target.value));
          }}
        />
        <button
          onClick={applyPrice}
          className="h-[40px] w-[43px] text-[1.1rem] flex items-center justify-center rounded-lg bg-[rgba(0,0,0,0.07)] hover:bg-[rgba(0,0,0,0.125)]"
        >
          ✓
        </button>
      </div>
      <div className="h-[30px] bg-[rgba(0,0,0,0.25)] w-[1px]" />
      <div className="flex gap-3 items-center">
        <Dropdown.Root
          dropdownContainerClassName="w-[150px]"
          label=""
          icon={
            <div className="w-full relative bg-white flex items-center justify-center gap-3 rounded-lg py-2 px-5 h-full cursor-pointer">
              <div className="flex-1 flex justify-between text-[0.95rem]">
                <div>{daysRange.replaceAll("_", " ").toLowerCase()}</div>
              </div>
              <div className="rounded-lg p-1">
                <Icon name="chevronDown" width={14} height={14} />
              </div>
            </div>
          }
        >
          {daysRanges.map((item) => (
            <Dropdown.Item
              key={item}
              className="w-full rounded-md"
              onClick={() => setDaysRange(item)}
            >
              <div className="w-full flex items-center gap-2">
                {item.replaceAll("_", " ").toLowerCase()}
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Root>
        <button
          onClick={applyDaysRange}
          className="h-[40px] w-[60px] text-[1.1rem] flex items-center justify-center rounded-lg bg-[rgba(0,0,0,0.07)] hover:bg-[rgba(0,0,0,0.125)]"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
