"use client";

import Button from "@/components/Button";
import Icon from "@/components/Icon";
import AcceptBidNFTModal from "@/components/Modal/AcceptBidNFTModal";
import BuyNFTModal from "@/components/Modal/BuyNFTModal";
import CancelSellNFTModal from "@/components/Modal/CancelSellNFTModal";
import Text from "@/components/Text";
import { MyModal } from "@/components/X721UIKits/Modal";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { APIResponse } from "@/services/api/types";
import useAuthStore from "@/store/auth/store";
import { MarketEventV2, NFT } from "@/types";
import { shortenAddress } from "@/utils/string";
import moment from "moment";
import { useState } from "react";
import { formatEther } from "viem";
import { toast } from "react-toastify";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetNftPriceHistory } from "@/hooks/useQuery";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

const SaleInfo = ({
  marketData,
  nft,
}: {
  marketData?: APIResponse.NFTMarketData;
  nft: NFT;
}) => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data: priceHistories } = useGetNftPriceHistory({
    collectionAddress: nft.collection.address,
    id: nft.id,
  });
  const [isCancelling, setCancelling] = useState(false);
  const { cancelOrder, getOrderDetails } = useMarketplaceV2(nft);
  const [activeAccordIds, setActiveAccordIds] = useState<number[]>([0, 1, 2]);
  const { profile } = useAuthStore();
  const [saleData, setSaleData] = useState<MarketEventV2 | null>(null);
  const [cancelSaleData, setCancelSaleData] = useState<MarketEventV2 | null>(
    null
  );
  const [bidData, setBidData] = useState<MarketEventV2 | null>(null);
  const [cancelBidData, setCancelBidData] = useState<MarketEventV2 | null>(
    null
  );
  const columnClassName = "text-left p-3";
  const headerTextClassName =
    "text-heading-sm !text-[1rem] text-[rgba(0,0,0,0.75)] tracking-wide";

  const toggleAccord = (accordId: number) => {
    if (activeAccordIds.includes(accordId)) {
      setActiveAccordIds((prev) => prev.filter((id) => id !== accordId));
    } else {
      setActiveAccordIds((prev) => [...prev, accordId]);
    }
  };

  const renderAccord = (
    title: string,
    accordId: number,
    content: React.ReactNode
  ) => {
    return (
      <div className="w-full flex flex-col bg-surface-soft shadow rounded-2xl p-3">
        <div
          onClick={() => toggleAccord(accordId)}
          className="w-full px-2 pb-3 pt-1 text-heading-xs !text-[1.25rem] tracking-normal cursor-pointer flex items-center justify-between"
        >
          {title}{" "}
          <div
            style={{
              transform: activeAccordIds.includes(accordId)
                ? "rotate(180deg)"
                : "rotate(0deg)",
            }}
          >
            <Icon name="chevronDown" />
          </div>
        </div>
        {activeAccordIds.includes(accordId) && (
          <div className="w-full flex flex-col">{content}</div>
        )}
      </div>
    );
  };

  const getSellListContent = () => {
    if (!marketData || marketData?.sellInfo.length === 0) {
      return (
        <div className="w-full flex flex-col items-center justify-center pt-3 text-[1.1rem] text-[rgba(0,0,0,0.5)] border-solid border-t-[1px]">
          <td className={columnClassName + " text-center"}>
            There are no listings for this NFT
          </td>
        </div>
      );
    }
    return (
      <table className="w-full">
        <tr className="w-full border-solid border-t-[1px] border-b-[1px]">
          <th className={columnClassName + " w-[20%] " + headerTextClassName}>
            Unit Price
          </th>
          <th className={columnClassName + " w-[22%] " + headerTextClassName}>
            Quantity
          </th>
          <th className={columnClassName + " w-[22%] " + headerTextClassName}>
            Expiration
          </th>
          <th className={columnClassName + " w-[22%] " + headerTextClassName}>
            From
          </th>
          <th
            className={columnClassName + " flex-1 " + headerTextClassName}
          ></th>
        </tr>

        {marketData &&
          marketData.sellInfo?.length > 0 &&
          marketData.sellInfo.map((s) => (
            <tr key={s.id}>
              <td className={columnClassName + " flex flex-col"}>
                {formatEther(BigInt(s.price), "wei")}
              </td>
              <td className={columnClassName}>{s.quantity - s.filledQty}</td>
              <td className={columnClassName}>
                {moment(s.end * 1000).fromNow()}
              </td>
              <td
                onClick={() => {
                  router.push(`/user/${s.Maker?.publicKey}`);
                }}
                className={columnClassName + " hover:underline cursor-pointer"}
              >
                {shortenAddress(s.Maker?.publicKey)}
              </td>
              <td
                className={
                  columnClassName +
                  "w-full text-center hover:underline cursor-pointer"
                }
              >
                <button
                  className="bg-[rgba(0,0,0,0.95)] text-white py-2 px-5 rounded-md"
                  onClick={() => {
                    if (profile?.publicKey !== s.Maker?.publicKey) {
                      setSaleData(s);
                      return;
                    }
                    setCancelSaleData(s);
                  }}
                >
                  {profile?.publicKey !== s.Maker?.publicKey ? "Buy" : "Cancel"}
                </button>
              </td>
            </tr>
          ))}
      </table>
    );
  };

  const getBidListContent = () => {
    if (!marketData || marketData?.bidInfo.length === 0) {
      return (
        <div className="w-full flex flex-col items-center justify-center pt-3 text-[1.1rem] text-[rgba(0,0,0,0.5)] border-solid border-t-[1px]">
          <td className={columnClassName + " text-center"}>
            There are no offers for this NFT
          </td>
        </div>
      );
    }
    return (
      <table className="w-full">
        <tr className="w-full border-solid border-t-[1px] border-b-[1px]">
          <th className={columnClassName + " w-[20%] " + headerTextClassName}>
            Unit Price
          </th>
          <th className={columnClassName + " w-[22%] " + headerTextClassName}>
            Quantity
          </th>
          <th className={columnClassName + " w-[22%] " + headerTextClassName}>
            Expiration
          </th>
          <th className={columnClassName + " w-[22%] " + headerTextClassName}>
            From
          </th>
          <th
            className={columnClassName + " flex-1 " + headerTextClassName}
          ></th>
        </tr>

        {marketData &&
          marketData.bidInfo?.length > 0 &&
          marketData.bidInfo.map((s) => (
            <tr key={s.id}>
              <td className={columnClassName + " flex flex-col"}>
                {formatEther(BigInt(s.price), "wei")}
              </td>
              <td className={columnClassName}>{s.quantity - s.filledQty}</td>
              <td className={columnClassName}>
                {moment(s.end * 1000).fromNow()}
              </td>
              <td
                onClick={() => {
                  router.push(`/user/${s.Maker?.publicKey}`);
                }}
                className={columnClassName + " hover:underline cursor-pointer"}
              >
                {shortenAddress(s.Maker?.publicKey)}
              </td>
              <td className={columnClassName + "w-full text-center"}>
                {marketData?.owners.findIndex(
                  (owner) => owner.publicKey === profile?.publicKey
                ) !== -1 ? (
                  <button
                    className="bg-[rgba(0,0,0,0.95)] text-white py-2 px-5 rounded-md"
                    onClick={() => {
                      setBidData(s);
                    }}
                  >
                    Accept
                  </button>
                ) : profile?.publicKey === s.Maker?.publicKey ? (
                  <button
                    className="bg-[rgba(0,0,0,0.95)] text-white py-2 px-5 rounded-md"
                    onClick={() => {
                      setCancelBidData(s);
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
      </table>
    );
  };

  const handleCancelOrder = async (type: "bid" | "sale") => {
    try {
      setCancelling(true);
      const { sig, index } =
        type === "sale" ? (cancelSaleData as any) : (cancelBidData as any);
      const orderDeatails = await getOrderDetails(sig, index);
      if (!orderDeatails) return;
      await cancelOrder(orderDeatails);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      mutate([
        `nft-market-data/${nft.id}`,
        {
          collectionAddress: String(nft.collection.address),
          id: String(nft.id),
        },
      ]);
      toast.success("Successfully cancelled order.");
      setCancelBidData(null);
    } catch (err: any) {
      toast.error(`Error report: User rejected`);
    } finally {
      setCancelling(false);
    }
  };

  const renderPriceChart = () => {
    if (priceHistories && priceHistories.length > 0) {
      return (
        <div className="w-full relative aspect-video pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={730}
              height={250}
              data={priceHistories.map((item) => {
                return {
                  datetime: moment(item.timestamp * 1000).format(
                    "HH:MM MMM DD"
                  ),
                  price: item.priceNum,
                };
              })}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datetime" />
              <YAxis dataKey="price" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#121212"
                strokeWidth={1.5}
              />
              {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }
    return (
      <div className="w-full text-balance text-center flex flex-col">
        <div>No events have occurred yet</div>
        <div>Check back later</div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {renderAccord("Price History", 0, renderPriceChart())}
      {renderAccord("Listings", 1, getSellListContent())}
      {renderAccord("Offers", 2, getBidListContent())}
      {saleData && (
        <BuyNFTModal
          saleData={saleData}
          nft={nft}
          show={saleData !== null}
          onClose={() => setSaleData(null)}
        />
      )}
      {bidData && (
        <AcceptBidNFTModal
          nft={nft}
          bid={bidData}
          show={bidData !== null}
          onClose={() => setBidData(null)}
        />
      )}
      {marketData && cancelSaleData && (
        <MyModal.Root
          show={cancelSaleData !== null}
          onClose={() => setCancelSaleData(null)}
        >
          <MyModal.Body className="pb-5">
            <div className="flex flex-col justify-center gap-4 items-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="font-bold">
                  <Text className="mb-3 text-center" variant="heading-xs">
                    Cancel listing
                  </Text>
                  <Text className="text-secondary" variant="body-16">
                    Cancel sale for{" "}
                    <span className="text-primary font-bold">{nft.name}</span>{" "}
                    from{" "}
                    <span className="text-primary font-bold">
                      {nft.collection.name}
                    </span>{" "}
                    collection
                  </Text>
                </div>

                <div className="w-full flex gap-4">
                  <Button
                    className="flex-1"
                    variant="secondary"
                    loading={isCancelling}
                    onClick={() => setCancelSaleData(null)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleCancelOrder("sale")}
                    loading={isCancelling}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </div>
          </MyModal.Body>
        </MyModal.Root>
      )}
      {marketData && cancelBidData && (
        <MyModal.Root
          show={cancelBidData !== null}
          onClose={() => setCancelBidData(null)}
        >
          <MyModal.Body className="pb-5">
            <div className="flex flex-col justify-center gap-4 items-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="font-bold">
                  <Text className="mb-3 text-center" variant="heading-xs">
                    Cancel bidding
                  </Text>
                  <Text className="text-secondary" variant="body-16">
                    Cancel sale for{" "}
                    <span className="text-primary font-bold">{nft.name}</span>{" "}
                    from{" "}
                    <span className="text-primary font-bold">
                      {nft.collection.name}
                    </span>{" "}
                    collection
                  </Text>
                </div>

                <div className="w-full flex gap-4">
                  <Button
                    className="flex-1"
                    variant="secondary"
                    loading={isCancelling}
                    onClick={() => setCancelBidData(null)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleCancelOrder("bid")}
                    loading={isCancelling}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </div>
          </MyModal.Body>
        </MyModal.Root>
      )}
    </div>
  );
};

export default SaleInfo;
