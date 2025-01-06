import { tokenOptions } from "@/config/tokens";
import { CartItem as TCartItem } from "@/store/app-settings/types";
import { convertImageUrl } from "@/utils/nft";
import { findTokenByAddress } from "@/utils/token";
import { formatUnits } from "ethers";
import Image from "next/image";
import { useMemo, useState } from "react";
import Icon from "../Icon";
import TrashIcon from "@/assets/svg/trash-icon";
import Link from "next/link";
import { useAppSettingsStore } from "@/store/app-settings/store";

type Props = {
  item: TCartItem;
  onUpdateQty: (newQty: number) => void;
  onRemove: () => void;
};

const CartItem: React.FC<Props> = ({ item, onUpdateQty, onRemove }) => {
  const { toggleCart } = useAppSettingsStore();
  const token = useMemo(
    () => findTokenByAddress(item.marketData.sellInfo[0].quoteToken),
    [item.marketData.sellInfo]
  );

  return (
    <div className="w-full flex py-3 pr-3 gap-4">
      <Image
        src={convertImageUrl(item.nftData.image)}
        alt={`${item.nftData.name}-image`}
        width={56}
        height={56}
        className="bg-white shadow-md w-[56px] h-[56px] rounded-xl"
      />
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link
            onClick={() => toggleCart(false)}
            href={`/item/${item.nftData.collection.address}/${item.nftData.id}`}
            className="!font-semibold text-[16px] tracking-[0.5px] cursor-pointer hover:underline"
          >
            {item.nftData.name}
          </Link>
          <button onClick={onRemove}>
            <TrashIcon width={20} height={20} />
          </button>
        </div>
        {item.nftData.collection.type === "ERC1155" && (
          <div className="flex items-center justify-between">
            <div className="!font-normal text-[14px] tracking-[0.5px] text-[#6A6A6A]">
              Amount
            </div>
            <div className="flex justify-end items-center border-solid border-[1px] px-3 py-2 rounded-[8px] bg-[white]">
              <button
                onClick={() => {
                  if (item.qty === 1) {
                    return;
                  }
                  onUpdateQty(item.qty - 1);
                }}
              >
                <Icon name="minus" width={16} height={16} />
              </button>
              <div className="w-[42px] flex items-center justify-center text-[14px] !font-semibold">
                {item.qty}
              </div>
              <button
                onClick={() => {
                  if (item.qty === item.marketData.sellInfo[0].quantity) {
                    return;
                  }
                  onUpdateQty(item.qty + 1);
                }}
              >
                <Icon name="plus" width={16} height={16} />
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="!font-normal text-[14px] tracking-[0.5px] text-[#6A6A6A]">
            NFT Type
          </div>
          <div className="!font-semibold text-[14px] tracking-[0.5px]">
            {item.nftData.collection.type}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="!font-normal text-[14px] tracking-[0.5px] text-[#6A6A6A]">
            Price
          </div>
          <div className="!font-semibold text-[14px] tracking-[0.5px]">
            {formatUnits(
              BigInt(item.marketData.sellInfo[0].price) * BigInt(item.qty),
              token?.decimal ?? 18
            ).toString()}{" "}
            <span className="!font-medium">{token?.symbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
