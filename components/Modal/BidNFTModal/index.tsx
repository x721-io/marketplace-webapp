import { useEffect, useMemo, useState } from "react";
import Text from "@/components/Text";
import Button from "@/components/Button";
import { daysRanges, FormState, NFT } from "@/types";
import { APIResponse } from "@/services/api/types";
import {
  Address,
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
} from "wagmi";
import { findTokenByAddress } from "@/utils/token";
import { tokenOptions, tokens } from "@/config/tokens";
import { useCalculateFee } from "@/hooks/useMarket";
import { useForm } from "react-hook-form";
import { formatUnits, MaxUint256, parseEther, parseUnits } from "ethers";
import { toast } from "react-toastify";
import Input from "@/components/Form/Input";
import { formatDisplayedNumber, genRandomNumber } from "@/utils";
import FeeCalculator from "@/components/FeeCalculator";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { numberRegex } from "@/utils/regex";
import Select from "@/components/Form/Select";
import ERC20TokenApproval from "@/components/ERC20TokenApproval";
import {
  useBidURC1155UsingNative,
  useBidURC1155UsingURC20,
  useBidURC721UsingNative,
  useBidURC721UsingURC20,
} from "@/hooks/useBidNFT";
import { useMarketApproveERC20 } from "@/hooks/useMarketApproveERC20";
import NFTMarketData = APIResponse.NFTMarketData;
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import Icon from "@/components/Icon";
import Image from "next/image";
import moment from "moment";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { formatEther } from "viem";

interface Props extends MyModalProps {
  nft: NFT;
  marketData?: NFTMarketData;
}

export default function BidNFTModal({ nft, show, onClose, marketData }: Props) {
  const { getERC20Allowance, createBidOrder, isApproving, isCreatingOrder, isSigningOrderData} = useMarketplaceV2(nft);
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const onBidURC721UsingNative = useBidURC721UsingNative(nft);
  const onBidURC1155UsingNative = useBidURC1155UsingNative(nft);
  const onBidURC721UsingURC20 = useBidURC721UsingURC20(nft);
  const onBidURC1155UsingURC20 = useBidURC1155UsingURC20(nft);
  const {
    handleSubmit,
    watch,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormState.BidNFT>({
    defaultValues: {
      quantity: "1",
      start: new Date().getTime(),
      end: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      daysRange: "30_DAYS",
      quoteToken: tokens["wu2u"].address,
      salt: genRandomNumber(8, 10),
    },
  });
  const [currentAllowance, setCurrentAllowance] = useState(BigInt(0));
  const [price, quantity, quoteToken, start, end, daysRange, salt] = watch([
    "price",
    "quantity",
    "quoteToken",
    "start",
    "end",
    "daysRange",
    "salt",
  ]);
  const { data: quoteTokenBalance } = useContractRead({
    abi: erc20ABI,
    account: address,
    address: quoteToken,
    functionName: "balanceOf",
    args: [address as Address],
    enabled: !!address && !!quoteToken,
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

  const {
    allowance: allowanceBalance,
    isTokenApproved,
    onApproveToken,
  } = useMarketApproveERC20(
    token?.address as Address,
    nft.collection.type,
    parseUnits(price && !isNaN(Number(price)) ? price : "0", token?.decimal) +
      buyerFee
  );

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
      required: true,
    },
  };

  const { data: tokenBalance } = useBalance({
    address: address,
    enabled: !!address && !!token?.address,
    token: quoteToken,
    watch: true,
  });

  const onSubmit = async ({ price, quantity }: FormState.BidNFT) => {
    // const toastId = toast.loading("Preparing data...", { type: "info" });
    // setLoading(true);
    // try {
    //   switch (nft.collection.type) {
    //     case "ERC721":
    //       if (quoteToken === tokens.wu2u.address) {
    //         await onBidURC721UsingNative(price);
    //       } else {
    //         await onBidURC721UsingURC20(price, quoteToken);
    //       }
    //       break;
    //     case "ERC1155":
    //       if (quoteToken === tokens.wu2u.address) {
    //         await onBidURC1155UsingNative(price, quantity);
    //       } else {
    //         await onBidURC1155UsingURC20(price, quoteToken, quantity);
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    //   toast.update(toastId, {
    //     render: "Bid placed successfully",
    //     type: "success",
    //     autoClose: 1000,
    //     closeButton: true,
    //     isLoading: false,
    //   });
    //   onClose?.();
    // } catch (e: any) {
    //   console.error(e);
    //   toast.update(toastId, {
    //     render: `Bid placed failed. Error report: ${e.message}`,
    //     type: "error",
    //     autoClose: 5000,
    //     closeButton: true,
    //     isLoading: false,
    //   });
    // } finally {
    //   setLoading(false);
    //   reset();
    // }
    if (!marketData) return;
    const params: FormState.BidNFT = {
      quoteToken,
      price,
      quantity,
      start,
      salt,
      end,
      daysRange,
    };
    await createBidOrder(params, nft, marketData);
  };

  // const handleApproveToken = async () => {
  //   const toastId = toast.loading("Preparing data...", { type: "info" });
  //   setLoading(true);
  //   try {
  //     toast.update(toastId, { render: "Sending token", type: "info" });
  //     const allowanceBigint =
  //       allowance === "UNLIMITED"
  //         ? MaxUint256
  //         : parseUnits(allowance, token?.decimal);
  //     await onApproveToken(allowanceBigint);

  //     toast.update(toastId, {
  //       render: "Approve token successfully",
  //       type: "success",
  //       autoClose: 1000,
  //       closeButton: true,
  //       isLoading: false,
  //     });
  //   } catch (e) {
  //     toast.update(toastId, {
  //       render: "Failed to approve token",
  //       type: "error",
  //       autoClose: 1000,
  //       closeButton: true,
  //       isLoading: false,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const getAllowance = async () => {
      const allowance = await getERC20Allowance(quoteToken);
      setCurrentAllowance(BigInt(allowance.toString()));
    };
    if (quoteToken && show) {
      getAllowance();
    }
  }, [quoteToken, show]);

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

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body className="p-10 px-[30px]">
        <div className="flex flex-col justify-center items-center gap-4">
          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="font-bold">
              <Text className="mb-3" variant="heading-xs">
                Place a Bid
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

            {/* <div>
              <label className="text-body-14 text-secondary font-semibold mb-1">
                {nft.collection.type === "ERC721" ? "Price" : "Price per unit"}
              </label>
              <Input
                maxLength={18}
                size={18}
                error={!!errors.price}
                register={register("price", formRules.price)}
              />
            </div> */}

            <div className="w-full flex flex-col">
              <label className="text-body-14 text-secondary font-semibold mb-1">
                {nft.collection.type === "ERC721"
                  ? "Bid Price"
                  : "Bid price per unit"}
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
                            placeholder="Enter bid price"
                            className="w-full outline-none border-none"
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
                Bid expiration date
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
            {/* 
            {isTokenApproved ? (
              <Button
                disabled={!isTokenApproved}
                type={"submit"}
                className="w-full"
                loading={loading}
              >
                Place a Bid
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
            )} */}
            <Button
              disabled={!isTokenApproved}
              type={"submit"}
              className="w-full"
              loading={isApproving || isCreatingOrder || isSigningOrderData}
            >
              Place a Bid
            </Button>
            <FormValidationMessages errors={errors} />
          </form>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
