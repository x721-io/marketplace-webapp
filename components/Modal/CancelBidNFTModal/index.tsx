import { useCancelBidNFT } from "@/hooks/useMarket";
import Text from "@/components/Text";
import Button from "@/components/Button";
import { NFT, MarketEventV2 } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";
import { useSWRConfig } from "swr";
import { useParams } from "next/navigation";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";

interface Props extends MyModalProps {
  nft: NFT;
  bid?: MarketEventV2 | undefined;
}

export default function CancelBidNFTModal({ nft, show, onClose, bid }: Props) {
  const { id } = useParams();
  const { getOrderDetails, cancelOrder } = useMarketplaceV2(nft);
  const [isLoading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const handleCancelBid = async () => {
    if (!bid) return;
    try {
      setLoading(true);
      const { sig, index } = bid;
      const orderDetails = await getOrderDetails(sig, index);
      if (!orderDetails) return;
      await cancelOrder(orderDetails);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      mutate([
        `nft-market-data/${nft.id}`,
        {
          collectionAddress: String(nft.collection.address),
          id: String(nft.id),
        },
      ]);
      toast.success("Successfully cancelled order.");
      onClose?.();
    } catch (e: any) {
      toast.error("Error report: cannot cancel order. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body className="py-10 px-[30px]">
        <div className="flex flex-col justify-center items-center gap-4 ">
          <div className="font-bold">
            <Text className="mb-3 text-center" variant="heading-xs">
              Cancel Bidding
            </Text>
            <Text className="text-secondary text-center" variant="body-16">
              Preparing to remove bid for{" "}
              <span className="text-primary font-bold">{nft.name}</span> from{" "}
              <span className="text-primary font-bold">
                {nft.collection.name}
              </span>{" "}
              collection
            </Text>
          </div>

          <div className="flex gap-4 w-full">
            <Button className="flex-1" variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button
              className="flex-1"
              onClick={handleCancelBid}
              loading={isLoading}
            >
              Yes
            </Button>
          </div>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
