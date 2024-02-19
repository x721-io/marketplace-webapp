"use client";

import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { useExploreSectionFilters, useNFTFilters } from "@/hooks/useFilters";
import NFTsList from "@/components/List/NFTsList";
import { APIParams, APIResponse } from "@/services/api/types";
import { sanitizeObject } from "@/utils";
import { useUIStore } from "@/store/ui/store";
import useSWRInfinite from "swr/infinite";
import { useMemo } from "react";
import FetchNFTs = APIResponse.FetchNFTs;


export default function ExploreNFTsPage() {
  const api = useMarketplaceApi();
  const { isFiltersVisible, handleToggleFilters } = useExploreSectionFilters();
  const { activeFilters, handleApplyFilters } = useNFTFilters();
  const { queryString } = useUIStore((state) => state);
  const { searchKey } = useExploreSectionFilters();


  const { data, size, isLoading, setSize, error } = useSWRInfinite(
      (index) => {
        const queryParams = !!queryString[searchKey]
            ? { ...activeFilters, name: queryString[searchKey], page: 1 }
            : {
              ...activeFilters,
              name: queryString[searchKey],
              page: index + 1,
            };
        return ["fetchUsers", queryParams];
      },
      ([key, params]) =>
          api.fetchNFTs(
              sanitizeObject(params) as APIParams.FetchNFTs,
          ),
  );


  const items = useMemo(() => {
    let currentHasNext = false;
    let concatenatedData: any[] = [];

    if (data) {
      concatenatedData = data.reduce(
          (prevData: any[], currentPage: FetchNFTs) => [
            ...prevData,
            ...currentPage.data,
          ],
          [],
      );
      const hasNextArray = data.map(
          (currentPage: FetchNFTs) => currentPage.paging,
      );
      currentHasNext = hasNextArray[data.length - 1].hasNext;
    }

    return { concatenatedData, currentHasNext };
  }, [data]);

  const isLoadingMore =
      isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");


  return (
      <NFTsList
          paging={size}
          onClose={handleToggleFilters}
          loading={isLoadingMore}
          onApplyFilters={handleApplyFilters}
          onLoadMore={setSize}
          showFilters={isFiltersVisible}
          items={items.concatenatedData}
          currentHasNext={items.currentHasNext}
          error={error}
      />
  );
}
