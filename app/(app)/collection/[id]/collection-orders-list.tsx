import Button from "@/components/Button";
import { ADDRESS_ZERO } from "@/config/constants";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { useGetCollectionOrders } from "@/hooks/useQuery";
import { useAppSettingsStore } from "@/store/app-settings/store";
import { NFT } from "@/types";
import { convertImageUrl } from "@/utils/nft";
import { shortenAddress } from "@/utils/string";
import { findTokenByAddress } from "@/utils/token";
import { formatUnits, parseUnits } from "ethers";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import CollectionTaskbar from "./collection-taskbar";
import Icon from "@/components/Icon";
import { tokenOptions } from "@/config/tokens";
import { APIParams } from "@/services/api/types";
import { Spinner } from "flowbite-react";
import { CartItem } from "@/store/app-settings/types";
import { useRouter } from "next/navigation";

type Props = {
  collectionAddress: string;
};

const CollectionOrdersList: React.FC<Props> = ({ collectionAddress }) => {
  const router = useRouter();
  const setFilterTimeoutFunc = useRef<any>(null);
  const [selectedItems, setSelectedItems] = useState<NFT[]>([]);
  const [quoteToken, setQuoteToken] = useState(ADDRESS_ZERO);
  const { setCheckoutItems, addToCart } = useAppSettingsStore();
  const [sweepAmt, setSweepAmt] = useState(0);
  const { getMultiOrdersDetails, buyBulk } = useMarketplaceV2();
  const [priceMax, setPriceMax] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [filters, setFilters] = useState<APIParams.FetchCollectionOrders>({
    collectionAddress,
    limit: 30,
    order: "asc",
    orderBy: "price",
    page: 1,
    orderStatus: "OPEN",
    orderType: "SINGLE",
    name,
    quoteToken: quoteToken as any,
    priceMax: priceMax ? BigInt(priceMax) : BigInt(0),
  });

  const { error, isLoading, setSize, size, data } =
    useGetCollectionOrders(filters);

  const { isLoadingMore, list: orders } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  const checkout = async () => {
    // try {
    //   // setSweeping(true);
    //   // setInvalidOrders([]);
    //   const verifyInputs: any[] = selectedItems
    //     .map((item) => {
    //       if (!item.sellInfo) return null;
    //       return {
    //         sig: item.sellInfo.sig,
    //         index: item.sellInfo.index,
    //       };
    //     })
    //     .filter((verifyInput) => verifyInput !== null);
    //   const ordersDetails = await getMultiOrdersDetails(verifyInputs as any);
    //   if (!ordersDetails) return;
    //   const invalidOrders = ordersDetails.filter((order) => !order.isSuccess);
    //   if (invalidOrders.length > 0) {
    //     // setInvalidOrders(invalidOrders);
    //     return;
    //   }
    //   await buyBulk(
    //     ordersDetails.map((order) => {
    //       return {
    //         ...order,
    //         qty: 1,
    //       };
    //     })
    //   );
    //   toast.success("Successfully bought all items");
    // } catch (err) {
    //   toast.error("Error report: Buy failed. Please try again later");
    // } finally {
    //   // setSweeping(false);
    // }
    const verifyInputs: any[] = selectedItems
      .map((item) => {
        if (!item.sellInfo) return null;
        return {
          sig: item.sellInfo.sig,
          index: item.sellInfo.index,
        };
      })
      .filter((verifyInput) => verifyInput !== null);
    const ordersDetails = await getMultiOrdersDetails(verifyInputs as any);
    if (!ordersDetails) return;
    const invalidOrders = ordersDetails.filter((order) => !order.isSuccess);
    if (invalidOrders.length > 0) {
      return;
    }
    const cartItems: CartItem[] = ordersDetails.map((orderDetails, i) => {
      const {
        Maker,
        Taker,
        end,
        filledQty,
        id,
        index,
        netPrice,
        netPriceNum,
        orderStatus,
        orderType,
        price,
        priceNum,
        quantity,
        quoteToken,
        sig,
        start,
        timestamp,
      } = orderDetails;
      const cartItem: CartItem = {
        marketData: {
          bidInfo: [],
          sellInfo: [
            {
              end,
              filledQty,
              id,
              index,
              Maker,
              netPrice,
              netPriceNum,
              orderStatus,
              orderType,
              price,
              priceNum,
              quantity,
              sig,
              start,
              timestamp,
              quoteToken,
              Taker,
            },
          ],
          owners: [],
          totalSupply: "0",
        },
        nftData: selectedItems[i],
        qty: selectedItems[i].sellInfo?.quantity ?? 0,
      };
      return cartItem;
    });
    setCheckoutItems(cartItems);
    router.push("/checkout");
  };

  // const totalSweepPrice = useMemo(() => {
  //   if (!filters.quoteToken) return 0;
  //   const totalPrice = selectedItems.reduce((acc, item) => acc + BigInt(item?.price ?? 0), BigInt(0));
  //   const token = findTokenByAddress(filters.quoteToken?.toLowerCase() as any);
  //   return formatUnits(BigInt(totalPrice), token?.decimal ?? 18);
  // }, [selectedItems, filters.quoteToken]);

  useEffect(() => {
    const handleSweep = () => {
      if (sweepAmt === 0) {
        setSelectedItems([]);
        return;
      }

      let remainingAmt = sweepAmt;
      const sweepedNfts: NFT[] = orders.concatenatedData.reduce((acc, item) => {
        if (item.sellInfo && remainingAmt > 0) {
          const remainQty =
            item.sellInfo.quantity - (item.sellInfo.filledQty ?? 0);
          const quantityToAdd = Math.min(remainingAmt, remainQty);

          acc.push({
            ...item,
            sellInfo: {
              ...item.sellInfo,
              quantity: quantityToAdd,
            },
          });

          remainingAmt -= quantityToAdd;

          if (remainingAmt === 0) return acc;
        }
        return acc;
      }, [] as NFT[]);

      setSelectedItems(sweepedNfts);
    };

    handleSweep();
  }, [sweepAmt, orders]);

  const maxQty = useMemo(() => {
    let maxQty = 0;
    orders.concatenatedData.forEach((item: NFT) => {
      if (item.sellInfo) {
        const remainQty =
          item.sellInfo.quantity - (item.sellInfo.filledQty ?? 0);
        maxQty += remainQty;
      }
    });
    return maxQty;
  }, [orders]);

  const getSelectedItem = (item: NFT) => {
    return (
      selectedItems.find(
        (selectedItem) =>
          selectedItem.id === item.id &&
          selectedItem.collectionId === item.collectionId
      ) ?? null
    );
  };

  useEffect(() => {
    setFilters({
      ...filters,
      quoteToken: quoteToken as any,
    });
  }, [quoteToken]);

  useEffect(() => {
    if (setFilterTimeoutFunc.current) {
      clearTimeout(setFilterTimeoutFunc.current);
    }
    setFilterTimeoutFunc.current = setTimeout(() => {
      setFilters({
        ...filters,
        priceMax: priceMax
          ? BigInt(parseUnits(priceMax.toString(), 18))
          : BigInt(0),
        name,
      });
    }, 200);
  }, [priceMax, name]);

  const handleAddToCart = async (item: NFT) => {
    const verifyInputs: any[] = [item]
      .map((item) => {
        if (!item.sellInfo) return null;
        return {
          sig: item.sellInfo.sig,
          index: item.sellInfo.index,
        };
      })
      .filter((verifyInput) => verifyInput !== null);
    const ordersDetails = await getMultiOrdersDetails(verifyInputs as any);
    if (!ordersDetails) return;
    const cartItems: CartItem[] = ordersDetails.map((orderDetails, i) => {
      const {
        Maker,
        Taker,
        end,
        filledQty,
        id,
        index,
        netPrice,
        netPriceNum,
        orderStatus,
        orderType,
        price,
        priceNum,
        quantity,
        quoteToken,
        sig,
        start,
        timestamp,
      } = orderDetails;
      const cartItem: CartItem = {
        marketData: {
          bidInfo: [],
          sellInfo: [
            {
              end,
              filledQty,
              id,
              index,
              Maker,
              netPrice,
              netPriceNum,
              orderStatus,
              orderType,
              price,
              priceNum,
              quantity,
              sig,
              start,
              timestamp,
              quoteToken,
              Taker,
            },
          ],
          owners: [],
          totalSupply: "0",
        },
        nftData: item,
        qty: item.sellInfo?.quantity ?? 0,
      };
      return cartItem;
    });
    if (cartItems.length > 0) {
      addToCart(cartItems[0]);
    }
  };

  return (
    <div className="desktop:w-[91%] w-[95%] mx-auto mt-6">
      <div className="w-full mb-6 flex gap-3">
        <input
          placeholder="Type for NFTs"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-surface-soft outline-none border-none text-[16px] font-normal text-[#6A6A6A]"
        />
      </div>
      <div className="w-full relative rounded-lg shadow-sm">
        <div className="sticky mt-0 py-4 top-0 left-0 w-[100%] mx-auto flex items-center px-4 !font-normal text-[12px] text-[#6A6A6A] bg-[#F5F5F5]">
          <div className="desktop:w-[20%] w-1/2 h-full uppercase flex items-center gap-6">
            <input
              type="checkbox"
              style={{
                filter:
                  "sepia(100%) brightness(80%) hue-rotate(170deg) saturate(70%) contrast(300%)",
              }}
              checked={selectedItems.length === orders.concatenatedData.length}
              onClick={() => {
                if (selectedItems.length === orders.concatenatedData.length) {
                  setSelectedItems([]);
                } else {
                  setSelectedItems(
                    orders.concatenatedData
                      .map((item: NFT) => {
                        if (!item.sellInfo) {
                          return null;
                        }
                        return {
                          ...item,
                          sellInfo: {
                            ...item.sellInfo,
                            quantity:
                              item.sellInfo.quantity - item.sellInfo.filledQty,
                          },
                        };
                      })
                      .filter((item) => item !== null)
                  );
                }
              }}
            />
            {selectedItems.length} / {orders.concatenatedData.length} selected
          </div>
          <div className="desktop:w-[18%] w-1/2 h-full uppercase flex items-center justify-center">
            Buy now
          </div>
          <div className="w-[20%] h-full uppercase desktop:flex hidden items-center px-6">
            Quantity
          </div>
          <div className="w-[15%] h-full uppercase desktop:flex hidden items-center">
            Creator
          </div>
          <div className="w-[15%] h-full uppercase desktop:flex hidden items-center">
            Expire Date
          </div>
          <div className="flex-1 h-full uppercase desktop:flex hidden items-center">
            Created At
          </div>
          <div className="w-[50px] desktop:flex hidden" />
        </div>
        <div className="relative w-[100%] mx-auto max-h-[calc(100vh_-_100px)] overflow-y-auto  flex flex-col pb-2">
          {isLoading && (
            <div className="w-full flex items-center justify-center py-6">
              <Spinner className="w-[45px] h-[45px]" />
            </div>
          )}
          {!isLoading &&
            orders.concatenatedData?.length > 0 &&
            orders.concatenatedData.map((nft: NFT) => (
              <div
                key={nft.id}
                style={{
                  backgroundColor: getSelectedItem(nft)
                    ? "#F5F5F5"
                    : "transparent",
                  opacity: getSelectedItem(nft) ? 1 : 0.5,
                }}
                className={`w-full flex items-center px-4 text-[0.9rem] transition-colors border-solid border-b-[1px]`}
              >
                <div
                  className={`desktop:w-[20%] w-1/2 py-4 flex items-center gap-4`}
                >
                  <input
                    type="checkbox"
                    style={{
                      filter:
                        "sepia(100%) brightness(80%) hue-rotate(170deg) saturate(70%) contrast(300%)",
                    }}
                    checked={getSelectedItem(nft) !== null}
                    onClick={() => {
                      if (getSelectedItem(nft)) {
                        setSelectedItems(
                          selectedItems.filter((item) => item.id !== nft.id)
                        );
                      } else {
                        const clonedNFT = structuredClone(nft);
                        if (!clonedNFT.sellInfo) return;
                        clonedNFT.sellInfo.quantity =
                          clonedNFT.sellInfo.quantity -
                          clonedNFT.sellInfo.filledQty;
                        setSelectedItems([...selectedItems, clonedNFT]);
                      }
                    }}
                  />
                  <Image
                    src={convertImageUrl(nft.image)}
                    alt="nft-image"
                    width={48}
                    height={48}
                    className="w-[48px] h-[48px] rounded-xl"
                  />
                  <Link
                    href={`/item/${nft.collection.address}/${nft.id}`}
                    className="hover:underline text-[#252525] !font-semibold text-[16px]"
                  >
                    {nft.name}
                  </Link>
                </div>
                <div className="desktop:w-[18%] w-1/2 h-full flex items-center justify-center">
                  <button className="flex items-center gap-2 border-solid border-[1px] px-2 py-1 rounded-lg bg-[#ECE5FF]">
                    <Image
                      src={
                        findTokenByAddress(
                          (nft.sellInfo?.quoteToken as any) ?? ADDRESS_ZERO
                        )?.logo ?? ""
                      }
                      alt="token-img"
                      width={22}
                      height={22}
                      className="rounded-full"
                    />
                    <div className="text-[16px] font-semibold text-[#252525]">
                      {formatUnits(
                        nft.sellInfo?.price ?? 0,
                        findTokenByAddress(
                          (nft.sellInfo?.quoteToken as any) ?? ADDRESS_ZERO
                        )?.decimal ?? 18
                      ).toString()}
                      &nbsp;
                      {
                        findTokenByAddress(
                          (nft.sellInfo?.quoteToken as any) ?? ADDRESS_ZERO
                        )?.symbol
                      }
                    </div>
                  </button>
                </div>
                <div className="w-[20%] h-full desktop:flex hidden items-center justify-start pl-6 pr-8 text-[16px] font-medium text-[#252525]">
                  <div className="w-[55px] flex items-center justify-start">
                    {getSelectedItem(nft)?.sellInfo?.quantity ?? 0}/
                    {nft.sellInfo?.quantity
                      ? nft.sellInfo?.quantity - (nft.sellInfo.filledQty ?? 0)
                      : 0}
                  </div>
                  <div className="flex-1 mx-auto h-[10px] desktop:flex hidden bg-surface-medium relative overflow-hidden rounded-md">
                    <div
                      style={{
                        width: `${
                          ((getSelectedItem(nft)?.sellInfo?.quantity ?? 0) /
                            (nft.sellInfo?.quantity
                              ? nft.sellInfo?.quantity -
                                (nft.sellInfo.filledQty ?? 0)
                              : 0)) *
                          100
                        }%`,
                      }}
                      className="bg-[#040404] h-full transition-transform"
                    />
                  </div>
                </div>
                <div className="w-[15%] h-full desktop:flex hidden items-center">
                  <Link
                    href={`/user/${nft.sellInfo?.maker?.publicKey}`}
                    className="underline text-[16px] font-medium text-[#252525]"
                  >
                    {shortenAddress(nft.sellInfo?.maker?.publicKey)}
                  </Link>
                </div>
                <div className="w-[15%] h-full desktop:flex hidden items-center text-[16px] font-medium text-[#252525]">
                  {nft.sellInfo?.end &&
                    moment(nft.sellInfo?.end * 1000).fromNow()}
                </div>
                <div className="flex-1 h-full desktop:flex hidden items-center text-[16px] font-medium text-[#252525]">
                  {nft.sellInfo?.start &&
                    moment(nft.sellInfo?.start * 1000).fromNow()}
                </div>
                <div className="w-[50px] desktop:flex hidden justify-center">
                  <button onClick={() => handleAddToCart(nft)}>
                    <Icon name="shoppingBag" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <CollectionTaskbar
        selectedItems={selectedItems}
        maxSweepAmt={maxQty}
        setSweepAmt={setSweepAmt}
        quoteToken={quoteToken}
        priceMax={priceMax}
        onChangeQuoteToken={(value) => setQuoteToken(value)}
        onChangePriceMax={(value) => {
          setPriceMax(value);
        }}
        onSweep={() => {
          checkout();
        }}
      />
    </div>
  );
};

export default CollectionOrdersList;
