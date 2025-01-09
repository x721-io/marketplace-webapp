import useClickOutside from "@/hooks/useClickOutside";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { useAppSettingsStore } from "@/store/app-settings/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Icon from "../Icon";
import ItemsByToken from "./ItemsByToken";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";
import { Spinner } from "flowbite-react";
import { findTokenByAddress } from "@/utils/token";
import { formatUnits } from "ethers";
import useAuthStore from "@/store/auth/store";
import { shortenAddress } from "@/utils/string";

type Props = {};

const Cart: React.FC<Props> = () => {
  const { profile } = useAuthStore();
  const router = useRouter();
  const [cartSection, setCartSection] = useState<"cart" | "checkout">(
    "checkout"
  );
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

  useEffect(() => {
    setCartSection("cart");
  }, [cart.isOpen]);

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
      const verifyInputs = cart.items.map((item) => {
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

  const submit = async () => {
    switch (cartSection) {
      case "cart":
        setCartSection("checkout");
        break;
      case "checkout":
        await buyAll();
        break;
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
        <div className="flex items-center justify-between !font-bold text-[1.5rem] tracking-[0.5px] mb-6">
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
          <div className="w-full flex items-center justify-end px-2 tracking-wide pb-4">
            <button
              onClick={() => setCartItems([])}
              className="!font-semibold text-[16px] text-[#6A6A6A]"
            >
              Clear all
            </button>
          </div>
        )}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden mb-5">
          {groupedItemsByToken.map((groupedItems) => (
            <ItemsByToken
              key={groupedItems.quoteToken + "_" + cartSection}
              groupedItems={groupedItems}
              isCollapseAll={cartSection === "checkout"}
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
                  router.push(
                    "/explore/items?orderStatus=OPEN&orderType=SINGLE"
                  );
                }}
                className="!py-3 !px-6 !text-[18px] !font-normal"
              >
                Explore NFTs
              </Button>
            </div>
          )}
        </div>
        <div
          className={`w-full ${
            cartSection === "checkout" && "bg-surface-soft"
          } rounded-2xl p-5 mb-4 flex flex-col gap-5 justify-center items-center`}
        >
          {cartSection === "checkout" && cart.items.length > 0 && (
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
                        key={groupedItems.quoteToken + "_" + cartSection}
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
          {cart.items.length > 0 && (
            <button
              disabled={isLoading}
              onClick={submit}
              className="w-full bg-black h-[50px] text-white !font-bold text-[1.1rem] rounded-2xl disabled:opacity-50"
            >
              {cartSection === "cart" ? (
                "Continue To Checkout"
              ) : !isLoading ? (
                "Pay now"
              ) : (
                <Spinner />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
