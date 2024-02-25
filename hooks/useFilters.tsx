import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui/store';
import { APIParams } from '@/services/api/types';
import { parseEther } from 'ethers';
import { FilterKey, SearchKey } from '@/store/ui/types';
import { sanitizeObject } from '@/utils';
import { useCollectionFiltersStore } from '@/store/filters/collections/store';
import { toast } from 'react-toastify';
import { Trait } from '@/types';

export const useExploreSectionFilters = () => {
  const pathname = usePathname();
  const {
    showFilters: showCollectionFilters,
    toggleFilter: toggleCollectionFilters
  } = useCollectionFiltersStore(state => state);
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
      return showCollectionFilters;
    case pathname.includes('items'):
      return false;
    default:
      return false;
    }
  }, [showFilters, routeKey]);

  const handleToggleFilters = () => {
    switch (true) {
    case pathname.includes('collections'):
      return toggleCollectionFilters();
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

export const useNFTFilters = (
  activeFilters: APIParams.FetchNFTs,
  onApplyFilters?: (filters: APIParams.FetchNFTs) => void
) => {
  const [localFilters, setLocalFilters] = useState<APIParams.FetchNFTs>(activeFilters);

  const handleChange = ({ updateOnChange, ...params } : Partial<APIParams.FetchNFTs> & { updateOnChange?: boolean }) => {
    const newFilters = { ...localFilters, ...params };
    setLocalFilters(newFilters);
    if (updateOnChange) {
      // Trigger immediately on input
      onApplyFilters?.(newFilters);
    }
  };

  const handleApplyFilters = () => {
    const { priceMax, priceMin } = localFilters
    if (
      (priceMin !== '' && priceMin !== undefined) ||
      (priceMax !== '' && priceMax !== undefined)
    ) {
      if (
        (isNaN(Number(priceMin)) && !!priceMin) ||
        (isNaN(Number(priceMax)) && !!priceMax)
      ) {
        return toast.error('Please input a valid number');
      }

      if (Number(priceMin) < 0 || Number(priceMax) < 0) {
        return toast.error('Price cannot be negative');
      }

      if (Number(priceMin) > Number(priceMax) && priceMax?.trim() !== '') {
        return toast.error('Minimum price cannot be greater than maximum one');
      }
    }
    onApplyFilters?.(sanitizeObject(localFilters));
  };

  const isTraitSelected = useCallback(
    (key: string, value: string) => {
      const traits = activeFilters.traits;
      return traits?.some((t: Trait) => {
        return t.trait_type === key && t.value === value;
      });
    },
    [activeFilters]
  );

  const handleSelectTrait = (key: string, value: any, updateOnChange?: boolean) => {
    const selectedTraits = localFilters.traits ? [...localFilters.traits] : [];
    const isExist = isTraitSelected(key, value);

    if (isExist) {
      const index = selectedTraits.findIndex((t) => t.trait_type === key);
      selectedTraits.splice(index, 1);
    } else {
      selectedTraits.push({
        trait_type: key,
        value
      });
    }

    handleChange({ traits: selectedTraits, updateOnChange });
  };

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  return {
    localFilters,
    isTraitSelected,
    handleChange,
    handleApplyFilters,
    handleSelectTrait
  };
};

export const useCollectionFilters = (
  activeFilters: APIParams.FetchCollections,
  onApplyFilters?: (filters: APIParams.FetchCollections) => void
) => {
  const [localFilters, setLocalFilters] = useState<APIParams.FetchCollections>(activeFilters);

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
        return toast.error('Please input a valid number');
      }

      if (Number(min) < 0 || Number(max) < 0) {
        return toast.error('Price cannot be negative');
      }

      if (Number(min) > Number(max) && max?.trim() !== '') {
        return toast.error('Minimum price cannot be greater than maximum one');
      }
    }

    onApplyFilters?.(localFilters);
  };

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  return {
    localFilters,
    handleApplyFilters,
    setLocalFilters
  };
};
