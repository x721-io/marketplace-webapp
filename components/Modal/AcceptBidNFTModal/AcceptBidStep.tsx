import Text from "@/components/Text";
import Button from "@/components/Button";
import { useAcceptBidNFT } from "@/hooks/useMarket";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/Form/Input";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { NFT, MarketEvent, FormState } from "@/types";
import FeeCalculator from "@/components/FeeCalculator";
import { numberRegex } from "@/utils/regex";

interface Props {
  nft: NFT;
  bid?: MarketEvent;
  onSuccess: () => void;
  onError: (error: Error) => void;
  onClose?: () => void;
}

export default function AcceptBidStep({
  nft,
  onError,
  onSuccess,
  onClose,
  bid,
}: Props) {
  const { onAcceptERC721Bid, onAcceptERC1155Bid, isLoading, error, isSuccess } =
    useAcceptBidNFT(nft);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormState.AcceptBidNFT>({
    defaultValues: {
      quantity: bid?.quantity ? Number(bid.quantity) : 0,
    },
  });
  const type = nft.collection.type;

  const onSubmit = ({ quantity }: FormState.AcceptBidNFT) => {
    if (!bid || !bid.to?.signer) return;
    try {
      if (type === "ERC721") {
        onAcceptERC721Bid(bid.to.signer, bid.quoteToken);
      } else {
        onAcceptERC1155Bid(bid.operationId, quantity);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (error) onError(error);
  }, [error]);

  useEffect(() => {
    if (isSuccess) onSuccess();
  }, [isSuccess]);

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="font-bold">
        <Text className="mb-3 text-center" variant="heading-xs">
          Accept Bid
        </Text>
        <Text className="text-secondary" variant="body-16">
          Filling bid order for{" "}
          <span className="text-primary font-bold">{nft.name}</span> from{" "}
          <span className="text-primary font-bold">{nft.collection.name}</span>{" "}
          collection
        </Text>
      </div>

      {type === "ERC721" ? (
        <FeeCalculator
          mode="seller"
          nft={nft}
          quoteToken={bid?.quoteToken}
          price={BigInt(bid?.price || 0)}
        />
      ) : (
        <>
          <div className="mb-4">
            <label className="text-body-14 text-secondary" htmlFor="">
              Quantity:
            </label>
            <Input
              maxLength={18}
              size={18}
              error={!!errors.quantity}
              appendIcon={<Text>Available: {bid?.quantity}</Text>}
              register={register("quantity", {
                pattern: { value: numberRegex, message: "Wrong number format" },
                validate: {
                  required: (v) =>
                    (!!v && v > 0 && !isNaN(v)) || "Please input quantity",
                  amount: (v) =>
                    v <= Number(bid?.quantity) ||
                    "Quantity cannot exceed bid amount",
                },
              })}
            />
          </div>
          <FeeCalculator
            mode="seller"
            nft={nft}
            quoteToken={bid?.quoteToken}
            price={BigInt(bid?.price || 0) * BigInt(bid?.quantity || 0)}
          />
        </>
      )}
      <FormValidationMessages errors={errors} />

      <div className="flex gap-4 mt-7 w-full">
        <Button className="flex-1" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" type="submit" loading={isLoading}>
          Accept bid
        </Button>
      </div>
    </form>
  );
}
