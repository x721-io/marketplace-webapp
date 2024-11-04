import { useEffect } from "react";
import SliderIcon from "@/components/Icon/Sliders";
import Button from "@/components/Button";
import { classNames } from "@/utils/string";
import NFTsList from "@/components/List/NFTsList";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import useSWR from "swr";
import { Address } from "abitype";
import { MODE_CREATED } from "@/config/constants";
import { useFetchNFTsByUser } from "@/hooks/useFetchNFTsByUser";
import { useGetTotalCountById } from "@/hooks/useQuery";

export default function CreatedNFTs({
  wallet,
  onUpdateAmount,
  userId,
  isShow = true,
}: {
  wallet: Address;
  isShow?: boolean;
  onUpdateAmount: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
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
  } = useFetchNFTsByUser(wallet, "created");

  const { data: totalCreated } = useGetTotalCountById(
    "total_creator-data",
    String(wallet) as `0x${string}`,
    String(MODE_CREATED)
  );

  useEffect(() => {
    if (totalCreated) {
      onUpdateAmount(totalCreated);
    }
  }, [totalCreated, onUpdateAmount]);

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
        isLoadMore={isLoadingMore}
        isLoading={isLoading}
        onApplyFilters={updateFilters}
        activeFilters={filters}
        onResetFilters={resetFilters}
        showFilters={showFilters}
        items={items.concatenatedData}
        currentHasNext={items.currentHasNext}
        userId={userId}
        showCreateNFT={true}
        error={error}
      />
    </div>
  );
}
