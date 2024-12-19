import { classNames } from "@/utils/string";
import React from "react";
import Text from "@/components/Text";
import { isMobile } from "react-device-detect";
import { AssetType, LayerGNFT } from "@/types";
import FilterBar from "@/components/PageBuilder/Items/FilterBar";
import NFTCardSkeleton from "@/components/NFT/NFTCard/skeleton";
import PageBuilderFilter from "@/components/PageBuilder/Filters/PageBuilderFilter";
import LayergNFTCard from "@/components/PageBuilder/LayergNFTCard";
import { useLayerGNFTFilterStore } from "@/store/filters/layerg/byLayerG/store";
import MobileFiltersModal from "@/components/PageBuilder/Items/FilterMobile";

interface Props {
  items?: LayerGNFT[];
  isLoading?: boolean;
  isLoadMore?: boolean | undefined;
  error?: boolean;
  dataCollectionType?: AssetType;
  userId?: string;
  hasNext: boolean;
}

export default function ListItems({
  items,
  isLoading,
  isLoadMore,
  error,
  hasNext,
}: Props) {
  const { showFilters, toggleFilter, filters, updateFilters, resetFilters } =
    useLayerGNFTFilterStore();

  const renderList = () => {
    if (error && !items) {
      return (
        <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
          <Text variant="heading-xs" className="text-center">
            Network Error!
            <br />
            Please try again later
          </Text>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div
          className={classNames(
            "grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:gap-3 tablet:gap-4 gap-3",
            isMobile
              ? "desktop:grid-cols-6 tablet:grid-cols-3 grid-cols-2"
              : showFilters
              ? "desktop:grid-cols-4 tablet:grid-cols-2 grid-cols-1"
              : "desktop:grid-cols-6 tablet:grid-cols-3 grid-cols-2"
          )}
        >
          {Array(20)
            .fill("")
            .map((_, i) => (
              <NFTCardSkeleton key={i} />
            ))}
        </div>
      );
    }
    if (!items?.length) {
      return (
        <div className="w-full h-[295px] flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed">
          <Text className="text-secondary font-semibold text-body-18">
            Nothing to show
          </Text>
        </div>
      );
    }
    return (
      <div className="w-full">
        <div
          className={classNames(
            "grid mt-4 mb-6 desktop:mt-0 desktop:mb-20 tablet:mt-0 tablet:mb-10 desktop:gap-3 tablet:gap-4 gap-3",
            isMobile
              ? "desktop:grid-cols-6 tablet:grid-cols-3 grid-cols-2"
              : showFilters
              ? "desktop:grid-cols-4 tablet:grid-cols-2 grid-cols-1"
              : "desktop:grid-cols-6 tablet:grid-cols-3 grid-cols-2"
          )}
        >
          {items.map((item, i) => (
            <div className="h-full" key={i + "-" + item.id}>
              <LayergNFTCard {...item} />
            </div>
          ))}
          {isLoadMore &&
            Array(20)
              .fill("")
              .map((_, i) => <NFTCardSkeleton key={i} />)}
        </div>

        {!!items?.length && (
          <div className="flex justify-center items-center">
            {!hasNext && (
              <div className="w-full h-36 flex justify-center items-center">
                No more data
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 h-full w-full flex flex-col tablet:px-10 laptop:px-20 gap-10">
      <FilterBar />

      <div className="w-full">
        <div
          className={classNames(
            "w-full flex gap-4 tablet:gap-7 laptop:gap-10 desktop:gap-12 mb-7",
            showFilters
              ? "flex-col tablet:flex-row desktop:flex-row tablet:items-start"
              : "tablet:flex-row"
          )}
        >
          <PageBuilderFilter />
          <div className="flex-1">{renderList()}</div>
        </div>
      </div>
    </div>
  );
}
