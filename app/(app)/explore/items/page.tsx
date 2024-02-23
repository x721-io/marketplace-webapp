'use client';

import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import { useExploreSectionFilters, useNFTFilters } from '@/hooks/useFilters';
import NFTsList from '@/components/List/NFTsList';
import { APIParams, APIResponse } from '@/services/api/types';
import { sanitizeObject } from '@/utils';
import { useUIStore } from '@/store/ui/store';
import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';
import FetchNFTs = APIResponse.FetchNFTs;
import { useNFTsFiltersStore } from '@/store/filters/items/store';

export default function ExploreNFTsPage() {
  const {
    showFilters,
    toggleFilter,
    filters,
    updateFilters,
    resetFilters
  } = useNFTsFiltersStore()
  const api = useMarketplaceApi();

  const { data, size, isLoading, setSize, error } = useSWRInfinite(
    (index) => {
      const queryParams = {
        ...filters,
        page: index + 1
      }
      return ['fetchNFTs', queryParams];
    },
    ([key, params]) =>
      api.fetchNFTs(
        sanitizeObject(params) as APIParams.FetchNFTs
      )
  );

  const items = useMemo(() => {
    let currentHasNext = false;
    let concatenatedData: any[] = [];

    if (data) {
      concatenatedData = data.reduce(
        (prevData: any[], currentPage: FetchNFTs) => [
          ...prevData,
          ...currentPage.data
        ],
        []
      );
      const hasNextArray = data.map(
        (currentPage: FetchNFTs) => currentPage.paging
      );
      currentHasNext = hasNextArray[data.length - 1].hasNext;
    }

    return { concatenatedData, currentHasNext };
  }, [data]);

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  return (
    <NFTsList
      paging={size}
      onClose={() => toggleFilter(false)}
      loading={isLoadingMore}
      activeFilters={filters}
      onApplyFilters={updateFilters}
      onResetFilters={resetFilters}
      onLoadMore={setSize}
      showFilters={showFilters}
      items={items.concatenatedData}
      currentHasNext={items.currentHasNext}
      error={error}
    />
  );
}
