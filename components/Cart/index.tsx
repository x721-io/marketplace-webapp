import { tokenOptions } from "@/config/tokens";
import useClickOutside from "@/hooks/useClickOutside";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { useAppSettingsStore } from "@/store/app-settings/store";
import { OrderDetails } from "@/types";
import { convertImageUrl } from "@/utils/nft";
import { formatEther, formatUnits } from "ethers";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Icon from "../Icon";

type Props = {};

const Cart: React.FC<Props> = () => {
  const [isLoading, setLoading] = useState(false);
  const cartRef = useRef<any>(null);
  const { cart, removeFromCart, toggleCart, setCartItems } =
    useAppSettingsStore();
  const [invalidOrders, setInvalidOrders] = useState<
    { sig: string; index: number }[]
  >([]);
  const { buyBulk, getOrderDetails, getMultiOrdersDetails } =
    useMarketplaceV2();
  useClickOutside(cartRef, () => {
    toggleCart(false);
  });

  const totalPriceByQuoteTokens = useMemo(() => {
    const quoteTokens = Array.from(
      new Set(cart.items.map((item) => item.marketData.sellInfo[0].quoteToken))
    );
    return quoteTokens.map((quoteToken) => {
      const totalPrice = cart.items
        .filter((item) => item.marketData.sellInfo[0].quoteToken === quoteToken)
        .reduce((total, item) => {
          return total + Number(item.marketData.sellInfo[0].price);
        }, 0);

      return {
        totalPrice,
        address: quoteToken,
        name:
          tokenOptions.find(
            (token) => token.value.toLowerCase() === quoteToken.toLowerCase()
          )?.label || "",
        decimal:
          tokenOptions.find(
            (token) => token.value.toLowerCase() === quoteToken.toLowerCase()
          )?.decimal || 18,
      };
    });
  }, [cart.items]);

  const buyAll = async () => {
    try {
      setLoading(true);
      setInvalidOrders([]);
      const verifyInput = cart.items.map((item) => {
        return {
          sig: item.marketData.sellInfo[0].sig,
          index: item.marketData.sellInfo[0].index,
        };
      });
      const ordersDetails = await getMultiOrdersDetails(verifyInput);
      if (!ordersDetails) return;
      const invalidOrders = ordersDetails.filter((order) => !order.isSuccess);
      if (invalidOrders.length > 0) {
        setInvalidOrders(invalidOrders);
        return;
      }
      await buyBulk(ordersDetails);
      setCartItems([]);
      toast.success("Successfully bought all items");
    } catch (err) {
      toast.error("Error report: Buy failed. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.isOpen) {
    return null;
  }

  return (
    <div
      ref={cartRef}
      className="flex flex-col fixed right-5 top-[50%] -translate-y-[50%] h-[750px] w-[400px] bg-white z-[100] rounded-lg shadow-2xl border-solid border-[1px] px-5 pb-5 pt-4"
    >
      <div className="flex items-center !font-bold text-[1.5rem] tracking-[0.5px]">
        Cart ({cart.items.length})
      </div>
      <div className="w-full flex-1 overflow-y-auto pt-5">
        {cart.items.map((item) => (
          <div
            key={item.nftData.collection.id + "/" + item.nftData.id}
            className="relative group w-full flex items-center mb-5 gap-5 cursor-pointer"
          >
            <Image
              src={convertImageUrl(item.nftData.image)}
              alt={`${item.nftData.name}-image`}
              width={60}
              height={60}
              className="rounded-md bg-white shadow-md"
            />
            <div className="flex-1 flex flex-col items-start justify-center">
              <div className="font-bold text-[1.1rem] tracking-[0.5px]">
                {item.nftData.name}
              </div>
              <div className="font-bold text-[0.95rem] text-gray-700 tracking-[0.5px]">
                {item.nftData.collection.name}
              </div>
              {invalidOrders.find(
                (order) =>
                  order.sig === item.marketData.sellInfo[0].sig &&
                  order.index === item.marketData.sellInfo[0].index
              ) && (
                <div className="text-red-500 text-[0.9rem] !text-bold pr-10">
                  This item has been already bought. Please remove it from your
                  cart.
                </div>
              )}
              <button
                onClick={() => removeFromCart(item)}
                className="absolute right-0 top-[50%] -translate-y-[50%] bg-[black] rounded-full"
              >
                <Icon name="plus" className="rotate-45" color="white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full items-start justify-start pb-2">
        Total price:{" "}
        {totalPriceByQuoteTokens.length > 0 &&
          totalPriceByQuoteTokens.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="text-[1.1rem] font-bold">
                {formatUnits(BigInt(item.totalPrice), item.decimal)}
              </div>
              <div className="text-[0.9rem] font-bold">{item.name}</div>
            </div>
          ))}
      </div>
      <button
        disabled={isLoading}
        onClick={buyAll}
        className="w-full bg-black h-[50px] text-white !font-bold text-[1.1rem] rounded-2xl disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Buy All"}
      </button>
    </div>
  );
};

export default Cart;
