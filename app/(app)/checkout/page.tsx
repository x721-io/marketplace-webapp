"use client";

import useClickOutside from "@/hooks/useClickOutside";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { useAppSettingsStore } from "@/store/app-settings/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";
import { Spinner } from "flowbite-react";
import { findTokenByAddress } from "@/utils/token";
import { formatUnits } from "ethers";
import useAuthStore from "@/store/auth/store";
import { shortenAddress } from "@/utils/string";
import ItemsByToken from "@/components/Cart/ItemsByToken";

type Props = {};

const Checkout: React.FC<Props> = () => {
  const { profile } = useAuthStore();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const cartRef = useRef<any>(null);
  const { checkoutItems, setCheckoutItems } = useAppSettingsStore();
  const [invalidOrders, setInvalidOrders] = useState<
    { sig: string; index: number }[]
  >([]);
  const { buyBulk, getMultiOrdersDetails } = useMarketplaceV2();

  const groupedItemsByToken = useMemo(() => {
    const quoteTokens = Array.from(
      new Set(
        checkoutItems.map((item) => item.marketData.sellInfo[0].quoteToken)
      )
    );
    return quoteTokens.map((quoteToken) => {
      return {
        items: checkoutItems.filter(
          (item) =>
            item.marketData.sellInfo[0].quoteToken.toLowerCase() ===
            quoteToken.toLowerCase()
        ),
        quoteToken,
      };
    });
  }, [checkoutItems]);

  const buyAll = async () => {
    try {
      setLoading(true);
      setInvalidOrders([]);
      const verifyInputs = checkoutItems.map((item) => {
        return {
          sig: item.marketData.sellInfo[0].sig,
          index: item.marketData.sellInfo[0].index,
        };
      });
      const ordersDetails = await getMultiOrdersDetails(verifyInputs);
      if (!ordersDetails) return;
      const invalidOrders = ordersDetails.filter((order) => !order.isSuccess);
      if (invalidOrders.length > 0) {
        setInvalidOrders(invalidOrders);
        return;
      }
      await buyBulk(
        ordersDetails.map((order, index) => {
          return {
            ...order,
            qty: checkoutItems[index].qty,
          };
        })
      );
      setCheckoutItems([]);
      toast.success("Successfully bought all items");
    } catch (err) {
      toast.error("Error report: Buy failed. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    await buyAll();
  };

  return (
    <div className="w-[94%] mx-auto flex flex-col mt-14">
      <div className="w-full px-6 text-[32px] font-semibold pb-5">Checkout</div>
      <div className="flex flex-row bg-white p-6 gap-6">
        <div className="w-1/2 flex-1 overflow-y-auto overflow-x-hidden mb-5">
          {groupedItemsByToken.map((groupedItems) => (
            <ItemsByToken
              key={groupedItems.quoteToken}
              groupedItems={groupedItems}
              isCollapseAll={false}
              type="checkout"
            />
          ))}
        </div>
        <div
          className={`w-1/2 bg-surface-soft rounded-2xl p-5 mb-4 flex flex-col gap-5 justify-between items-center`}
        >
          {checkoutItems.length > 0 && (
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex items-start justify-between">
                <div className="!font-semibold text-[#252525] text-[16px]">
                  Address
                </div>
                <div className="flex flex-col items-end gap-2 !font-semibold text-[#252525] text-[16px]">
                  {shortenAddress(profile?.publicKey)}
                </div>
              </div>
              <div className="w-full flex items-start justify-between">
                <div className="!font-semibold text-[#252525] text-[16px]">
                  Total price
                </div>
                <div className="flex flex-col items-end gap-2">
                  {groupedItemsByToken.map((groupedItems) => {
                    return (
                      <div
                        key={groupedItems.quoteToken}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="!font-semibold text-[#252525] text-[16px]">
                          {formatUnits(
                            groupedItems.items.reduce(
                              (acc, item) =>
                                acc +
                                BigInt(item.marketData.sellInfo[0].price) *
                                  BigInt(item.qty),
                              BigInt(0)
                            ),
                            findTokenByAddress(
                              groupedItems.quoteToken.toLowerCase() as any
                            )?.decimal ?? 18
                          ).toString()}
                        </div>
                        <div className="!font-medium text-[#6A6A6A] text-[16px]">
                          {
                            findTokenByAddress(
                              groupedItems.quoteToken.toLowerCase() as any
                            )?.symbol
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {checkoutItems.length > 0 && (
            <button
              disabled={isLoading}
              onClick={submit}
              className="w-full bg-black h-[50px] text-white !font-bold text-[1.1rem] rounded-2xl disabled:opacity-50"
            >
              {!isLoading ? "Pay now" : <Spinner />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
