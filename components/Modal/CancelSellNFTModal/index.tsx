import Text from "@/components/Text";
import Button from "@/components/Button";
import { useMemo, useState } from "react";
import useAuthStore from "@/store/auth/store";
import { NFT } from "@/types/entitites";
import { APIResponse } from "@/services/api/types";
import NFTMarketData = APIResponse.NFTMarketData;
import { toast } from "react-toastify";
import { useCancelSellURC1155, useCancelSellURC721 } from "@/hooks/useSellNFT";
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";

interface Props extends MyModalProps {
  nft: NFT;
  marketData?: NFTMarketData;
}

export default function CancelSellNFTModal({
  nft,
  show,
  onClose,
  marketData,
}: Props) {
  const { cancelOrder, getOrderDetails } = useMarketplaceV2(nft);
  const wallet = useAuthStore((state) => state.profile?.publicKey);
  const [loading, setLoading] = useState(false);
  const [isCancelling, setCancelling] = useState(false);
  const onCancelSellURC721 = useCancelSellURC721(nft);
  const onCancelSellURC1155 = useCancelSellURC1155();
  const mySale = useMemo(() => {
    return marketData?.sellInfo?.find(
      (item) => item.Maker?.publicKey.toLowerCase() === wallet?.toLowerCase()
    );
  }, [marketData, wallet]);

  const handleCancelOrder = async () => {
    if (!marketData || !marketData.sellInfo[0]) return;
    try {
      setCancelling(true);
      const { sig, index } = marketData.sellInfo[0];
      const orderDeatails = await getOrderDetails(sig, index);
      if (!orderDeatails) return;
      await cancelOrder(orderDeatails);
    } catch (err: any) {
      toast.error(`Error report: User rejected`);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body className="pb-5">
        <div className="flex flex-col justify-center gap-4 items-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="font-bold">
              <Text className="mb-3 text-center" variant="heading-xs">
                Cancel listing
              </Text>
              <Text className="text-secondary" variant="body-16">
                Cancel sale for{" "}
                <span className="text-primary font-bold">{nft.name}</span> from{" "}
                <span className="text-primary font-bold">
                  {nft.collection.name}
                </span>{" "}
                collection
              </Text>
            </div>

            <div className="w-full flex gap-4">
              <Button className="flex-1" variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={handleCancelOrder}
                loading={isCancelling}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
