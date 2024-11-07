import { useFilterByUser } from "@/store/filters/byUser/store";
import { useCallback, useMemo } from "react";
import { APIParams } from "@/services/api/types";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Address } from "abitype";
import { useGetNFTs } from "./useQuery";

export const useFetchNFTsByUser = (
  wallet: Address,
  mode: "created" | "owned" | "onSale"
) => {
  const filterStore = useFilterByUser();
  // const { showFilters, filters, toggleFilter, resetFilters, updateFilters } =
  //   useMemo(() => {
  //     console.log(mode);
  //     return {
  //       showFilters: filterStore[wallet]?.[mode].showFilters,
  //       filters: filterStore[wallet]?.[mode].filters || {},
  //       toggleFilter: (bool?: boolean) =>
  //         filterStore.toggleFilter(mode, wallet, bool),
  //       setFilters: (filters: APIParams.FetchNFTs) =>
  //         filterStore.setFilters(mode, wallet, filters),
  //       updateFilters: (filters: Partial<APIParams.FetchNFTs>) =>
  //         filterStore.updateFilters(mode, wallet, filters),
  //       resetFilters: () => filterStore.resetFilters(mode, wallet),
  //     };
  //   }, [filterStore, mode, wallet]);

  const showFilters = filterStore[wallet]?.[mode]?.showFilters || false;
  const filters = filterStore[wallet]?.[mode]?.filters || {};

  const toggleFilter = useCallback(
    (bool?: boolean) => filterStore.toggleFilter(mode, wallet, bool),
    [filterStore, mode, wallet]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<APIParams.FetchNFTs>) =>
      filterStore.updateFilters(mode, wallet, newFilters),
    [filterStore, mode, wallet]
  );

  const resetFilters = useCallback(() => {
    filterStore.resetFilters(mode, wallet);
  }, [filterStore, mode, wallet]);

  const { error, isLoading, setSize, size, data, mutate } = useGetNFTs(filters);
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
    mutate,
  };
};
