import CollectionsList from "@/components/List/CollectionsList";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MODE_COLLECTIONS } from "@/config/constants";
import { Address } from "wagmi";
import { APIResponse } from "@/services/api/types";

export default function UserCollections({
  onUpdateAmount,
  userId,
  wallet,
}: {
  onUpdateAmount: React.Dispatch<React.SetStateAction<number>>;
  userId: string;
  wallet: Address;
}) {
  const { id } = useParams();
  const api = useMarketplaceApi();

  const [activePagination, setActivePagination] = useState({
    page: 1,
    limit: 1000,
  });

  const { data: collections, isLoading } = useSWR(
    !!id ? { ...activePagination, userId: String(id), hasBase: false } : null,
    (params) => api.fetchCollectionsByUser(params),
    { refreshInterval: 300000 },
  );

  const handleChangePage = (page: number) => {
    setActivePagination({
      ...activePagination,
      page,
    });
    window.scrollTo(0, 0);
  };

  const { data: totalCollections } = useSWR(
    [
      "total_collections-data",
      {
        owner: String(wallet) as `0x${string}`,
        mode: String(MODE_COLLECTIONS),
      },
    ],
    ([_, params]) =>
      api.getTotalCountById({
        ...params,
      }),
    { refreshInterval: 5000 },
  );

  useEffect(() => {
    if (totalCollections) {
      onUpdateAmount(totalCollections);
    }
  }, [totalCollections, onUpdateAmount]);

  return (
    <div className="w-full py-7 overflow-x-auto">
      <CollectionsList
        loading={isLoading}
        collections={collections?.data}
        paging={collections?.paging}
        onChangePage={handleChangePage}
        id={id}
        showCreateCollection={true}
        creator={userId}
      />
    </div>
  );
}
