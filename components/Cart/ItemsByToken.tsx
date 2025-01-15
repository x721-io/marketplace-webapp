import { CartItem as TCartItem } from "@/store/app-settings/types";
import CartItem from "./CartItem";
import { useAppSettingsStore } from "@/store/app-settings/store";
import { findTokenByAddress } from "@/utils/token";
import { Accordion } from "@/components/X721UIKits/Accordion";
import Image from "next/image";
import { useMemo } from "react";
import { formatUnits } from "ethers";

type Props = {
  groupedItems: {
    items: TCartItem[];
    quoteToken: `0x${string}`;
  };
  isCollapseAll: boolean;
  type?: "cart" | "checkout";
};

const ItemsByToken: React.FC<Props> = ({
  groupedItems,
  isCollapseAll,
  type = "cart",
}) => {
  const {
    removeFromCart,
    updateCartItem,
    removeFromCheckout,
    updateCheckoutItem,
  } = useAppSettingsStore();

  const token = useMemo(
    () => findTokenByAddress(groupedItems.quoteToken),
    [groupedItems.quoteToken]
  );
  const totalPrice = useMemo(() => {
    if (!token) return 0;
    const totalPrice = groupedItems.items.reduce((acc, item) => {
      return acc + BigInt(item.marketData.sellInfo[0].price) * BigInt(item.qty);
    }, BigInt(0));
    return formatUnits(BigInt(totalPrice), token.decimal);
  }, [groupedItems.items, token]);

  return (
    <div className="w-[98%] flex-1 overflow-y-auto overflow-x-hidden py-3 px-4 rounded-2xl bg-[#F5F5F5] mb-2 shadow-sm">
      <Accordion.Root
        title=""
        className="!border-none !outline-none !pt-0 !pb-2"
        headerClassName="!pt-2 !px-0"
        contentClassName="!p-0"
        extraHeader={
          <div className="flex items-center justify-between gap-3 w-[90%]">
            <div className="flex items-center gap-3">
              <div>
                <Image
                  src={token?.logo ?? ""}
                  width={26}
                  height={26}
                  className="rounded-full"
                  alt="token-ico"
                />
              </div>
              <div>{token?.symbol ?? ""}</div>
            </div>
            <div>{groupedItems.items.length} NFTs</div>
          </div>
        }
        collapseAll={isCollapseAll}
      >
        <Accordion.Content>
          <div className="w-full flex flex-col">
            {groupedItems.items.map((item, i) => (
              <div
                className={`w-full border-solid ${
                  i < groupedItems.items.length - 1 && "border-b-[1px] pb-4"
                } pt-4`}
                key={item.nftData.collection.id + "/" + item.nftData.id}
              >
                <CartItem
                  item={item}
                  onRemove={() =>
                    type === "cart"
                      ? removeFromCart(item)
                      : removeFromCheckout(item)
                  }
                  onUpdateQty={(newQty) => {
                    if (type === "cart") {
                      updateCartItem({ ...item, qty: newQty });
                    } else {
                      updateCheckoutItem({ ...item, qty: newQty });
                    }
                  }}
                />
              </div>
            ))}
            <div className="w-full flex items-center justify-between border-solid border-t-[1px] mt-5 pt-5">
              <div className="!font-medium text-[14px]">TOTAL PRICE</div>
              <div>
                <span className="!font-semibold text-[14px] text-[#252525]">
                  {totalPrice}
                </span>{" "}
                &nbsp;
                <span className="!font-medium text-[#6A6A6A]">
                  {token?.symbol}
                </span>
              </div>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Root>
    </div>
  );
};

export default ItemsByToken;
