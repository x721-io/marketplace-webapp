"use client";

import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import Button from "@/components/Button";
import { APIParams } from "@/services/api/types";
import React, { useState } from "react";
import Collapsible from "../Collapsible";
import { classNames } from "@/utils/string";
import { useCollectionStatisticsFilters } from "@/hooks/useFilters";
import Icon from "@/components/Icon";
import Select from "../Form/Select";
import { tokenOptions } from "@/config/tokens";
import { Address } from "abitype";
import MyRadio from "../X721UIKits/Radio";
import { Label } from "flowbite-react";

export interface CollectionStatisticsFiltersProps {
  showFilters: boolean;
  onApplyFilters: (filters: APIParams.FetchCollectionsStatistics) => void;
  activeFilters: APIParams.FetchCollectionsStatistics;
  onResetFilters?: () => void;
  containerClass?: string;
}

export default function CollectionStatisticsFilters({
  onApplyFilters,
  showFilters,
  onResetFilters,
  activeFilters,
  containerClass,
}: CollectionStatisticsFiltersProps) {
  const { setLocalFilters, handleApplyFilters, localFilters } =
    useCollectionStatisticsFilters(activeFilters, onApplyFilters);

  if (!showFilters) return null;

  return (
    <>
      <div
        className={classNames(
          "w-full tablet:w-72 flex flex-col",
          containerClass
        )}
      >
        <Collapsible isOpen header="" className="rounded-2xl border">
          <div className="flex items-center gap-7 flex-wrap mb-5">
            <div className="flex gap-3 items-center">
              <MyRadio
                checked={localFilters.minMaxBy === "volume"}
                onChange={() =>
                  setLocalFilters((state) => ({ ...state, minMaxBy: "volume" }))
                }
                id="type-all"
                value=""
              />
              <Label htmlFor="type-all">Volume</Label>
            </div>
            <div className="flex gap-3 items-center">
              <MyRadio
                id="type-single"
                value="ERC721"
                checked={localFilters.minMaxBy === "floorPrice"}
                onChange={() =>
                  setLocalFilters((state) => ({
                    ...state,
                    minMaxBy: "floorPrice",
                  }))
                }
              />
              <Label htmlFor="type-single">Floor price</Label>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Input
              value={localFilters.min}
              onChange={(e) =>
                setLocalFilters((state) => ({ ...state, min: e.target.value }))
              }
              containerClass="w-24"
              scale="sm"
              placeholder="Min"
            />
            <Text className="text-primary">to</Text>
            <Input
              value={localFilters.max}
              onChange={(e) =>
                setLocalFilters((state) => ({ ...state, max: e.target.value }))
              }
              containerClass="w-24"
              scale="sm"
              placeholder="Max"
            />
            {/* <Select 
              options={tokenOptions} 
              containerClass="w-full" scale='sm'
              value={localFilters.quoteToken}
              onChange={(e) => setLocalFilters(state => ({ ...state, quoteToken: e.target.value as Address }))}
            /> */}
          </div>

          <Button
            variant="outlined"
            scale="sm"
            className="w-full"
            onClick={() => {
              setLocalFilters({ min: "", max: "", minMaxBy: "volume" });
              onResetFilters?.();
            }}
          >
            Reset <Icon name="refresh" width={12} height={12} />
          </Button>

          <Button
            scale="sm"
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
