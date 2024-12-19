import { useEffect, useMemo, useState } from "react";
import Text from "@/components/Text";
import Button from "@/components/Button";
import { daysRanges, FormState, NFT } from "@/types";
import { APIResponse } from "@/services/api/types";
import {
  useAccount,
  useBalance,
  useContractRead,
  useReadContract,
} from "wagmi";
import { findTokenByAddress } from "@/utils/token";
import { tokens } from "@/config/tokens";
import { useCalculateFee } from "@/hooks/useMarket";
import { useForm } from "react-hook-form";
import { parseUnits } from "ethers";
import { toast } from "react-toastify";
import Input from "@/components/Form/Input";
import { formatDisplayedNumber, genRandomNumber, isNumber } from "@/utils";
import FeeCalculator from "@/components/FeeCalculator";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { numberRegex } from "@/utils/regex";
import NFTMarketData = APIResponse.NFTMarketData;
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import Icon from "@/components/Icon";
import Image from "next/image";
import moment from "moment";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { ADDRESS_ZERO } from "@/config/constants";
import StepsModal from "../StepsModal";
import { Address, erc20Abi } from "viem";

interface Props extends MyModalProps {
  nft: NFT;
  marketData?: NFTMarketData;
}

export default function BidNFTModal({ nft, show, onClose, marketData }: Props) {
  const {
    getERC20Allowance,
    createBidOrder,
    isApproving,
    isCreatingOrder,
    isSigningOrderData,
    deposit,
    isDepositing,
  } = useMarketplaceV2(nft);
  const { address } = useAccount();
  const [errorStep, setErrorStep] = useState<{
    stepIndex: number;
    reason: string;
  } | null>(null);
  const [currentFormState, setCurrentFormState] = useState<"INPUT" | "CREATE">(
    "INPUT"
  );
  const [currentStep, setCurrentStep] = useState(0);
  const {
    handleSubmit,
    watch,
    register,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormState.BidNFT>({
    defaultValues: {
      quantity: "1",
      price: "1",
      start: new Date().getTime(),
      end: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      daysRange: "30_DAYS",
      quoteToken: tokens["wu2u"].address,
      salt: genRandomNumber(8, 10),
    },
  });
  const [price, quantity, quoteToken, start, end, daysRange, salt] = watch([
    "price",
    "quantity",
    "quoteToken",
    "start",
    "end",
    "daysRange",
    "salt",
  ]);
  const { data: quoteTokenBalance } = useReadContract({
    abi: erc20Abi,
    account: address,
    address: quoteToken,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled: !!address && !!quoteToken,
    },
  });
  const token = useMemo(() => findTokenByAddress(quoteToken), [quoteToken]);
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
    price: parseUnits(
      price && !isNaN(Number(price)) ? price : "0",
      token?.decimal
    ),
    onSuccess: (data) => {
      if (!price || isNaN(Number(price))) return;
      const priceBigint = parseUnits(
        !isNaN(Number(price)) ? (price as string) : "0",
        token?.decimal
      );
      const { buyerFee } = data;
    },
  });

  const formRules = {
    price: {
      required: "Please input bid price",
      min: { value: 0, message: "Price cannot be zero" },
      validate: {
        isNumber: (v: any) => !isNaN(v) || "Please input a valid number",
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
      required: true,
    },
  };

  const nativeTokenBalance = useBalance({
    address,
    query: {
      enabled: !!address,
    },
  });

  const onSubmit = async () => {
    if (!marketData) return;
    setCurrentStep(0);
    setErrorStep(null);
    setCurrentFormState("CREATE");
    const params: FormState.BidNFT = {
      quoteToken,
      price,
      quantity,
      start,
      salt,
      end,
      daysRange,
      netPrice:
        parseFloat(price.toString()) - parseFloat(price.toString()) * 0.0125,
      totalPrice:
        (parseFloat(price.toString()) + parseFloat(price.toString()) * 0.0125) *
        Number(quantity),
    };

    const onApproveERC20Success = () => {
      setCurrentStep(1);
    };

    const onSignSuccess = () => {
      setCurrentStep(2);
    };

    const onCreateOrderAPISuccess = () => {
      setCurrentStep(3);
    };

    const onRequestError = (
      requestType: "approve" | "sign" | "create_order_api",
      error: Error
    ) => {
      let errorStepIndex = -1;
      switch (requestType) {
        case "approve":
          errorStepIndex = 0;
          break;
        case "sign":
          errorStepIndex = 1;
          break;
        case "create_order_api":
          errorStepIndex = 2;
          break;
      }
      setErrorStep({
        stepIndex: errorStepIndex,
        reason: error.message,
      });
    };
    try {
      await createBidOrder(
        { ...params },
        nft,
        marketData,
        onApproveERC20Success,
        onSignSuccess,
        onCreateOrderAPISuccess,
        onRequestError
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isApproving) {
      toast.loading("Approving token for all...", {
        type: "info",
        toastId: "approve-all",
      });
    } else {
      toast.dismiss("approve-all");
    }
    if (isSigningOrderData) {
      toast.loading("Signing order data...", {
        type: "info",
        toastId: "sign-order-data",
      });
    } else {
      toast.dismiss("sign-order-data");
    }
    if (isCreatingOrder) {
      toast.loading("Creating a Bid...", {
        type: "info",
        toastId: "create-order",
      });
    } else {
      toast.dismiss("create-order");
    }
  }, [isApproving, isSigningOrderData, isCreatingOrder]);

  const onRetry = async () => {
    setErrorStep(null);
    setCurrentStep(0);
    onSubmit();
  };

  const handleDeposit = async () => {
    if (!nativeTokenBalance || !nativeTokenBalance.data) return;
    try {
      const totalPrice = Number(price) * Number(quantity);
      const depositAmt =
        parseUnits(totalPrice.toString(), 18) - quoteTokenBalance!;
      if (depositAmt > nativeTokenBalance.data.value) {
        toast.error(`You don't have enough ${tokens["u2u"].symbol}`);
        return;
      }
      await deposit(quoteToken, depositAmt.toString());
    } catch (err: any) {
      toast.error("Deposit failed");
    }
  };

  useEffect(() => {
    if (!price || !isNumber(price)) {
      setError("price", {
        type: "custom",
        message: `Price must be a number`,
      });
      return;
    }
    if (Number(price) <= 0) {
      setError("price", {
        type: "custom",
        message: `Price must be greater than 0`,
      });
      return;
    }
    if (isNumber(quoteTokenBalance)) {
      const totalPrice = Number(price) * Number(quantity);
      if (parseUnits(totalPrice.toString(), 18) > quoteTokenBalance!) {
        setError("price", {
          type: "custom",
          message: `You don't have enough ${tokens["wu2u"].symbol}`,
        });
      } else {
        clearErrors("price");
      }
    }
  }, [price, quoteTokenBalance, clearErrors, setError, quantity]);

  return (
    <>
      <MyModal.Root
        show={show && currentFormState === "INPUT"}
        onClose={onClose}
      >
        <MyModal.Body className="p-10 px-[30px]">
          <div className="flex flex-col justify-center items-center gap-4">
            <form
              className="w-full flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="font-bold">
                <Text className="mb-3" variant="heading-xs">
                  Make an offer
                </Text>
                <Text className="text-secondary" variant="body-16">
                  Make an offer for{" "}
                  <span className="text-primary font-bold">{nft.name}</span>{" "}
                  from{" "}
                  <span className="text-primary font-bold">
                    {nft.collection.name}
                  </span>{" "}
                  collection
                </Text>
              </div>
              <div className="w-full flex flex-col">
                <label className="text-body-14 text-secondary font-semibold mb-1">
                  {nft.collection.type === "ERC721"
                    ? "Offer price"
                    : "Offer price per unit"}
                </label>
                <div className="w-full relative rounded-2xl">
                  <Dropdown.Root
                    dropdownContainerClassName="w-full"
                    label=""
                    icon={
                      <div className="w-full bg-surface-soft flex items-center justify-center gap-3 rounded-2xl px-2 h-full cursor-pointer">
                        <div className="flex-1 flex justify-between text-[0.95rem] items-center">
                          <div>
                            <Input
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Enter offer price"
                              className="w-full !outline-none !border-none !ring-transparent"
                              maxLength={18}
                              size={18}
                              error={!!errors.price}
                              register={register("price", formRules.price)}
                              type="number"
                            />
                          </div>
                          <div>{token?.symbol}</div>
                        </div>
                        <div className="rounded-lg p-1">
                          <Icon name="chevronDown" width={14} height={14} />
                        </div>
                      </div>
                    }
                  >
                    {Object.keys(tokens)
                      .filter((t) => t !== "u2u")
                      .map((key) => (
                        <Dropdown.Item
                          key={tokens[key].symbol}
                          onClick={() =>
                            setValue("quoteToken", tokens[key].address)
                          }
                        >
                          <div className="w-full flex items-center gap-2">
                            <Image
                              src={tokens[key].logo}
                              alt="token-image"
                              className="rounded-full"
                              width={22}
                              height={22}
                            />
                            {tokens[key].name}
                          </div>
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Root>
                </div>
              </div>

              {nft.collection.type === "ERC1155" ? (
                <div>
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
                          {formatDisplayedNumber(marketData?.totalSupply || 0)}
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
                      appendIcon={<Text>{token?.symbol}</Text>}
                    />
                  </div>
                  <FeeCalculator
                    qty={Number(quantity)}
                    mode="buyer"
                    nft={nft}
                    price={parseUnits(
                      String(Number(price) * Number(quantity) || 0),
                      token?.decimal
                    )}
                    quoteToken={token?.address}
                    sellerFee={sellerFee}
                    buyerFee={buyerFee}
                    sellerFeeRatio={sellerFeeRatio}
                    buyerFeeRatio={buyerFeeRatio}
                    netReceived={netReceived}
                    royaltiesFee={royaltiesFee}
                    tokenBalance={quoteTokenBalance ?? BigInt(0)}
                  />
                </div>
              ) : (
                <FeeCalculator
                  qty={Number(quantity)}
                  mode="buyer"
                  nft={nft}
                  price={parseUnits(
                    price && !isNaN(Number(price)) ? price : "0",
                    token?.decimal
                  )}
                  quoteToken={token?.address}
                  sellerFee={sellerFee}
                  buyerFee={buyerFee}
                  sellerFeeRatio={sellerFeeRatio}
                  buyerFeeRatio={buyerFeeRatio}
                  netReceived={netReceived}
                  royaltiesFee={royaltiesFee}
                  tokenBalance={quoteTokenBalance ?? BigInt(0)}
                />
              )}

              <div className="w-full flex flex-col">
                <label className="text-body-14 text-secondary font-semibold mb-1">
                  Offer&rsquo;s expiration date
                </label>
                <div className="w-full relative rounded-2xl">
                  <Dropdown.Root
                    dropdownContainerClassName="w-full"
                    label=""
                    icon={
                      <div className="w-[100%] relative bg-surface-soft flex items-center justify-center gap-3 rounded-2xl py-3 px-5 h-full cursor-pointer">
                        <div className="flex-1 flex justify-between text-[0.95rem]">
                          <div>{moment(end).format("MM.DD.YYYY HH:mm A")}</div>
                          <div>
                            {daysRange.replaceAll("_", " ").toLowerCase()}
                          </div>
                        </div>
                        <div className="rounded-lg p-1">
                          <Icon name="chevronDown" width={14} height={14} />
                        </div>
                      </div>
                    }
                  >
                    {daysRanges.map((item) => (
                      <Dropdown.Item
                        key={item}
                        onClick={() => {
                          setValue("daysRange", item);
                          const newEnd =
                            start +
                            parseInt(item.split("_")[0]) * 24 * 60 * 60 * 1000;
                          setValue("end", newEnd);
                        }}
                      >
                        <div className="w-full flex items-center gap-2">
                          {item.replaceAll("_", " ").toLowerCase()}
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Root>
                </div>
              </div>
              <div className="w-full flex items-center justify-between gap-3">
                <Button
                  disabled={errors.price !== undefined}
                  type={"submit"}
                  className="flex-1"
                  loading={isApproving || isCreatingOrder || isSigningOrderData}
                >
                  Make offer
                </Button>
                {errors.price && (
                  <Button
                    loading={isDepositing}
                    className="flex-1"
                    onClick={handleDeposit}
                  >
                    Add {tokens["wu2u"].symbol}
                  </Button>
                )}
              </div>
              <FormValidationMessages errors={errors} />
            </form>
          </div>
        </MyModal.Body>
      </MyModal.Root>
      <StepsModal
        title="Bid NFT"
        erorStep={errorStep}
        isOpen={currentFormState === "CREATE"}
        onClose={() => {
          setCurrentFormState("INPUT");
          onClose && onClose();
        }}
        currentStep={currentStep}
        onRetry={onRetry}
        steps={[
          {
            title: "Approve ERC20 token amount",
            description: "Approve ERC20 amount",
          },
          {
            title: "Sign bid data",
            description: "Sign order data",
          },
          {
            title: "Create bid",
            description: "Create bid",
          },
        ]}
      />
    </>
  );
}
