import CollectionsList from "@/components/List/CollectionsList";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { MODE_COLLECTIONS } from "@/config/constants";
import { Address } from "abitype";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  useGetCollectionsByUserInfinite,
  useGetTotalCountById,
} from "@/hooks/useQuery";

export default function UserCollections({
  onUpdateAmount,
  userId,
  wallet,
  isShow = true,
}: {
  onUpdateAmount: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
  wallet: Address;
  isShow: boolean;
}) {
  const { id } = useParams();
  const api = useMarketplaceApi();

  const {
    data,
    isLoading,
    setSize,
    size,
    error,
    mutate: mutateCollections,
  } = useGetCollectionsByUserInfinite(String(id));
  const { isLoadingMore, list: collections } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  const { data: totalCollections, mutate } = useGetTotalCountById(
    "total_collections-data",
    String(wallet) as `0x${string}`,
    String(MODE_COLLECTIONS)
  );

  useEffect(() => {
    if (totalCollections) {
      onUpdateAmount(totalCollections);
      mutate();
    }
    mutateCollections();
  }, [totalCollections, onUpdateAmount, mutate, mutateCollections]);

  return (
    <div
      style={
        !isShow
          ? {
              display: "none",
            }
          : {}
      }
      className="w-full py-7 overflow-x-auto"
    >
      <CollectionsList
        error={error}
        isLoading={isLoading}
        isLoadMore={isLoadingMore}
        collections={collections.concatenatedData}
        currentHasNext={collections.currentHasNext}
        showCreateCollection={true}
        creator={userId}
      />
    </div>
  );
}
