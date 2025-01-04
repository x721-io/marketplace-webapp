import { tokenOptions } from "@/config/tokens";
import useClickOutside from "@/hooks/useClickOutside";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { useAppSettingsStore } from "@/store/app-settings/store";
import { formatUnits } from "ethers";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Icon from "../Icon";
import ItemsByToken from "./ItemsByToken";
import { CartItem } from "@/store/app-settings/types";

type Props = {};

const Cart: React.FC<Props> = () => {
  const [isLoading, setLoading] = useState(false);
  const cartRef = useRef<any>(null);
  const { cart, toggleCart, setCartItems } = useAppSettingsStore();
  const [invalidOrders, setInvalidOrders] = useState<
    { sig: string; index: number }[]
  >([]);
  const { buyBulk, getMultiOrdersDetails } = useMarketplaceV2();
  useClickOutside(cartRef, () => {
    toggleCart(false);
  });

  const groupedItemsByToken = useMemo(() => {
    const quoteTokens = Array.from(
      new Set(cart.items.map((item) => item.marketData.sellInfo[0].quoteToken))
    );
    return quoteTokens.map((quoteToken) => {
      return {
        items: cart.items.filter(
          (item) =>
            item.marketData.sellInfo[0].quoteToken.toLowerCase() ===
            quoteToken.toLowerCase()
        ),
        quoteToken,
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
      await buyBulk(
        ordersDetails.map((order, index) => {
          return {
            ...order,
            qty: cart.items[index].qty,
          };
        })
      );
      setCartItems([]);
      toast.success("Successfully bought all items");
    } catch (err) {
      toast.error("Error report: Buy failed. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={cartRef}
      style={{
        right: cart.isOpen ? "20px" : "-400px",
        opacity: cart.isOpen ? 1 : 0,
        transition: "right 0.2s ease-in-out, opacity 0.4s ease-in-out",
      }}
      className="flex flex-col fixed top-[50%] -translate-y-[50%] h-[750px] w-[450px] bg-white z-[100] rounded-lg shadow-2xl border-solid border-[1px] p-6"
    >
      <div className="flex items-center !font-bold text-[1.5rem] tracking-[0.5px]">
        Cart &nbsp;
        <span className="w-[32px] h-[32px] bg-[#252525] rounded-full text-white text-[14px] flex items-center justify-center !font-semibold">
          {cart.items.length}
        </span>
      </div>
      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden pt-5 pb-5">
        {groupedItemsByToken.map((groupedItems) => (
          <ItemsByToken
            key={groupedItems.quoteToken}
            groupedItems={groupedItems}
          />
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
