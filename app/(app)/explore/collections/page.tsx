'use client';

import {
  useExploreSectionFilters
} from '@/hooks/useFilters';
import CollectionFilters from '@/components/Filters/CollectionFilters';
import CollectionsList from '@/components/List/CollectionsList';
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import { useUIStore } from '@/store/ui/store';
import { sanitizeObject } from '@/utils';
import { APIParams } from '@/services/api/types';
import React, { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import MobileCollectionFiltersModal from '@/components/Filters/MobileCollectionFiltersModal';
import useSWRInfinite from 'swr/infinite';
import { useCollectionsFiltersStore } from '@/store/filters/collections/store';

interface Collection {
  data: any[];
  paging: any;
}

export default function ExploreCollectionsPage() {
  const {
    showFilters,
    toggleFilter,
    filters,
    updateFilters,
    resetFilters
  } = useCollectionsFiltersStore(state => state);
  const api = useMarketplaceApi();

  const { data, size, isLoading, setSize } = useSWRInfinite(
    (index) => {
      const queryParams = {
        ...filters,
        page: index + 1
      };
      return ['fetchCollections', queryParams];
    },
    ([key, params]) =>
      api.fetchCollections(
        sanitizeObject(params) as APIParams.FetchCollections
      )
  );

  const collections = useMemo(() => {
    let currentHasNext = false;
    let concatenatedData: any[] = [];

    if (data) {
      concatenatedData = data.reduce(
        (prevData: any[], currentPage: Collection) => [
          ...prevData,
          ...currentPage.data
        ],
        []
      );
      const hasNextArray = data.map(
        (currentPage: Collection) => currentPage.paging
      );
      currentHasNext = hasNextArray[data.length - 1].hasNext;
    }

    return { concatenatedData, currentHasNext };
  }, [data]);

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');

  return (
    <div className="flex gap-6 flex-col desktop:flex-row">
      {isMobile ?
        <MobileCollectionFiltersModal
          onApplyFilters={updateFilters}
          show={showFilters}
          activeFilters={filters}
          onResetFilters={resetFilters}
          onClose={() => toggleFilter(false)}
        />
        :
        <CollectionFilters
          activeFilters={filters}
          onApplyFilters={updateFilters}
          showFilters={showFilters}
          onResetFilters={resetFilters}
        />
      }

      <div className="flex-1">
        <CollectionsList
          loading={isLoadingMore}
          collections={collections.concatenatedData}
          paging={size}
          onLoadMore={setSize}
          showFilter={showFilters}
          currentHasNext={collections.currentHasNext}
        />
      </div>
    </div>
  );
}
