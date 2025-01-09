"use client";

import React, { useEffect, useState } from "react";
import { ToggleSwitch } from "flowbite-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { APIResponse } from "@/services/api/types";
import BannerSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/BannerSection";
import InformationSectionCollection from "@/components/Pages/MarketplaceNFT/CollectionDetails/InformationSection";
import {
  getCollectionAvatarImage,
  getCollectionBannerImage,
} from "@/utils/string";
import useSWR from "swr";
import { API_ENDPOINTS } from "@/config/api";
import { nextAPI } from "@/services/api";
import MySpinner from "@/components/X721UIKits/Spinner";
import CollectionNftsList from "./collection-nfts-list";
import CollectionOrdersList from "./collection-orders-list";
import { NFT } from "@/types";

const getCollectionData = async (
  id: string
): Promise<
  | { status: "success"; data: APIResponse.CollectionDetails | null }
  | { status: "error" }
> => {
  try {
    const data = (await nextAPI.get(
      `${API_ENDPOINTS.COLLECTIONS + `/${id}`}`
    )) as { data: { data: APIResponse.CollectionDetails | null } };

    return {
      status: "success",
      data: data.data.data,
    };
  } catch (err) {
    return {
      status: "error",
    };
  }
};

export default function CollectionView() {
  const pathName = usePathname();
  const [selectedItems, setSelectedItems] = useState<NFT[]>([]);
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "nfts";
  const { id } = useParams();
  const {
    data: collectionData,
    mutate,
    isLoading: isLoadingCollectionDetails,
  } = useSWR(id ? `/api/collections/${id}` : null, async () => {
    const data = await getCollectionData(id as string);
    if (data.status === "success") {
      return data.data;
    }
    return null;
  });
  const router = useRouter();

  if (isLoadingCollectionDetails) {
    return (
      <div className="w-full flex items-center justify-center pt-20">
        <MySpinner />
      </div>
    );
  } else {
    if (!collectionData) {
      return (
        <div className="flex flex-col items-center justify-center pt-32">
          <h1 className="text-2xl font-bold">Collection not found</h1>
          <button
            onClick={() => router.push("/explore/collections")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded mt-4"
          >
            Explore more collections
          </button>
        </div>
      );
    }
    return (
      <div className="w-full relative overflow-x-hidden">
        <BannerSectionCollection
          onUpdateSuccess={() => mutate()}
          collectionId={collectionData.collection.id}
          creators={collectionData.collection?.creators}
          cover={getCollectionBannerImage(collectionData.collection)}
          avatar={getCollectionAvatarImage(collectionData.collection)}
        />

        <InformationSectionCollection data={collectionData} />

        {view === "nfts" && (
          <CollectionNftsList collectionData={collectionData} />
        )}

        {view === "orders" && (
          <CollectionOrdersList
            collectionAddress={collectionData.collection.address}
          />
        )}
      </div>
    );
  }
}
