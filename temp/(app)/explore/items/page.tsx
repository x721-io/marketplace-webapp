"use client";

import NFTsList from "@/components/List/NFTsList";
import { useNFTFilterStore } from "@/store/filters/items/store";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useEffect, useRef, useState } from "react";
import { useGetNFTs } from "@/hooks/useQuery";
import NFTCardSkeleton from "@/components/NFT/NFTCard/skeleton";

export default function ExploreNFTsPage() {
  const filtersTimeout = useRef<any>(null);
  const { showFilters, toggleFilter, filters, updateFilters, resetFilters } =
    useNFTFilterStore();
  const [decouncedFilters, setDebouncedFilters] = useState<any>(null);
  // const { error, isLoading, setSize, size, data } =
  //   useFetchNFTList(decouncedFilters);
  const { error, isLoading, setSize, size, data } = useGetNFTs(
    decouncedFilters,
    !!decouncedFilters
  );

  useEffect(() => {
    if (filtersTimeout.current) {
      clearInterval(filtersTimeout.current);
    }
    filtersTimeout.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 200);
  }, [filters]);

  const { isLoadingMore, list: items } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  if (!decouncedFilters) {
    return (
      <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-6 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
        {Array(20)
          .fill("")
          .map((_, i) => (
            <NFTCardSkeleton key={i} />
          ))}
      </div>
    );
  }

  return (
    <NFTsList
      onClose={() => toggleFilter(false)}
      isLoading={isLoading}
      isLoadMore={isLoadingMore}
      activeFilters={filters}
      onApplyFilters={updateFilters}
      onResetFilters={resetFilters}
      showFilters={showFilters}
      items={items.concatenatedData}
      currentHasNext={items.currentHasNext}
      error={error}
    />
  );
}
