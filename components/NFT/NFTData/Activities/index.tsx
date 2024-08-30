import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import React, { useState } from "react";
import Text from "@/components/Text";
import { NFT } from "@/types";
import NFTMarketEvent from "./MarketEvent";
import { useGetNftEvents } from "@/hooks/useQuery";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ActivitiesTab({ nft }: { nft: NFT }) {
  const api = useMarketplaceApi();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { data, isLoading } = useGetNftEvents({
    page,
    limit,
    tokenId: nft.u2uId ? nft.u2uId : nft.id,
    collectionAddress: nft.collection.address,
  });

  if (isLoading) {
    return (
      <div className="py-7 overflow-x-auto">
        <div className="p-3 tablet:p-7 flex flex-row flex-wrap gap-4 rounded-2xl border border-disabled whitespace-normal h-auto max-h-[400px] overflow-auto  w-full tablet:w-full">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <div key={i} className="w-[100%] h-[35px]">
                <SkeletonTheme
                  height={"100%"}
                  width={"100%"}
                  baseColor="rgba(0,0,0,0.05)"
                  highlightColor="rgba(0,0,0,0.000001)"
                >
                  <Skeleton />
                </SkeletonTheme>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-7 overflow-x-auto">
      {!!data?.length ? (
        <div className="p-3 tablet:p-7 flex flex-col gap-4 rounded-2xl border border-disabled whitespace-normal h-auto max-h-[400px] overflow-auto  w-full tablet:w-full">
          {data.map((event) => (
            <NFTMarketEvent key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="p-7 rounded-2xl border border-disabled border-dashed">
          <Text className="text-secondary text-center text-bo">
            Nothing to show
          </Text>
        </div>
      )}
    </div>
  );
}
