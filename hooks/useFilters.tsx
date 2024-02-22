import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui/store';
import { APIParams } from '@/services/api/types';
import { parseEther } from 'ethers';
import { FilterKey, SearchKey } from '@/store/ui/types';
import { sanitizeObject } from '@/utils';
import { useCollectionsFiltersStore } from '@/store/filters/collections/store';
import { toast } from 'react-toastify';

export const useExploreSectionFilters = () => {
  const pathname = usePathname();
  const {
    showFilters: showCollectionsFilters,
    toggleFilter: toggleCollectionsFilters
  } = useCollectionsFiltersStore(state => state);
  const { showFilters, toggleFilter, queryString, setQueryString } = useUIStore(
    (state) => state
  );

  const routeKey: FilterKey = useMemo(() => {
    switch (true) {
    case pathname.includes('collections'):
      return 'collections';
    case pathname.includes('profile'):
      return 'profile';
    case pathname.includes('items'):
    default:
      return 'nfts';
    }
  }, [pathname]);

  const searchKey: SearchKey = useMemo(() => {
    switch (true) {
    case pathname.includes('collection'):
      return 'collection';
    case pathname.includes('collections'):
      return 'collections';
    case pathname.includes('users'):
      return 'users';
    case pathname.includes('items'):
    default:
      return 'nfts';
    }
  }, [pathname]);

  const isFiltersVisible = useMemo(() => {
    switch (true) {
    case pathname.includes('collections'):
      return showCollectionsFilters;
    case pathname.includes('items'):
      return false;
    default:
      return false;
    }
  }, [showFilters, routeKey]);

  const handleToggleFilters = () => {
    switch (true) {
    case pathname.includes('collections'):
      return toggleCollectionsFilters();
    case pathname.includes('items'):
      return false;
    default:
      return null;
    }
  };

  const query = useMemo(() => queryString[searchKey], [queryString, searchKey]);

  return {
    isFiltersVisible,
    routeKey,
    handleToggleFilters,
    searchKey,
    query,
    setQueryString
  };
};

export const useNFTFilters = (defaultState?: APIParams.FetchNFTs) => {
  const [activeFilters, setActiveFilters] = useState<APIParams.FetchNFTs>(
    defaultState ?? {
      page: 1,
      limit: 5,
      traits: undefined,
      collectionAddress: undefined,
      creatorAddress: undefined,
      priceMax: undefined,
      priceMin: undefined,
      sellStatus: undefined,
      owner: undefined
    }
  );

  const handleApplyFilters = (params: APIParams.FetchNFTs) => {
    const _activeFilters = {
      ...activeFilters,
      ...params,
      page: 1,
      limit: 20
    };

    if (params.priceMax && !isNaN(Number(params.priceMax))) {
      _activeFilters.priceMax = parseEther(
        params.priceMax.toString()
      ).toString();
    }
    if (params.priceMin && !isNaN(Number(params.priceMin))) {
      _activeFilters.priceMin = parseEther(
        params.priceMin.toString()
      ).toString();
    }

    _activeFilters.sellStatus =
      Number(params.priceMin) || Number(params.priceMax)
        ? 'AskNew'
        : params.sellStatus;

    setActiveFilters(sanitizeObject(_activeFilters));
  };

  const handleLoadMore = (page: number) => {
    setActiveFilters({
      ...activeFilters,
      page
    });
  };

  return {
    activeFilters,
    handleLoadMore,
    handleApplyFilters
  };
};

export const useCollectionFilters = (
  showFilters?: boolean,
  activeFilters?: APIParams.FetchCollections,
  onApplyFilters?: (filters: APIParams.FetchCollections) => void
) => {
  // const { filters: activeFilters, setFilters } = useCollectionsFiltersStore(state => state);
  //
  // const handleLoadMore = (page: number) => setFilters({ page });
  const [localFilters, setLocalFilters] = useState<APIParams.FetchCollections>({
    min: activeFilters?.min,
    max: activeFilters?.max
  });
  const [error, setError] = useState<boolean>(false);

  const handlePriceInput = (key: keyof typeof localFilters, value: any) => {
    setLocalFilters(prevState => ({ ...prevState, [key]: value }));
  };

  const handleApplyFilters = () => {
    const { min, max } = localFilters;
    if (
      (min !== '' && min !== undefined) ||
      (max !== '' && max !== undefined)
    ) {
      if (
        (isNaN(Number(min)) && !!min) ||
        (isNaN(Number(max)) && !!max)
      ) {
        toast.warning('Please input a valid number');
        return setError(true);
      }

      if (Number(min) < 0 || Number(max) < 0) {
        toast.warning('Price cannot be negative');
        return setError(true);
      }

      if (Number(min) > Number(max) && Number(max) >= 0) {
        toast.warning('Minimum price cannot be greater than maximum one');
        return setError(true);
      }
    }

    setError(false);
    onApplyFilters?.(localFilters);
  };

  useEffect(() => {
    console.log(activeFilters);
    handlePriceInput('min', activeFilters?.min);
    handlePriceInput('max', activeFilters?.max);
  }, [activeFilters]);

  return {
    localFilters,
    handleApplyFilters,
    handlePriceInput,
    error
  };
};
