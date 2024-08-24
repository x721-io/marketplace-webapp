import React, { useEffect } from "react";
import SliderIcon from "@/components/Icon/Sliders";
import Button from "@/components/Button";
import { classNames } from "@/utils/string";
import NFTsList from "@/components/List/NFTsList";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import useSWR from "swr";
import { Address } from "wagmi";
import { MODE_OWNED } from "@/config/constants";
import { useFetchNFTsByUser } from "@/hooks/useFetchNFTsByUser";
import { useGetTotalCountById } from "@/hooks/useQuery";

export default function OwnedNFTs({
  wallet,
  onUpdateAmount,
  isShow = true,
}: {
  wallet: Address;
  isShow?: boolean;
  onUpdateAmount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const api = useMarketplaceApi();
  const {
    isLoadingMore,
    isLoading,
    items,
    error,
    showFilters,
    filters,
    toggleFilter,
    resetFilters,
    updateFilters,
  } = useFetchNFTsByUser(wallet, "owned");

  const { data: totalOwned } = useGetTotalCountById(
    "total_owner-data",
    String(wallet) as `0x${string}`,
    String(MODE_OWNED)
  );

  useEffect(() => {
    if (totalOwned) {
      onUpdateAmount(totalOwned);
    }
  }, [totalOwned, onUpdateAmount]);

  return (
    <div
      style={
        !isShow
          ? {
              display: "none",
            }
          : {}
      }
      className="w-full py-7"
    >
      <Button
        onClick={() => toggleFilter()}
        className={classNames(
          showFilters ? "bg-white shadow" : `bg-surface-soft`,
          "mb-7"
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
        onClose={() => toggleFilter(false)}
        isLoadMore={isLoadingMore}
        isLoading={isLoading}
        activeFilters={filters}
        onApplyFilters={updateFilters}
        onResetFilters={resetFilters}
        showFilters={showFilters}
        items={items.concatenatedData}
        currentHasNext={items.currentHasNext}
        error={error}
      />
    </div>
  );
}
