import { NFT } from "@/types";
import Button from "./Button";
import Text from "./Text";

interface Props {
  nft: NFT;
  isMarketContractApprovedToken?: boolean;
  handleApproveTokenForAll: () => void;
  handleApproveTokenForSingle: () => void;
}

export default function NFTApproval({
  nft,
  isMarketContractApprovedToken,
  handleApproveTokenForAll,
  handleApproveTokenForSingle,
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
      <div className="flex items-center gap-2 justify-center">
        {nft.collection.type === "ERC721" ? (
          <Button
            variant="secondary"
            onClick={handleApproveTokenForSingle}
            className="p-3 flex-1"
          >
            Approve Token for Single
          </Button>
        ) : (
          ""
        )}
        <Button
          variant="secondary"
          onClick={handleApproveTokenForAll}
          className="p-3 flex-1"
        >
          Approve Token for All
        </Button>
      </div>
    </div>
  );
}
