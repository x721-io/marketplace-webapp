import { useCalculateFee } from "@/hooks/useMarket";
import { useQueryClient } from "@tanstack/react-query";
import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { formatUnits, MaxUint256, parseUnits } from "ethers";
import { findTokenByAddress } from "@/utils/token";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useBlockNumber } from "wagmi";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { FormState, MarketEvent, NFT } from "@/types";
import FeeCalculator from "@/components/FeeCalculator";
import { formatDisplayedNumber } from "@/utils";
import { numberRegex } from "@/utils/regex";
import { tokens } from "@/config/tokens";
import ERC20TokenApproval from "@/components/ERC20TokenApproval";
import { toast } from "react-toastify";
import { useMarketApproveERC20 } from "@/hooks/useMarketApproveERC20";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";
import useBuyNFT from "@/hooks/useBuyNFT";
import { Address } from "abitype";
import { isIntegerString } from "@/utils/string";
import { useSWRConfig } from "swr";

interface Props extends MyModalProps {
  nft: NFT;
  saleData: MarketEvent;
}

export default function BuyNFTModal({ nft, saleData, show, onClose }: Props) {
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const {
    buyURC1155UsingNative,
    buyURC1155UsingURC20,
    buyURC721UsingNative,
    buyURC721UsingURC20,
  } = useBuyNFT({ nft });
  const api = useMarketplaceApi();
  const { address } = useAccount();
  const {
    handleSubmit,
    watch,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormState.BuyNFT>({
    defaultValues: {
      quoteToken: saleData.quoteToken,
      quantity: 0,
    },
  });
  const [price, quantity, quoteToken, allowance] = watch([
    "price",
    "quantity",
    "quoteToken",
    "allowance",
  ]);
  const token = useMemo(
    () => findTokenByAddress(saleData.quoteToken),
    [saleData]
  );
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const {
    sellerFee,
    buyerFee,
    royaltiesFee,
    netReceived,
    sellerFeeRatio,
    buyerFeeRatio,
  } = useCalculateFee({
    collectionAddress: nft.collection.address,
    tokenId: nft.u2uId || nft.id,
    price:
      nft.collection.type === "ERC721"
        ? BigInt(saleData.price || "0")
        : BigInt(saleData.price || "0") *
          BigInt(isIntegerString(quantity.toString()) ? quantity : "0"),
    onSuccess: (data) => {
      if (!saleData.price || isNaN(Number(saleData.price))) return;
      const priceBigint =
        nft.collection.type === "ERC721"
          ? BigInt(saleData.price || "0")
          : BigInt(saleData.price || "0") *
            BigInt(isIntegerString(quantity.toString()) ? quantity : "0");
      const { buyerFee } = data;
      const totalCostBigint = priceBigint + buyerFee;
      setValue("allowance", formatUnits(totalCostBigint, token?.decimal));
    },
  });

  const {
    allowance: allowanceBalance,
    isTokenApproved,
    onApproveToken,
  } = useMarketApproveERC20(
    token?.address as Address,
    nft.collection.type,
    parseUnits(price || "0", token?.decimal) + buyerFee
  );
  const formRules = {
    allowance: {
      required: true,
    },
  };

  const { data: tokenBalance, queryKey } = useBalance({
    address: address,
    query: { enabled: !!address && !!token?.address },
    token: token?.address === tokens.wu2u.address ? undefined : token?.address,
  });

  const totalPriceBN = useMemo(() => {
    if (!quantity) return BigInt(0);
    return (
      BigInt(saleData.price || "0") *
      BigInt(isIntegerString(quantity.toString()) ? quantity : "0")
    );
  }, [quantity, saleData]);

  const isDisableBuy = useMemo(() => {
    if ((tokenBalance?.value || 0) < BigInt(saleData.price || 0)) return true;
  }, [saleData, tokenBalance]);

  const handleBuyURC721UsingNative = async () => {
    if (!saleData) return;
    setLoading(true);
    try {
      await buyURC721UsingNative(BigInt(saleData.price) + BigInt(buyerFee));
      toast.success(`Order has been fulfilled successfully`, {
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => mutate("/api/collections"), 1500);
      onClose?.();
    } catch (err: any) {
      toast.error(`Error report: ${err.message}`, {
        autoClose: 2500,
        closeButton: true,
      });
      onClose?.();
    }
  };

  const handleBuyURC721UsingURC20 = async () => {
    if (!saleData) return;
    setLoading(true);
    try {
      // await buyURC721UsingURC20(
      //   quoteToken,
      //   BigInt(saleData.price) + BigInt(buyerFee)
      // );
      await buyURC721UsingNative(BigInt(saleData.price) + BigInt(buyerFee));
      toast.success(`Order has been fulfilled successfully`, {
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => mutate("/api/collections"), 1500);
      onClose?.();
    } catch (err: any) {
      toast.error(`Error report: ${err.message}`, {
        autoClose: 2500,
        closeButton: true,
      });
      onClose?.();
    }
  };

  const handleBuyURC1155UsingNative = async (quantity: number) => {
    if (!saleData) return;
    setLoading(true);
    try {
      await buyURC1155UsingNative(
        saleData.operationId,
        BigInt(saleData.price) + BigInt(buyerFee),
        quantity
      );
      toast.success(`Order has been fulfilled successfully`, {
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => mutate("/api/collections"), 1500);
      onClose?.();
    } catch (err: any) {
      toast.error(`Error report: ${err.message}`, {
        autoClose: 2500,
        closeButton: true,
      });
      onClose?.();
    }
  };

  const handleBuyURC1155UsingURC20 = async (quantity: number) => {
    if (!saleData) return;
    setLoading(true);
    try {
      await buyURC1155UsingNative(
        saleData.operationId,
        BigInt(saleData.price) + BigInt(buyerFee),
        quantity
      );
      toast.success(`Order has been fulfilled successfully`, {
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => mutate("/api/collections"), 1500);
      onClose?.();
      mutate("/api/collections");
    } catch (err: any) {
      toast.error(`Error report: ${err.message}`, {
        autoClose: 2500,
        closeButton: true,
      });
      onClose?.();
    }
  };

  const onSubmit = async ({ quantity }: FormState.BuyNFT) => {
    if (!saleData) return;
    await api.getFloorPrice({ address: nft.collection.address });
    switch (nft.collection.type) {
      case "ERC721":
        if (quoteToken === tokens.wu2u.address) {
          await handleBuyURC721UsingNative();
        } else {
          await handleBuyURC721UsingURC20();
        }
        break;
      case "ERC1155":
        if (quoteToken === tokens.wu2u.address) {
          await handleBuyURC1155UsingNative(quantity);
        } else {
          await handleBuyURC1155UsingURC20(quantity);
        }
        break;
      default:
        break;
    }
    setLoading(false);
    reset();
  };

  const handleApproveMinAmount = () => {
    if (allowanceBalance === undefined) return;

    const priceBigint = parseUnits(price || "0", token?.decimal);
    const totalCostBigint = priceBigint + buyerFee;
    const remainingToApprove =
      BigInt(allowanceBalance as bigint) < totalCostBigint
        ? totalCostBigint - allowanceBalance
        : 0;
    setValue("allowance", formatUnits(remainingToApprove, token?.decimal));
  };

  const handleApproveMaxAmount = () => {
    setValue("allowance", "UNLIMITED");
  };

  const handleAllowanceInput = (event: any) => {
    const value = event.target.value;
    if (allowance === "UNLIMITED") {
      setValue("allowance", value.slice(-1));
    } else {
      setValue("allowance", value);
    }
  };

  const handleApproveToken = async () => {
    const toastId = toast.loading("Preparing data...", { type: "info" });
    setLoading(true);
    try {
      toast.update(toastId, { render: "Sending token", type: "info" });
      const allowanceBigint =
        allowance === "UNLIMITED"
          ? MaxUint256
          : parseUnits(allowance, token?.decimal);
      await onApproveToken(allowanceBigint);

      toast.update(toastId, {
        render: "Approve token successfully",
        type: "success",
        autoClose: 1000,
        closeButton: true,
        isLoading: false,
      });
    } catch (e) {
      console.error(e);
      toast.update(toastId, {
        render: "Failed to approve token",
        type: "error",
        autoClose: 1000,
        closeButton: true,
        isLoading: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient]);

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body className={"px-[40px] pb-[20px]"}>
        <div className="flex flex-col justify-center items-center gap-4">
          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="font-bold">
              <Text className="mb-3" variant="heading-xs">
                Purchase NFT
              </Text>
              <Text className="text-secondary" variant="body-16">
                Filling sell order for{" "}
                <span className="text-primary font-bold">{nft.name}</span> from{" "}
                <span className="text-primary font-bold">
                  {nft.collection.name}
                </span>{" "}
                collection
              </Text>
            </div>

            <div>
              <label className="text-body-14 text-secondary font-semibold mb-1">
                Price
              </label>
              <Input
                maxLength={18}
                size={18}
                readOnly
                value={formatUnits(saleData?.price || "0", 18)}
                appendIcon={
                  nft.collection.type === "ERC1155" && (
                    <Text>Quantity: {saleData?.quantity}</Text>
                  )
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-body-14 text-secondary font-semibold">
                  Buy using
                </label>
                <Text>
                  Balance:{" "}
                  {formatDisplayedNumber(
                    formatUnits(
                      tokenBalance?.value || 0,
                      tokenBalance?.decimals
                    )
                  )}
                </Text>
              </div>
              <Input readOnly value={token?.symbol} />
            </div>

            {nft.collection.type === "ERC721" && (
              <FeeCalculator
                mode="buyer"
                nft={nft}
                qty={quantity ?? 0}
                price={BigInt(saleData?.price || "0")}
                quoteToken={token?.address}
                sellerFee={sellerFee}
                buyerFee={buyerFee}
                sellerFeeRatio={sellerFeeRatio}
                buyerFeeRatio={buyerFeeRatio}
                netReceived={netReceived}
                royaltiesFee={royaltiesFee}
              />
            )}

            {nft.collection.type === "ERC1155" && (
              <>
                <div>
                  <Text className="text-secondary font-semibold mb-1">
                    Quantity
                  </Text>
                  <Input
                    type="number"
                    maxLength={3}
                    size={3}
                    error={!!errors.quantity}
                    min="0"
                    step="1"
                    register={register("quantity", {
                      pattern: {
                        value: numberRegex,
                        message: "Wrong number format",
                      },
                      validate: {
                        required: (v) =>
                          (!!v && !isNaN(v) && v > 0) ||
                          "Please input quantity of item to purchase",
                        max: (v) =>
                          v <= Number(saleData?.quantity) ||
                          "Quantity exceeds sale amount",
                        balance: (v) => {
                          if (!tokenBalance?.value) return "Not enough balance";
                          const totalPriceBN =
                            BigInt(saleData?.price || 0) * BigInt(v);
                          return (
                            totalPriceBN < tokenBalance.value ||
                            "Not enough balance"
                          );
                        },
                      },
                    })}
                  />
                </div>

                <div>
                  <Text className="text-secondary font-semibold mb-1">
                    Estimated cost:
                  </Text>
                  <Input
                    readOnly
                    value={formatDisplayedNumber(
                      formatUnits(totalPriceBN, token?.decimal)
                    )}
                    appendIcon={<Text>{token?.symbol}</Text>}
                  />
                </div>

                <FeeCalculator
                  qty={quantity ?? 0}
                  mode="buyer"
                  nft={nft}
                  price={totalPriceBN}
                  quoteToken={token?.address}
                  sellerFee={sellerFee}
                  buyerFee={buyerFee}
                  sellerFeeRatio={sellerFeeRatio}
                  buyerFeeRatio={buyerFeeRatio}
                  netReceived={netReceived}
                  royaltiesFee={royaltiesFee}
                />
              </>
            )}

            {isTokenApproved ? (
              <Button
                type={"submit"}
                className="w-full"
                loading={loading}
                disabled={isDisableBuy}
              >
                Purchase item
              </Button>
            ) : (
              <ERC20TokenApproval
                allowanceBalance={allowanceBalance}
                quoteToken={quoteToken}
                onApproveMinAmount={handleApproveMinAmount}
                onAllowanceInput={() => handleAllowanceInput}
                onApproveMaxAmount={handleApproveMaxAmount}
                onApproveToken={handleApproveToken}
                loading={loading}
                registerAllowanceInput={register(
                  "allowance",
                  formRules.allowance
                )}
              />
            )}
            <FormValidationMessages errors={errors} />
          </form>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
