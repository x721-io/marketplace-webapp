import {
  CustomFlowbiteTheme,
  Modal,
  ModalProps,
  Tooltip,
} from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import Text from "@/components/Text";
import Button from "@/components/Button";
import { FormState, NFT } from "@/types";
import { APIResponse } from "@/services/api/types";
import NFTMarketData = APIResponse.NFTMarketData;
import { Address, useAccount, useBalance, useContractReads } from "wagmi";
import { findTokenByAddress } from "@/utils/token";
import { tokenOptions, tokens } from "@/config/tokens";
import { useBidNFT, useBidUsingNative, useMarketTokenApproval } from "@/hooks/useMarket";
import { useForm } from "react-hook-form";
import { MaxUint256, formatUnits, parseEther, parseUnits } from "ethers";
import { toast } from "react-toastify";
import Input from "@/components/Form/Input";
import { formatDisplayedBalance } from "@/utils";
import FeeCalculator from "@/components/FeeCalculator";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { numberRegex } from "@/utils/regex";
import Select from "@/components/Form/Select";

interface Props extends ModalProps {
  nft: NFT;
  marketData?: NFTMarketData;
}

const modalTheme: CustomFlowbiteTheme["modal"] = {
  content: {
    inner:
      "relative rounded-lg bg-white shadow flex flex-col h-auto max-h-[600px] desktop:max-h-[800px] tablet:max-h-[800px]",
    base: "relative w-full desktop:p-10 tablet:p-6 p-4 ",
  },
  body: {
    base: "p-0 flex-1 overflow-auto",
  },
};

export default function BidNFTModal({ nft, show, onClose, marketData }: Props) {
  const { address } = useAccount();

  const { onBidUsingNative, isSuccess, isLoading, error } = useBidUsingNative(nft);
  const { onBidNFT } = useBidNFT(nft)
  const {
    handleSubmit,
    watch,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormState.BidNFT>();
  const token = findTokenByAddress(watch("quoteToken"));
  const {
    isTokenApproved,
    onApproveToken,
  } = useMarketTokenApproval(token?.address as Address, nft.collection.type);

  const [buyerFeeFormatted, setBuyerFeeFormatted] = useState<string>();


  const formRules = {
    price: {
      required: "Please input bid price",
      min: { value: 0, message: "Price cannot be zero" },
      validate: {
        isNumber: (v: any) => !isNaN(v) || "Please input a valid number",
        balance: (v: any) => {
          if (!tokenBalance?.value) return "Not enough balance";
          if (nft.collection.type === "ERC1155") {
            const totalPrice = Number(price) * Number(quantity);
            const totalPriceBN = parseEther(totalPrice.toString());
            return totalPriceBN < tokenBalance.value || "Not enough balance";
          }
          const priceBN = parseEther(String(v));
          return priceBN < tokenBalance.value || "Not enough balance";
        },
      },
    },
    quantity: {
      pattern: { value: numberRegex, message: "Wrong number format" },
      validate: {
        required: (v: any) => {
          if (nft.collection.type === "ERC721") return true;
          return (
            (!!v && !isNaN(v) && Number(v) > 0) ||
            "Please input a valid number of quantity"
          );
        },
        quantity: (v: any) => {
          if (nft.collection.type === "ERC721") return true;
          return (
            Number(v) <= Number(marketData?.totalSupply || 0) ||
            "Cannot bid more than total supply"
          );
        },
      },
    },
    allowance: {
      validate: {
        // check allowance < price + fee ? 'show validation' : '' 
      },
    }
  };
  const [price, quantity] = watch(["price", "quantity"]);

  const { data: tokenBalance } = useBalance({
    address: address,
    enabled: !!address,
    token: token?.address === process.env.NEXT_PUBLIC_FORTH_ETH_CONTRACT ? undefined : token?.address
  });

  const onSubmit = async ({ price, quantity }: FormState.BidNFT) => {
    try {
      token?.address === process.env.NEXT_PUBLIC_FORTH_ETH_CONTRACT ?
        await onBidUsingNative(price, quantity)
        :
        await onBidNFT(price, token?.address as `0x${string}`, quantity)
    } catch (e: any) {
      console.error(e);
    } finally {
      reset();
    }
  };

  useEffect(() => {
    if (error)
      toast.error(`Error report: ${error.message}`, {
        autoClose: 1000,
        closeButton: true,
      });
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      onClose?.();
      toast.success(`Bid placed successfully`, {
        autoClose: 1000,
        closeButton: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleMin = () => {
    // setValue("buyerFeeFormatted", buyerFeeFormatted);
    setBuyerFeeFormatted(buyerFeeFormatted)
  }
  const handleMax = () => {
    // setValue("buyerFeeFormatted", (MaxUint256.toString());
    setBuyerFeeFormatted(MaxUint256.toString());
  }
  const handleApprove = async () => {
    try {
      // truyền price vào onApproveToken
      await onApproveToken();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      theme={modalTheme}
      dismissible
      size="lg"
      show={show}
      onClose={onClose}
    >
      <Modal.Body className="p-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="font-bold">
              <Text className="mb-3" variant="heading-xs">
                Place a bid
              </Text>
              <Text className="text-secondary" variant="body-16">
                Creating bid for{" "}
                <span className="text-primary font-bold">{nft.name}</span> from{" "}
                <span className="text-primary font-bold">
                  {nft.collection.name}
                </span>{" "}
                collection
              </Text>
            </div>

            <div>
              <label className="text-body-14 text-secondary font-semibold mb-1">
                {nft.collection.type === "ERC721" ? "Price" : "Price per unit"}
              </label>
              <Input
                maxLength={18}
                size={18}
                error={!!errors.price}
                register={register("price", formRules.price)}
              />
            </div>

            <div>
              <label className="text-body-14 text-secondary font-semibold mb-1">
                Bid using
              </label>
              <Text>
                Balance:{" "}
                {formatDisplayedBalance(
                  formatUnits(tokenBalance?.value || 0, tokenBalance?.decimals),
                )}
              </Text>
              <Select options={tokenOptions} register={register("quoteToken")} />
            </div>

            {nft.collection.type === "ERC1155" ? (
              <>
                <div>
                  <Text className="text-secondary font-semibold mb-1">
                    Quantity
                  </Text>
                  <Input
                    maxLength={3}
                    size={3}
                    register={register("quantity", formRules.quantity)}
                    appendIcon={
                      <Text className="w-56 overflow-ellipsis whitespace-nowrap text-right">
                        Max:{" "}
                        {formatDisplayedBalance(
                          marketData?.totalSupply || 0,
                          0,
                        )}
                      </Text>
                    }
                  />
                </div>
                <div>
                  <Text className="text-secondary font-semibold mb-1">
                    Estimated cost:
                  </Text>
                  <Input
                    readOnly
                    value={Number(price) * Number(quantity) || 0}
                    appendIcon={<Text>U2U</Text>}
                  />
                </div>
                <FeeCalculator
                  mode="buyer"
                  nft={nft}
                  price={parseUnits(
                    String(Number(price) * Number(quantity) || 0),
                    token?.decimal,
                  )}
                  quoteToken={token?.address}
                />
              </>
            ) : (
              <FeeCalculator
                mode="buyer"
                nft={nft}
                price={parseUnits(price || "0", token?.decimal)}
                quoteToken={token?.address}
                setBuyerFeeFormatted={setBuyerFeeFormatted}
              />
            )}

            <FormValidationMessages errors={errors} />
            {isTokenApproved ?
              <Button type={"submit"} className="w-full" loading={isLoading}>
                Place bid
              </Button>
              : <>
                <Text>Not enough allowance</Text>
                <Text>Approve allowance</Text>
                <Input
                  // onChange={(e) => setValue("buyerFeeFormatted", e.target.value)}
                  value={buyerFeeFormatted}
                />
                <Button onClick={handleMin} className="w-full">Min</Button>
                <Button onClick={handleMax} className="w-full">Max</Button>
                <Button onClick={handleApprove} className="w-full">Approve Token contract</Button>
              </>}

          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
