import React from "react";
import { APIResponse } from "@/services/api/types";
import { marketplaceApi } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import CollectionView from "./view";
import Text from "@/components/Text";
import { Metadata } from "next";

const getCollectionData = async (
  id: number
): Promise<
  | { status: "success"; data: APIResponse.CollectionDetails | null }
  | { status: "error" }
> => {
  try {
    const data = (await marketplaceApi.get(
      `${API_ENDPOINTS.COLLECTIONS + `/${id}`}`
    )) as APIResponse.CollectionDetails | null;
    return {
      status: "success",
      data,
    };
  } catch (err) {
    return {
      status: "error",
    };
  }
};

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  const response = await getCollectionData(params.id);
  if (response.status === "success" && response.data) {
    return {
      title: `${response.data.collection.name} | X721`,
      openGraph: {
        images: [response.data.collection.avatar ?? ""],
      },
    };
  }
  return {
    title: `Error | X721`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: { id: number };
}) {
  const response = await getCollectionData(params.id);

  if (response.status === "error") {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <Text variant="heading-xs" className="text-center">
          Network Error!
          <br />
          Please try again later
        </Text>
      </div>
    );
  }

  if (!response.data) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <Text variant="heading-xs">Collection not found!</Text>
      </div>
    );
  }

  return <CollectionView collectionData={response.data} />;
}
