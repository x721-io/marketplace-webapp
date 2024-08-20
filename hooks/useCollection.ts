import { contracts } from "@/config/contracts";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { APIParams } from "@/services/api/types";
import { AssetType } from "@/types";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { getTransactionErrorMsg } from "@/utils/transaction";

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
      const tx = await writeContract(data as any);
      const response = await waitForTransaction(tx);
      return response;
    } catch (err: any) {
      throw getTransactionErrorMsg(err);
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
