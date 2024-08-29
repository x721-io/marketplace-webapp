"use client";

import StatisticsHeader from "./header";
import CollectionsDesktop from "./collections-desktop";
import { isMobile } from "react-device-detect";
import CollectionsMobile from "./collections-mobile";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnalysisModeSort, AnalysisType } from "@/types";
import { useGetCollectionsAnalysis } from "@/hooks/useQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import CollectionStatisticsFilters from "../Filters/CollectionStatisticsFilters";
import { APIParams } from "@/services/api/types";
import MobileCollectionStatisticsFiltersModal from "../Filters/MobileCollectionStatisticsFiltersModal";

type Props = {
  isInfinite?: boolean;
  disableFilters?: boolean;
};

const Statistics: React.FC<Props> = ({
  isInfinite = false,
  disableFilters = false,
}) => {
  const [currentSorting, setCurrentSorting] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filters, setFilters] = useState<APIParams.FetchCollectionsStatistics>({
    type: AnalysisType.ONEDAY,
    page: 1,
    limit: 10,
  });
  const [isShowFilters, setShowFilters] = useState(false);
  const [decouncedFilters, setDebouncedFilters] = useState<any>(null);
  const filtersTimeout = useRef<any>(null);
  const { data, size, isLoading, setSize, error, mutate } =
    useGetCollectionsAnalysis({
      ...decouncedFilters,
      limit: 10,
      page: 1,
    });
  const { isLoadingMore, list: collections } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => (isInfinite ? setSize(size + 1) : null),
  });

  useEffect(() => {
    if (filtersTimeout.current) {
      clearInterval(filtersTimeout.current);
    }
    filtersTimeout.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 200);
  }, [filters]);

  useEffect(() => {
    if (currentSorting) {
      switch (currentSorting.field) {
        case "floorPrice":
          setFilters({
            ...filters,
            orderBy: AnalysisModeSort.floorPrice,
            order: currentSorting.direction,
          });
          break;
        case "volume":
          setFilters({
            ...filters,
            orderBy: AnalysisModeSort.volume,
            order: currentSorting.direction,
          });
          break;
        case "owner":
          setFilters({
            ...filters,
            orderBy: AnalysisModeSort.owner,
            order: currentSorting.direction,
          });
          break;
        case "items":
          setFilters({
            ...filters,
            orderBy: AnalysisModeSort.items,
            order: currentSorting.direction,
          });
          break;
      }
    }
  }, [currentSorting]);

  const resetFilters = () => {
    setFilters({
      ...filters,
      orderBy: AnalysisModeSort.volume,
      order: "desc",
      type: AnalysisType.ONEDAY,
      min: "",
      max: "",
      minMaxBy: "volume",
    });
  };

  const updateFilters = (_filters: APIParams.FetchCollectionsStatistics) => {
    setFilters({ ...filters, ..._filters });
  };

  useEffect(() => {
    setFilters({
      ...filters,
      orderBy: AnalysisModeSort.volume,
      order: "desc",
      type: AnalysisType.ONEDAY,
      min: "",
      max: "",
      minMaxBy: "volume",
      limit: 10,
    });
  }, []);

  return (
    <div className="flex justify-center gap-14 desktop:gap-0 tablet:gap-0 flex-col-reverse tablet:flex-row desktop:flex-row w-full px-4 tablet:px-20 desktop:px-20">
      <div className="w-full p-5 rounded-xl border border-1 border-soft shadow-sm flex flex-col gap-5">
        <StatisticsHeader
          showFilters={!disableFilters}
          filters={filters}
          toggleFilter={() => setShowFilters(!isShowFilters)}
          updateFilters={updateFilters}
        />
        <div className="flex gap-6 flex-col desktop:flex-row">
          {!disableFilters &&
            (isMobile ? (
              <MobileCollectionStatisticsFiltersModal
                onApplyFilters={updateFilters}
                show={isShowFilters}
                activeFilters={filters}
                onResetFilters={resetFilters}
                onClose={() => setShowFilters(false)}
              />
            ) : (
              <CollectionStatisticsFilters
                activeFilters={filters}
                onApplyFilters={updateFilters}
                showFilters={isShowFilters}
                onResetFilters={resetFilters}
              />
            ))}

          {isMobile ? (
            <CollectionsMobile collections={collections} />
          ) : (
            <CollectionsDesktop
              key={
                currentSorting?.field
                  ? currentSorting.field + "_" + currentSorting.direction
                  : ""
              }
              isLoadingMore={isLoadingMore ?? false}
              isLoading={isLoading}
              collections={
                isInfinite
                  ? collections.concatenatedData
                  : collections.concatenatedData.slice(0, 10)
              }
              setCurrentSorting={setCurrentSorting}
              currentSorting={currentSorting}
            />
          )}
        </div>
        {!isInfinite && (
          <Link
            href="/statistics/collections"
            className="w-full bg-[#040404] text-[#FFFFFF] flex items-center justify-center rounded-[12px] h-[52px] text-[18px] font-medium"
          >
            View all collections
          </Link>
        )}
      </div>
    </div>
  );
};

export default Statistics;
