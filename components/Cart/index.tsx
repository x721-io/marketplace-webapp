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
import Button from "../Button";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";

type Props = {};

const Cart: React.FC<Props> = () => {
  const router = useRouter();
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

  if (!cart.isOpen) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] z-[200]`}
    >
      <div
        ref={cartRef}
        style={{
          right: isMobile ? "0px" : "20px",
          width: isMobile ? "100%" : "450px",
          transform: isMobile ? "translateY(0px)" : "translateY(-50%)",
          top: isMobile ? "auto" : "50%",
          bottom: isMobile ? "0px" : "auto",
          height: isMobile ? "85%" : "750px",
        }}
        className="flex flex-col fixed bg-white z-[100] rounded-lg shadow-2xl border-solid border-[1px] p-6"
      >
        <div className="flex items-center justify-between !font-bold text-[1.5rem] tracking-[0.5px] pb-6">
          <div className="flex items-center">
            Cart &nbsp;
            {cart.items.length > 0 && (
              <span className="w-[32px] h-[32px] bg-[#252525] rounded-full text-white text-[14px] flex items-center justify-center !font-semibold">
                {cart.items.length}
              </span>
            )}
          </div>
          <div>
            <button
              onClick={() => toggleCart(false)}
              className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center"
            >
              <Icon name="close" width={20} />
            </button>
          </div>
        </div>
        {cart.items.length > 0 && (
          <div className="w-full flex items-center justify-end px-2 tracking-wide">
            <button
              onClick={() => setCartItems([])}
              className="!font-semibold text-[16px] text-[#6A6A6A]"
            >
              Clear all
            </button>
          </div>
        )}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden pt-5 pb-5">
          {groupedItemsByToken.map((groupedItems) => (
            <ItemsByToken
              key={groupedItems.quoteToken}
              groupedItems={groupedItems}
            />
          ))}
          {cart.items.length === 0 && (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <div className="py-6 font-normal text-[18px] text-[#6A6A6A]">
                Add items to get started.
              </div>
              <Button
                onClick={() => {
                  toggleCart(false);
                  router.push("/explore/items");
                }}
                className="!py-3 !px-6 !text-[18px] !font-normal"
              >
                Explore NFTs
              </Button>
            </div>
          )}
        </div>
        {cart.items.length > 0 && (
          <button
            disabled={isLoading}
            onClick={buyAll}
            className="w-full bg-black h-[50px] text-white !font-bold text-[1.1rem] rounded-2xl disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Buy All"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
