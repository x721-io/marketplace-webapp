"use client";

import CollectionFilters from "@/components/Filters/CollectionFilters";
import CollectionsList from "@/components/List/CollectionsList";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import MobileCollectionFiltersModal from "@/components/Filters/MobileCollectionFiltersModal";
import { useCollectionFilterStore } from "@/store/filters/collections/store";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGetCollections } from "@/hooks/useQuery";
import CollectionItemSkeleton from "@/components/CollectionItem/skeleton";

export default function ExploreCollectionsPage() {
  const filtersTimeout = useRef<any>(null);
  const { showFilters, toggleFilter, filters, updateFilters, resetFilters } =
    useCollectionFilterStore((state) => state);
  const [decouncedFilters, setDebouncedFilters] = useState<any>(null);
  const { data, size, isLoading, setSize, error } = useGetCollections(
    decouncedFilters,
    !!decouncedFilters
  );

  const { isLoadingMore, list: collections } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  useEffect(() => {
    if (filtersTimeout.current) {
      clearInterval(filtersTimeout.current);
    }
    filtersTimeout.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 200);
  }, [filters]);

  if (!decouncedFilters) {
    return (
      <div className="grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:grid-cols-4 desktop:gap-3 tablet:grid-cols-2 tablet:gap-4 grid-cols-1 gap-3">
        {Array(20)
          .fill("")
          .map((_, i) => (
            <CollectionItemSkeleton key={i} />
          ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 flex-col desktop:flex-row">
      {isMobile ? (
        <MobileCollectionFiltersModal
          onApplyFilters={updateFilters}
          show={showFilters}
          activeFilters={filters}
          onResetFilters={resetFilters}
          onClose={() => toggleFilter(false)}
        />
      ) : (
        <CollectionFilters
          activeFilters={filters}
          onApplyFilters={updateFilters}
          showFilters={showFilters}
          onResetFilters={resetFilters}
        />
      )}

      <div className="flex-1">
        <CollectionsList
          error={error}
          isLoading={isLoading}
          isLoadMore={isLoadingMore}
          collections={collections.concatenatedData}
          showFilter={showFilters}
          currentHasNext={collections.currentHasNext}
        />
      </div>
    </div>
  );
}
