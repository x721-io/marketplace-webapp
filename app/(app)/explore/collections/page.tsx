"use client";

import { useCollectionFilters, useExploreSectionFilters, } from "@/hooks/useFilters";
import CollectionFilters from "@/components/Filters/CollectionFilters";
import CollectionsList from "@/components/List/CollectionsList";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { useUIStore } from "@/store/ui/store";
import { sanitizeObject } from "@/utils";
import { APIParams } from "@/services/api/types";
import React, { useMemo } from 'react';
import { isMobile } from "react-device-detect";
import MobileCollectionFiltersModal from "@/components/Modal/MobileCollectionFiltersModal";
import useSWRInfinite from "swr/infinite";


interface Collection {
  data: any[];
  paging: any;
}

export default function ExploreCollectionsPage() {
  const { isFiltersVisible, handleToggleFilters } = useExploreSectionFilters();
  const api = useMarketplaceApi();
  const { activeFilters, handleApplyFilters } =
    useCollectionFilters();
  const { queryString } = useUIStore((state) => state);
  const { searchKey } = useExploreSectionFilters();

  const {
    data,
    size,
    isLoading,
    setSize,
  } = useSWRInfinite(
      (index) => {
        const queryParams = !!queryString[searchKey]
            ? { ...activeFilters, name: queryString[searchKey], page: 1 }
            : {
          ...activeFilters,
            name: queryString[searchKey],
            page: index + 1
        };
        return ['fetchCollections', queryParams];
      },
      ([key, params]) =>
          api.fetchCollections(sanitizeObject(params) as APIParams.FetchCollections),

  );

  const collections = useMemo(() => {
    let currentHasNext = false;
    let concatenatedData: any[] = [];

    if (data) {
      concatenatedData = data.reduce(
          (prevData: any[], currentPage: Collection) => [...prevData, ...currentPage.data],
          []
      );
      const hasNextArray = data.map((currentPage: Collection) => currentPage.paging);
      currentHasNext = hasNextArray[data.length - 1].hasNext;
    }

    return { concatenatedData, currentHasNext };
  }, [data]);

  const isLoadingMore =
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");


  return (
    <div className="flex gap-6 flex-col desktop:flex-row">
      {isMobile ? (
        <MobileCollectionFiltersModal
          onApplyFilters={handleApplyFilters}
          showFilter={isFiltersVisible}
          closeFilter={handleToggleFilters}
        />
      ) : (
        isFiltersVisible && (
          <CollectionFilters
            visible={isFiltersVisible}
            onApplyFilters={handleApplyFilters}
          />
        )
      )}
      <div className="flex-1">
        <CollectionsList
          loading={isLoadingMore}
          collections={collections.concatenatedData}
          paging={size}
          onLoadMore={setSize}
          showFilter={isFiltersVisible}
          currentHasNext={collections.currentHasNext}
        />
      </div>
    </div>
  );
}
