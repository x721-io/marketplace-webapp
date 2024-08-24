import CollectionsList from "@/components/List/CollectionsList";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { MODE_COLLECTIONS } from "@/config/constants";
import { Address } from "wagmi";
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

  const { data, isLoading, setSize, size, error } =
    useGetCollectionsByUserInfinite(String(id));
  const { isLoadingMore, list: collections } = useInfiniteScroll({
    data,
    loading: isLoading,
    page: size,
    onNext: () => setSize(size + 1),
  });

  const { data: totalCollections } = useGetTotalCountById(
    "total_collections-data",
    String(wallet) as `0x${string}`,
    String(MODE_COLLECTIONS)
  );

  useEffect(() => {
    if (totalCollections) {
      onUpdateAmount(totalCollections);
    }
  }, [totalCollections, onUpdateAmount]);

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
