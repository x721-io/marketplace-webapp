"use client";

import {
  useCollectionFilters,
  useExploreSectionFilters,
} from "@/hooks/useFilters";
import CollectionFilters from "@/components/Filters/CollectionFilters";
import CollectionsList from "@/components/List/CollectionsList";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { useUIStore } from "@/store/ui/store";
import useSWR from "swr";
import { sanitizeObject } from "@/utils";
import { APIParams } from "@/services/api/types";
import React, { useEffect, useMemo, useState } from 'react';
import { isMobile } from "react-device-detect";
import MobileCollectionFiltersModal from "@/components/Modal/MobileCollectionFiltersModal";
import useSWRInfinite from "swr/infinite";

export default function ExploreCollectionsPage() {
  const [showFilters, setShowFilters] = useState(false);

  const api = useMarketplaceApi();

  const { activeFilters, handleApplyFilters, handleChangePage } =
    useCollectionFilters();

  const { queryString } = useUIStore((state) => state);
  const { searchKey } = useExploreSectionFilters();
  const {
    data: collections,
    error,
    isLoading,
      mutate
  } = useSWR(
    !!queryString[searchKey]
      ? { ...activeFilters, name: queryString[searchKey], page: 1 }
      : { ...activeFilters, name: queryString[searchKey]},
    (params) =>
      api.fetchCollections(
        sanitizeObject(params) as APIParams.FetchCollections,
      ),
    { refreshInterval: 10000 },
  );


  const {
    data,
    size, // size là current page number
    setSize, // Hàm setSize là để change page
  } = useSWRInfinite(
      (index) => { // Index này nhìn phải hiểu nó chính là page, nó map value từ biến size của hook
        const queryParams = !!queryString[searchKey]
            ? { ...activeFilters, name: queryString[searchKey], page: 1 } // Case này khi user gõ input để tìm kiếm thì reset page về 1
            : {
          ...activeFilters,
            name: queryString[searchKey],
            page: index + 1 // Apply next page ở đây
        };

        return ['fetchCollections', queryParams];

      },
      ([key, params]) =>
          api.fetchCollections(sanitizeObject(params) as APIParams.FetchCollections),
      { refreshInterval: 10000 ,parallel : true}
  );

  useEffect(()=>{
    console.log("vvvvvvv",data)
    // Do trong examples data dạng array nên có thể concat trực tiếp data luôn
    // Còn data của mình là
    // {
    //   data: Collection[],
    //     paging: Paging
    // }
    // Nên phải map data sang data.data để concat
    // => concat(...data.data)

  },[data])










  const handleLoadMore = () => {
    setSize((prevSize) => prevSize + 1);
  };

  // useEffect(() => {
  // const handleFetchMore = async () => {
  //   const nextPage = collections.paging?.page + 1; // Increment the page for the next fetch
  //
  //   try {
  //     const queryParams = !!queryString[searchKey]
  //         ? { ...activeFilters, name: queryString[searchKey], page: nextPage }
  //         : { ...activeFilters, name: queryString[searchKey], page: nextPage };
  //
  //     // Update local state with the new data
  //     await mutate(['fetchCollections', queryParams], (prevData: any) => ({
  //       ...prevData,
  //       data: [...(prevData?.data || []), ...(collections || [])],
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching more data:', error);
  //   }
  //   handleFetchMore();
  // }},[collections]);



  const { isFiltersVisible, handleToggleFilters } = useExploreSectionFilters();

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
          loading={isLoading}
          collections={collections?.data}
          paging={collections?.paging}
          onChangePage={handleChangePage}
          // Thay onChangePage bằng cái này onLoadMore={handleLoadMore}
          showFilter={isFiltersVisible}
        />
      </div>

        {/*<button onClick={() => setSize(size + 1)}>Load More</button>*/}
    </div>
  );
}
