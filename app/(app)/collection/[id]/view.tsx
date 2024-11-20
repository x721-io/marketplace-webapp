"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { APIParams, APIResponse } from "@/services/api/types";
import NFTsList from "@/components/List/NFTsList";
import BannerSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/BannerSection";
import InformationSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/InformationSection";
import FiltersSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/FiltersCollectionSection";
import {
  getCollectionAvatarImage,
  getCollectionBannerImage,
} from "@/utils/string";
import { useFilterByCollection } from "@/store/filters/byCollection/store";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGetNFTs } from "@/hooks/useQuery";
import { Address } from "abitype";
import useSWR from "swr";
import { API_ENDPOINTS } from "@/config/api";
import { nextAPI } from "@/services/api";
import MySpinner from "@/components/X721UIKits/Spinner";

const getCollectionData = async (
  id: string
): Promise<
  | { status: "success"; data: APIResponse.CollectionDetails | null }
  | { status: "error" }
> => {
  try {
    const data = (await nextAPI.get(
      `${API_ENDPOINTS.COLLECTIONS + `/${id}`}`
    )) as { data: { data: APIResponse.CollectionDetails | null } };

    return {
      status: "success",
      data: data.data.data,
    };
  } catch (err) {
    return {
      status: "error",
    };
  }
};

export default function CollectionView() {
  const { id } = useParams();
  const {
    data: collectionData,
    mutate,
    isLoading: isLoadingCollectionDetails,
  } = useSWR(id ? `/api/collections/${id}` : null, async () => {
    const data = await getCollectionData(id as string);
    if (data.status === "success") {
      return data.data;
    }
    return null;
  });
  const router = useRouter();
  const filterStore = useFilterByCollection((state) => state);

  useEffect(() => {
    if (collectionData) {
      const collectionAddress = collectionData.collection.address;
      filterStore.createFiltersForCollection(collectionAddress);
      filterStore.updateFilters(collectionAddress, { collectionAddress });
    }
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

  if (isLoadingCollectionDetails) {
    return (
      <div className="w-full flex items-center justify-center pt-20">
        <MySpinner />
      </div>
    );
  } else {
    if (!collectionData) {
      return (
        <div className="flex flex-col items-center justify-center pt-32">
          <h1 className="text-2xl font-bold">Collection not found</h1>
          <button
            onClick={() => router.push("/explore/collections")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded mt-4"
          >
            Explore more collections
          </button>
        </div>
      );
    }
    return (
      <div className="w-full relative overflow-x-hidden">
        <BannerSectionCollection
          onUpdateSuccess={() => mutate()}
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
      </div>
    );
  }
}
