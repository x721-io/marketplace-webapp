"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { APIParams, APIResponse } from "@/services/api/types";
import NFTsList from "@/components/List/NFTsList";
import Toggle from "react-toggle";
import BannerSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/BannerSection";
import InformationSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/InformationSection";
import FiltersSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/FiltersCollectionSection";
import {
  getCollectionAvatarImage,
  getCollectionBannerImage,
} from "@/utils/string";
import { useFilterByCollection } from "@/store/filters/byCollection/store";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Address } from "wagmi";
import { useGetNFTs } from "@/hooks/useQuery";
import "react-toggle/style.css";

export default function CollectionView({
  collectionData,
}: {
  collectionData: APIResponse.CollectionDetails;
}) {
  const router = useRouter();
  const filterStore = useFilterByCollection((state) => state);
  const [isInitial, setInitial] = useState(true);
  const [isSweeping, setSweeping] = useState(false) 

  useEffect(() => {
    const collectionAddress = collectionData.collection.address;
    filterStore.createFiltersForCollection(collectionAddress);
    filterStore.updateFilters(collectionAddress, { collectionAddress });
    setInitial(false);
  }, []);

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
  } = useGetNFTs(filters, !isInitial);

  const { isLoadingMore, list: items } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  return (
    <div className="w-full relative">
      <BannerSectionCollection
        onUpdateSuccess={() => router.refresh()}
        collectionId={collectionData.collection.id}
        creators={collectionData.collection.creators}
        cover={getCollectionBannerImage(collectionData.collection)}
        avatar={getCollectionAvatarImage(collectionData.collection)}
      />

      <InformationSectionCollection data={collectionData} />

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
            traitFilters={collectionData.traitAvailable}
            onClose={() => toggleFilter(false)}
            dataCollectionType={collectionData.collection.type}
            showCreateNFT
            userId={
              collectionData.collection?.creators[0]
                ? collectionData.collection?.creators[0].userId
                : ""
            }
            error={listError}
          />
        </div>
      </div>

      <div className="fixed w-full h-[80px] bg-[white] bottom-0 left-0 z-[100] border-solid border-t-[1px] flex items-center px-16 gap-5">
        <div className='text-lg font-semibold text-[black]'>Sweep</div>
        <Toggle
          defaultChecked={isSweeping}
          checked={isSweeping}
          icons={false}
          onChange={() => setSweeping(!isSweeping)}
        />
      </div>
    </div>
  );
}