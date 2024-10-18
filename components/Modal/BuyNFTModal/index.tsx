import { useCalculateFee } from "@/hooks/useMarket";
import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { formatUnits, MaxUint256, parseUnits } from "ethers";
import { findTokenByAddress } from "@/utils/token";
import { useEffect, useMemo, useState } from "react";
import {
  Address,
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
} from "wagmi";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { FormState, MarketEvent, MarketEventV2, NFT } from "@/types";
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
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { useGetMarketDataByNftId } from "@/hooks/useQuery";
import { ADDRESS_ZERO } from "@/config/constants";
import { formatEther } from "viem";

interface Props extends MyModalProps {
  nft: NFT;
  saleData: MarketEventV2;
}

export default function BuyNFTModal({ nft, saleData, show, onClose }: Props) {
  const { buySingle, deposit, getERC20Allowance, getOrderDetails } =
    useMarketplaceV2(nft);
  const { data: marketData, isLoading: isLoadingMarketData } =
    useGetMarketDataByNftId(nft.collection.address as string, nft.id as string);
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
  const { data: erc20TokenBalance } = useContractRead({
    abi: erc20ABI,
    account: address,
    address: marketData.sellInfo[0].quoteToken as Address,
    functionName: "balanceOf",
    args: [address as Address],
    enabled: !!address && marketData.sellInfo[0].quoteToken !== ADDRESS_ZERO,
  });
  const nativeTokenBalance = useBalance({
    address,
    enabled: !!address && marketData.sellInfo[0].quoteToken === ADDRESS_ZERO,
  });
  const quoteTokenBalance =
    marketData.sellInfo[0].quoteToken === ADDRESS_ZERO
      ? nativeTokenBalance.data?.value
      : erc20TokenBalance;
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
          BigInt(quantity && !isNaN(quantity) ? quantity : "0"),
    onSuccess: (data) => {
      if (!saleData.price || isNaN(Number(saleData.price))) return;
      const priceBigint =
        nft.collection.type === "ERC721"
          ? BigInt(saleData.price || "0")
          : BigInt(saleData.price || "0") *
            BigInt(quantity && !isNaN(quantity) ? quantity : "0");
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

  const { data: tokenBalance } = useBalance({
    address: address,
    enabled: !!address && !!token?.address,
    token: token?.address === tokens.wu2u.address ? undefined : token?.address,
    watch: true,
  });

  const totalPriceBN = useMemo(() => {
    if (!quantity) return BigInt(0);
    return (
      BigInt(saleData.price || "0") *
      BigInt(quantity && !isNaN(quantity) ? quantity : "0")
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
      await buyURC721UsingURC20(
        quoteToken,
        BigInt(saleData.price) + BigInt(buyerFee)
      );
      toast.success(`Order has been fulfilled successfully`, {
        autoClose: 1000,
        closeButton: true,
      });
      onClose?.();
    } catch (err: any) {
      toast.error(`Error report: ${err.message}`, {
        autoClose: 2500,
        closeButton: true,
      });
      onClose?.();
    }
  };

  // const handleBuyURC1155UsingNative = async (quantity: number) => {
  //   if (!saleData) return;
  //   setLoading(true);
  //   try {
  //     await buyURC1155UsingNative(
  //       saleData.operationId,
  //       BigInt(saleData.price) + BigInt(buyerFee),
  //       quantity
  //     );
  //     toast.success(`Order has been fulfilled successfully`, {
  //       autoClose: 1000,
  //       closeButton: true,
  //     });
  //     onClose?.();
  //   } catch (err: any) {
  //     toast.error(`Error report: ${err.message}`, {
  //       autoClose: 2500,
  //       closeButton: true,
  //     });
  //     onClose?.();
  //   }
  // };

  // const handleBuyURC1155UsingURC20 = async (quantity: number) => {
  //   if (!saleData) return;
  //   setLoading(true);
  //   try {
  //     await buyURC1155UsingURC20(saleData.operationId, quantity);
  //     toast.success(`Order has been fulfilled successfully`, {
  //       autoClose: 1000,
  //       closeButton: true,
  //     });
  //     onClose?.();
  //   } catch (err: any) {
  //     toast.error(`Error report: ${err.message}`, {
  //       autoClose: 2500,
  //       closeButton: true,
  //     });
  //     onClose?.();
  //   }
  // };

  const onSubmit = async ({ quantity }: FormState.BuyNFT) => {
    // if (!saleData) return;
    // await api.getFloorPrice({ address: nft.collection.address });
    // switch (nft.collection.type) {
    //   case "ERC721":
    //     if (quoteToken === tokens.wu2u.address) {
    //       await handleBuyURC721UsingNative();
    //     } else {
    //       await handleBuyURC721UsingURC20();
    //     }
    //     break;
    //   case "ERC1155":
    //     if (quoteToken === tokens.wu2u.address) {
    //       await handleBuyURC1155UsingNative(quantity);
    //     } else {
    //       await handleBuyURC1155UsingURC20(quantity);
    //     }
    //     break;
    //   default:
    //     break;
    // }
    // setLoading(false);
    // reset();
    // alert(1);
    // await buySingle(marketData.sellInfo[0]);
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

  const handleBuy = async () => {
    const orderDetails = await getOrderDetails(
      marketData.sellInfo[0].sig,
      marketData.sellInfo[0].index
    );
    if (!orderDetails) return;
    await buySingle(orderDetails);
  };

  const handleDeposit = async () => {
    const orderDetails = await getOrderDetails(
      marketData.sellInfo[0].sig,
      marketData.sellInfo[0].index
    );
    if (!orderDetails || erc20TokenBalance === null || erc20TokenBalance === undefined) return;
    const depositAmt = BigInt(orderDetails.takeAssetValue) - erc20TokenBalance;
    await deposit(orderDetails.takeAssetAddress, depositAmt.toString());
  };

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
              {/* <div className="flex items-center justify-between mb-1">
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
              </div> */}
              <Input readOnly value={token?.symbol} />
            </div>

            {nft.collection.type === "ERC721" && (
              <FeeCalculator
                mode="buyer"
                nft={nft}
                price={BigInt(saleData?.price || "0")}
                quoteToken={token?.address}
                sellerFee={sellerFee}
                buyerFee={buyerFee}
                sellerFeeRatio={sellerFeeRatio}
                buyerFeeRatio={buyerFeeRatio}
                netReceived={netReceived}
                royaltiesFee={royaltiesFee}
                tokenBalance={quoteTokenBalance ?? BigInt("0")}
              />
            )}

            {nft.collection.type === "ERC1155" && (
              <>
                <div>
                  <Text className="text-secondary font-semibold mb-1">
                    Quantity
                  </Text>
                  <Input
                    maxLength={3}
                    size={3}
                    error={!!errors.quantity}
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
                  tokenBalance={quoteTokenBalance ?? BigInt("0")}
                />
              </>
            )}
            <Button
              disabled={
                !quoteTokenBalance ||
                quoteTokenBalance < BigInt(marketData.sellInfo[0].price)
              }
              onClick={handleBuy}
            >
              Purchase Item
            </Button>

            {quoteTokenBalance !== null &&
              quoteTokenBalance !== undefined &&
              quoteTokenBalance < BigInt(marketData.sellInfo[0].price) && (
                <Button onClick={handleDeposit}>Deposit</Button>
              )}

            <FormValidationMessages errors={errors} />
          </form>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
