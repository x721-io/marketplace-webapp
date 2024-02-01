import { useEffect, useState } from "react";
import SliderIcon from "@/components/Icon/Sliders";
import Button from "@/components/Button";
import { classNames } from "@/utils/string";
import NFTsList from "@/components/List/NFTsList";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { APIParams, APIResponse } from "@/services/api/types";
import useSWR from "swr";
import { sanitizeObject } from "@/utils";
import { useNFTFilters } from "@/hooks/useFilters";
import { Address } from "wagmi";
import { MODE_CREATED } from "@/config/constants";

export default function CreatedNFTs({
  wallet,
  onUpdateAmount,
  userId,
}: {
  wallet: Address;
  onUpdateAmount: (n: APIResponse.TotalCount) => void;
  userId: string;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const api = useMarketplaceApi();
  const { activeFilters, handleApplyFilters, handleChangePage } = useNFTFilters(
    {
      page: 1,
      limit: 20,
      traits: undefined,
      collectionAddress: undefined,
      creatorAddress: wallet,
      priceMax: undefined,
      priceMin: undefined,
      sellStatus: undefined,
    },
  );

  const { data, isLoading } = useSWR(
    activeFilters,
    (params) => api.fetchNFTs(sanitizeObject(params) as APIParams.FetchNFTs),
    { refreshInterval: 300000 },
  );

  const { data: totalCreated } = useSWR(
    [
      "total_creator-data",
      { creatorAddress: String(wallet), mode: String(MODE_CREATED) },
    ],
    ([_, params]) =>
      api.getTotalCountById({
        ...params,
      }),
    { refreshInterval: 5000 },
  );

  useEffect(() => {
    if (totalCreated) {
      onUpdateAmount(totalCreated);
    }
  }, [totalCreated, onUpdateAmount]);

  return (
    <div className="w-full py-7">
      <Button
        onClick={() => setShowFilters(!showFilters)}
        className={classNames(
          showFilters ? "bg-white shadow" : `bg-surface-soft`,
          "mb-7",
        )}
        scale="sm"
        variant="secondary"
      >
        Filters
        <span className="p-1 bg-surface-medium rounded-lg">
          <SliderIcon width={14} height={14} />
        </span>
      </Button>

      <NFTsList
        loading={isLoading}
        onApplyFilters={handleApplyFilters}
        onChangePage={handleChangePage}
        filters={["type", "price"]}
        showFilters={showFilters}
        items={data?.data}
        paging={data?.paging}
        userId={userId}
        showCreateNFT={true}
      />
    </div>
  );
}
