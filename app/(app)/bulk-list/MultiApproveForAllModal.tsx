import ERC1155 from "@/abi/ERC1155";
import { MyModal } from "@/components/X721UIKits/Modal";
import { contractNFTTransferProxy } from "@/hooks/useMarketplaceV2";
import { Web3Functions } from "@/services/web3";
import { Collection } from "@/types";
import { useState } from "react";
import { erc721Abi } from "viem";

type Props = {
  collections: Collection[];
  onClose: () => void;
  onApproveSucces: (collection: Collection) => void;
  onList: () => void;
  isOpen: boolean;
};

export default function MultiApproveForAllModal({
  collections,
  onClose,
  isOpen,
  onApproveSucces,
  onList,
}: Props) {
  const [approveErrorCollections, setApproveErrorCollections] = useState<
    Collection[]
  >([]);
  const [approveSuccessCollections, setApproveSuccessCollections] = useState<
    Collection[]
  >([]);
  const [approvingCollectionIds, setApprovingCollectionIds] = useState<
    string[]
  >([]);

  const approve = async (collection: Collection) => {
    const type = collection.type;
    if (!type) return;
    try {
      setApproveErrorCollections((prev) =>
        prev.filter((c) => c.id !== collection.id)
      );
      setApprovingCollectionIds((prev) => [...prev, collection.id]);
      await Web3Functions.writeContract({
        abi: type === "ERC721" ? erc721Abi : ERC1155,
        functionName: "setApprovalForAll",
        address: collection.address,
        args: [contractNFTTransferProxy, true],
      });
      onApproveSucces(collection);
      setApproveSuccessCollections((prev) => [...prev, collection]);
    } catch (err) {
      setApproveErrorCollections((prev) => [...prev, collection]);
    } finally {
      setApprovingCollectionIds((prev) =>
        prev.filter((id) => id !== collection.id)
      );
    }
  };

  const approveAllCollections = async () => {
    await Promise.all(
      collections.map(async (collection) => {
        await approve(collection);
      })
    );
  };

  const handleProceedList = async () => {
    if (collections.length === 0) {
      onList();
      return;
    }

    approveAllCollections();
  };

  return (
    <MyModal.Root
      onClose={onClose}
      show={isOpen}
      className="flex items-center justify-center text-[white]"
      bodyContainerStyle={{
        background: "#252525",
        width: "600px",
      }}
    >
      <MyModal.Header>
        <h1 className="text-[white] font-bold">Approve NFTs Modal</h1>
      </MyModal.Header>
      <MyModal.Body className="bg-[#252525] pb-3">
        <div className="w-full max-h-[400px] overflow-y-auto">
          {collections.map((collection, i) => (
            <div
              className="w-full flex flex-col bg-[#252525] text-[white]"
              key={collection.id}
            >
              <div className="w-full flex items-center gap-5">
                <div className="w-[70%] h-[100px] flex flex-col items-start justify-center">
                  <div>Collection: {collection.name}</div>
                  {approveErrorCollections.includes(collection) && (
                    <div className="font-medium text-[#EF5350] text-[1rem] mt-1">
                      Approve failed. Please try again.
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-0">
                  {/* <div className="font-bold text-[white] text-[1.1rem]">
                                    Collection: {collection.name}
                                </div> */}
                  {/* <div className="font-medium text-[#EF5350] text-[1rem] mt-1">
                                    123
                                </div> */}
                  <div className="font-medium text-[1rem]">
                    <button
                      disabled={approvingCollectionIds.includes(collection.id)}
                      className="h-[35px] bg-[#000] px-8 rounded-md mt-2"
                      onClick={() => {
                        approve(collection);
                      }}
                    >
                      {approvingCollectionIds.find((id) => id === collection.id)
                        ? "Approving..."
                        : approveErrorCollections.includes(collection)
                        ? "Retry"
                        : "Approve"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full items-center justify-center gap-5">
          <button
            disabled={approvingCollectionIds.length > 0}
            onClick={() => handleProceedList()}
            className="w-full bg-black !py-3 rounded-lg text-heading-xs !text-[1.25rem] tracking-[1px] disabled:brightness-50 disabled:cursor-not-allowed"
          >
            {approvingCollectionIds.length > 0
              ? "Approving..."
              : collections.length > 0
              ? "Approve All"
              : "Proceed to list"}
          </button>
          <div className="flex items-center justify-start w-full text-[rgba(255,255,255,0.65)] text-heading-sm !text-[1.05rem] tracking-[0.5px]">
            *You need to approve all above collections before proceeding
          </div>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
