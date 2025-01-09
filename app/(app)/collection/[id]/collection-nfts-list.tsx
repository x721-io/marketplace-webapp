"use client";

import React, { useEffect, useMemo } from "react";
import { APIParams, APIResponse } from "@/services/api/types";
import NFTsList from "@/components/List/NFTsList";
import FiltersSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/FiltersCollectionSection";
import { useFilterByCollection } from "@/store/filters/byCollection/store";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGetNFTs } from "@/hooks/useQuery";
import { Address } from "abitype";
import CollectionTaskbar from "./collection-taskbar";

export default function CollectionNftsList({
  collectionData,
}: {
  collectionData?: APIResponse.CollectionDetails;
}) {
  const filterStore = useFilterByCollection((state) => state);

  useEffect(() => {
    if (collectionData) {
      const collectionAddress = collectionData.collection.address;
      filterStore.createFiltersForCollection(collectionAddress);
      filterStore.updateFilters(collectionAddress, { collectionAddress });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionData]);

  const { showFilters, filters, toggleFilter, resetFilters, updateFilters } =
    useMemo(() => {
      const collectionAddress = collectionData?.collection.address;
      const hasCollectionFilters =
        !!collectionAddress && !!filterStore[collectionAddress];

      return {
        showFilters: hasCollectionFilters
          ? filterStore[collectionAddress].showFilters
          : false,
        filters: hasCollectionFilters
          ? filterStore[collectionAddress].filters
          : {},
        createFiltersForCollection: filterStore.createFiltersForCollection,
        toggleFilter: (bool?: boolean) =>
          filterStore.toggleFilter(collectionAddress as Address, bool),
        setFilters: (filters: APIParams.FetchNFTs) =>
          filterStore.setFilters(collectionAddress as Address, filters),
        updateFilters: (filters: Partial<APIParams.FetchNFTs>) =>
          filterStore.updateFilters(collectionAddress as Address, filters),
        resetFilters: () =>
          filterStore.resetFilters(collectionAddress as Address),
      };
    }, [filterStore, collectionData]);

  const {
    error: listError,
    isLoading,
    setSize,
    size,
    data,
  } = useGetNFTs(filters);

  const { isLoadingMore, list: items } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  return (
    <div className="mt-10 desktop:px-20 tablet:px-20 px-4">
      <FiltersSectionCollection
        showFilters={showFilters}
        toggleFilter={() => toggleFilter()}
        activeFilters={filters}
        onSearch={(name) => updateFilters({ name })}
      />
      <div className="flex gap-4 desktop:flex-row flex-col">
        <NFTsList
          isLoading={isLoading}
          isLoadMore={isLoadingMore}
          filters={["status", "price"]}
          activeFilters={filters}
          onResetFilters={resetFilters}
          onApplyFilters={updateFilters}
          showFilters={showFilters}
          items={items.concatenatedData}
          currentHasNext={items.currentHasNext}
          traitFilters={collectionData?.traitAvailable}
          onClose={() => toggleFilter(false)}
          dataCollectionType={collectionData?.collection.type}
          showCreateNFT
          userId={
            collectionData?.collection?.creators[0]
              ? collectionData.collection?.creators[0].userId
              : ""
          }
          error={listError}
        />
      </div>
      <CollectionTaskbar />
    </div>
  );
}
