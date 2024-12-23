"use client";

import ListItems from "@/components/PageBuilder/Items";
import React, { useEffect, useRef, useState } from "react";
import { useGetLayerGNFTs } from "@/hooks/useQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import NFTCardSkeleton from "@/components/NFT/NFTCard/skeleton";
import { useLayerGNFTFilterStore } from "@/store/filters/layerg/byLayerG/store";

export default function Items() {
  const filtersTimeout = useRef<any>(null);
  const { showFilters, toggleFilter, filters, updateFilters, resetFilters } =
    useLayerGNFTFilterStore();
  const [decouncedFilters, setDebouncedFilters] = useState<any>(null);

  const { error, isLoading, setSize, size, data, mutate } = useGetLayerGNFTs(
    decouncedFilters,
    !!decouncedFilters
  );

  useEffect(() => {
    if (filtersTimeout.current) {
      clearInterval(filtersTimeout.current);
    }
    filtersTimeout.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    // mutate()
  }, [filters]);

  const { isLoadingMore, list: items } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => {
      setSize(size + 1);
    },
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
    <div className="w-full h-full overflow-y-auto">
      <ListItems
        isLoading={isLoading}
        isLoadMore={isLoadingMore}
        items={items.concatenatedData}
        hasNext={items.currentHasNext}
      />
    </div>
  );
}
