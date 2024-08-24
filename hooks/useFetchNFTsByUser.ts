import { useFilterByUser } from "@/store/filters/byUser/store";
import { useMemo } from "react";
import { APIParams } from "@/services/api/types";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Address } from "wagmi";
import { useGetNFTs } from "./useQuery";

export const useFetchNFTsByUser = (
  wallet: Address,
  mode: "created" | "owned" | "onSale"
) => {
  const filterStore = useFilterByUser();
  const { showFilters, filters, toggleFilter, resetFilters, updateFilters } =
    useMemo(() => {
      return {
        showFilters: filterStore[wallet]?.[mode].showFilters,
        filters: filterStore[wallet]?.[mode].filters || {},
        toggleFilter: (bool?: boolean) =>
          filterStore.toggleFilter(mode, wallet, bool),
        setFilters: (filters: APIParams.FetchNFTs) =>
          filterStore.setFilters(mode, wallet, filters),
        updateFilters: (filters: Partial<APIParams.FetchNFTs>) =>
          filterStore.updateFilters(mode, wallet, filters),
        resetFilters: () => filterStore.resetFilters(mode, wallet),
      };
    }, [filterStore, wallet]);

  const { error, isLoading, setSize, size, data } = useGetNFTs(filters);
  const { isLoadingMore, list: items } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  return {
    isLoadingMore,
    isLoading,
    items,
    showFilters,
    filters,
    error,
    toggleFilter,
    resetFilters,
    updateFilters,
  };
};
