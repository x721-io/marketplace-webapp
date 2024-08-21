import { contracts } from "@/config/contracts";
import { APIParams } from "@/services/api/types";
import { AssetType } from "@/types";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { Web3Functions } from "@/services/web3";

export default function useCollection() {
  const createCollection = async (
    type: AssetType,
    [name, symbol, baseURI, contractURI, operators, salt]: any[]
  ) => {
    let data = {
      functionName: "createToken",
      args: [name, symbol, baseURI, contractURI, operators, salt],
    };
    if (type === "ERC721") {
      data = { ...data, ...contracts.erc721Factory };
    } else {
      data = { ...data, ...contracts.erc1155Factory };
    }
    try {
      const response = await Web3Functions.writeContract(data as any);
      return response;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    createCollection,
  };
}

export const useUpdateCollection = () => {
  const api = useMarketplaceApi();

  const onCreateCollection = (params: APIParams.CreateCollection) =>
    api.createCollection(params);

  return { onCreateCollection };
};
