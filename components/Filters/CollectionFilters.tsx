'use client';

import Text from '@/components/Text';
import Input from '@/components/Form/Input';
import Button from '@/components/Button';
import { APIParams } from '@/services/api/types';
import React from 'react';
import Collapsible from '../Collapsible';
import { BrowserView } from 'react-device-detect';
import { classNames } from '@/utils/string';
import { useCollectionFilters } from '@/hooks/useFilters';
import Icon from '@/components/Icon';

export interface CollectionProps {
  showFilters?: boolean;
  onApplyFilters?: (filters: APIParams.FetchCollections) => void;
  activeFilters?: APIParams.FetchCollections;
  onResetFilters?: () => void;
  containerClass?: string;
}

export default function CollectionFilters({
  onApplyFilters,
  showFilters,
  onResetFilters,
  activeFilters,
  containerClass
}: CollectionProps) {
  const {
    handlePriceInput,
    handleApplyFilters,
    localFilters,
    error
  } = useCollectionFilters(showFilters, activeFilters, onApplyFilters);

  if (!showFilters) return null;

  return (
    <>
      <div className={classNames('w-72 flex flex-col', containerClass)}>
        <Collapsible isOpen header="Floor Price" className="rounded-2xl border">
          <div className="flex items-center gap-4 mb-4">
            <Input
              value={localFilters.min}
              onChange={(e) => handlePriceInput('min', e.target.value)}
              containerClass="w-24"
              scale="sm"
              placeholder="Min"
              error={error}
            />
            <Text className="text-primary">to</Text>
            <Input
              value={localFilters.max}
              onChange={(e) => handlePriceInput('max', e.target.value)}
              containerClass="w-24"
              scale="sm"
              placeholder="Max"
              error={error}
            />
          </div>

          <Button variant="secondary" className="w-full" onClick={() => {
            handlePriceInput('min', '')
            handlePriceInput('max', '')
            onResetFilters?.();
          }}>
            Clear Filters <Icon name="close" width={20} height={20} />
          </Button>

          <Button
            className="w-full mt-3"
            variant="primary"
            onClick={handleApplyFilters}
          >
            Apply
          </Button>
        </Collapsible>
      </div>
    </>
  );
}
