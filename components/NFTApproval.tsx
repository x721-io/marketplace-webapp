import { NFT } from "@/types";
import Button from "./Button";
import Text from "./Text";

interface Props {
  nft: NFT;
  isMarketContractApprovedToken?: boolean;
  handleApproveTokenForAll: () => void;
  handleApproveTokenForSingle: () => void;
  loadingForSingle?: boolean;
  loadingForAll?: boolean;
}

export default function NFTApproval({
  nft,
  isMarketContractApprovedToken,
  handleApproveTokenForAll,
  handleApproveTokenForSingle,
  loadingForSingle,
  loadingForAll,
}: Props) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Text className="font-semibold text-secondary">Current status:</Text>
        <div className="flex items-center gap-2">
          <Text className="font-semibol">
            {isMarketContractApprovedToken ? "Approved" : "Not approval"}
          </Text>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center flex-col tablet:flex-row ">
        {nft.collection.type === "ERC721" ? (
          <Button
            loading={loadingForSingle}
            variant="secondary"
            onClick={handleApproveTokenForSingle}
            className="p-3 flex-1 w-full  tablet:w-auto hover:bg-gray-900 hover:text-white "
          >
            Approve Token for Single
          </Button>
        ) : (
          ""
        )}
        <Button
          loading={loadingForAll}
          variant="secondary"
          onClick={handleApproveTokenForAll}
          className="p-3 flex-1 w-full tablet:w-auto hover:bg-gray-900 hover:text-white "
        >
          Approve Token for All
        </Button>
      </div>
    </div>
  );
}
