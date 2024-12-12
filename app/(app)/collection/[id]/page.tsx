import React from "react";
import { APIResponse } from "@/services/api/types";
import { API_ENDPOINTS, BASE_API_URL } from "@/config/api";
import CollectionView from "./view";
import { Metadata } from "next";

const getCollectionData = async (
  id: string
): Promise<
  | { status: "success"; data: APIResponse.CollectionDetails | null }
  | { status: "error" }
> => {
  const response = await fetch(
    `${BASE_API_URL}${API_ENDPOINTS.COLLECTIONS + `/${id}`}`,
    {
      method: "GET",
      cache: "force-cache",
      next: {
        tags: [`/collection/${id}`],
      },
    }
  );
  const data = await response.json();
  if (data.statusCode && data.statusCode === 400) {
    return {
      status: "error",
    };
  }
  return {
    status: "success",
    data,
  };
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const response = await getCollectionData(params.id);

  if (response.status === "success" && response.data) {
    return {
      title: `${response.data.collection?.name} | X721`,
      openGraph: {
        images: [response.data.collection?.avatarUrl ?? ""],
      },
    };
  }

  return {
    title: `Error | X721`,
  };
}

export default async function CollectionPage() {
  return <CollectionView />;
}
