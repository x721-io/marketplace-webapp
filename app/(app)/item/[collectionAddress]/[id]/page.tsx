import Text from "@/components/Text";
import { API_ENDPOINTS } from "@/config/api";
import { marketplaceApi } from "@/services/api";
import { NFT } from "@/types";
import { parseQueries } from "@/utils";
import NFTView from "./view";
import { Metadata } from "next";

const getNftData = async (
  params: any
): Promise<{ status: "success"; data: NFT | null } | { status: "error" }> => {
  try {
    const data = (await marketplaceApi.get(
      API_ENDPOINTS.NFT + parseQueries(params)
    )) as NFT | null;
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
  params: any;
}): Promise<Metadata> {
  const response = await getNftData(params);
  if (response.status === "success" && response.data) {
    console.log(response.data.u2uId);
    return {
      title: `${response.data.name} | X721`,
      openGraph: {
        images: [response.data.image],
      },
    };
  }
  return {
    title: `Error | X721`,
  };
}

export default async function NFTPage({ params }: { params: any }) {
  const response = await getNftData(params);

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
        <Text variant="heading-xs">Item not found!</Text>
      </div>
    );
  }

  return <NFTView item={response.data} />;
}
