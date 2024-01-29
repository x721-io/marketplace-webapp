"use client";

import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import useSWR from "swr";
import { useExploreSectionFilters, useNFTFilters } from "@/hooks/useFilters";
import NFTsList from "@/components/List/NFTsList";
import { APIParams } from "@/services/api/types";
import { sanitizeObject } from "@/utils";
import { useUIStore } from "@/store/ui/store";

export default function ExploreNFTsPage() {
  const api = useMarketplaceApi();
  const { isFiltersVisible, handleToggleFilters } = useExploreSectionFilters();
  const { activeFilters, handleApplyFilters, handleChangePage } =
    useNFTFilters();

  const { queryString } = useUIStore((state) => state);
  const { searchKey } = useExploreSectionFilters();

  const { data, isLoading } = useSWR(
    !!queryString[searchKey]
      ? { ...activeFilters, name: queryString[searchKey], page: 1 }
      : { ...activeFilters, name: queryString[searchKey] },
    (params) => api.fetchNFTs(sanitizeObject(params) as APIParams.FetchNFTs),
    { refreshInterval: 5000 },
  );

  return (
    <NFTsList
      loading={isLoading}
      onApplyFilters={handleApplyFilters}
      onChangePage={handleChangePage}
      showFilters={isFiltersVisible}
      items={data?.data}
      paging={data?.paging}
      onClose={handleToggleFilters}
    />
  );
}
