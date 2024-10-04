import { useEffect, useState } from "react";
import moment from "moment";
import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import { useMemo } from "react";
import { useCalculateFee } from "@/hooks/useMarket";
import Button from "@/components/Button";
import Select from "@/components/Form/Select";
import { tokenOptions, tokens } from "@/config/tokens";
import { useForm } from "react-hook-form";
import useAuthStore from "@/store/auth/store";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { daysRanges, FormState, NFT } from "@/types";
import { APIResponse } from "@/services/api/types";
import NFTMarketData = APIResponse.NFTMarketData;
import FeeCalculator from "@/components/FeeCalculator";
import { parseUnits } from "ethers";
import { findTokenByAddress } from "@/utils/token";
import { numberRegex } from "@/utils/regex";
import { useSellURC1155, useSellURC721 } from "@/hooks/useSellNFT";
import { toast } from "react-toastify";
import { useMarketApproveNFT } from "@/hooks/useMarketApproveNFT";
import NFTApproval from "@/components/NFTApproval";
import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";
import { Dropdown } from "@/components/X721UIKits/Dropdown";
import Icon from "@/components/Icon";
import Image from "next/image";
import useMarketplaceV2 from "@/hooks/useMarketplaceV2";
import { genRandomNumber } from "@/utils";
import { Address, erc20ABI, useAccount, useContractRead } from "wagmi";

interface Props extends MyModalProps {
  nft: NFT;
  marketData: NFTMarketData;
}

export default function SellNFTModal({
  nft,
  show,
  marketData,
  onClose,
}: Props) {
  const { createSellOrder, isApproving, isCreatingOrder, isSigningOrderData } =
    useMarketplaceV2(nft);
  const api = useMarketplaceApi();
  const [loading, setLoading] = useState(false);
  const type = nft.collection.type;
  const wallet = useAuthStore((state) => state.profile?.publicKey);
  const ownerData = useMemo(() => {
    if (!wallet || !marketData) return undefined;
    return marketData.owners.find(
      (owner) => owner.publicKey.toLowerCase() === wallet.toLowerCase()
    );
  }, [wallet, marketData]);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormState.SellNFT>({
    defaultValues: {
      quantity: 1,
      start: new Date().getTime(),
      end: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      daysRange: "30_DAYS",
      quoteToken: tokens["u2u"].address,
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
  const { address } = useAccount();
  const token = useMemo(() => findTokenByAddress(quoteToken), [quoteToken]);
  const [isApprovedForAll, setApprovedForAll] = useState(false);
  const onSellURC721 = useSellURC721(nft);
  const onSellURC1155 = useSellURC1155(nft);
  const { data: tokenBalance } = useContractRead({
    abi: erc20ABI,
    account: address,
    address: quoteToken,
    functionName: "balanceOf",
    args: [address as Address],
    enabled: !!address && !!quoteToken,
  });
  const { onApproveTokenForAll, onApprovalTokenForSingle } =
    useMarketApproveNFT(nft);

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
    price: parseUnits(price?.toString() || "0", token?.decimal),
    onSuccess: (data) => {
      if (!price || isNaN(Number(price))) return;
    },
  });

  const formRules = {
    price: {
      required: "Please input price",
      validate: {
        isNumber: (v: number) =>
          !isNaN(v) || "Please input a valid price number",
        min: (v: number) => Number(v) > 0 || "Price must be greater than 0",
        max: (v: number) =>
          Number(v) < 10e15 - 1 || "Please input a safe price number",
        decimals: (v: number) => {
          const decimalPart = (v.toString().split(".")[1] || "").length;
          return decimalPart <= 18 || "The decimal length cannot exceed 18";
        },
      },
    },
    quantity: {
      pattern: { value: numberRegex, message: "Wrong number format" },
      validate: {
        required: (v: number) => {
          if (type === "ERC721") return true;
          return (
            (!!v && !isNaN(v) && v > 0) ||
            "Please input quantity of item to sell"
          );
        },
        amount: (v: number) => {
          if (type === "ERC721") return true;
          if (!ownerData) return "Quantity exceeds owned amount";
          return (
            v <= Number(ownerData.quantity) || "Quantity exceeds owned amount"
          );
        },
      },
    },
  };

  const onSubmit = async ({
    price,
    quoteToken,
    quantity,
  }: FormState.SellNFT) => {
    const params: FormState.SellNFT = {
      daysRange,
      end,
      price,
      quoteToken,
      quantity,
      start,
      salt,
    };
    await createSellOrder(params);

    // const toastId = toast.loading("Preparing data...", { type: "info" });
    // setLoading(true);
    // try {
    //   if (nft.collection.type === "ERC721") {
    //     await onSellURC721(price, quoteToken);
    //   } else {
    //     await onSellURC1155(price, quoteToken, quantity);
    //   }
    //   await api.getFloorPrice({ address: nft.collection.address });
    //   toast.update(toastId, {
    //     render: "Your NFT has been put on sale!",
    //     type: "success",
    //     autoClose: 1000,
    //     closeButton: true,
    //     isLoading: false,
    //   });
    //   onClose?.();
    // } catch (e: any) {
    //   console.error(e);
    //   toast.update(toastId, {
    //     render: `Your NFT has been unsold. Error report: ${e.message}`,
    //     type: "error",
    //     autoClose: 1000,
    //     closeButton: true,
    //     isLoading: false,
    //   });
    // } finally {
    //   setLoading(false);
    //   reset();
    // }
  };

  const handleApproveTokenForSingle = async () => {
    const toastId = toast.loading("Preparing data...", { type: "info" });
    setLoading(true);
    try {
      toast.update(toastId, { render: "Sending token", type: "info" });
      await onApprovalTokenForSingle();
      toast.update(toastId, {
        render: "Approve token successfully",
        type: "success",
        autoClose: 1000,
        closeButton: true,
        isLoading: false,
      });
    } catch (e: any) {
      toast.update(toastId, {
        render: `Failed to approve token. Error report: ${e.message}`,
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
      toast.loading("Creating order...", {
        type: "info",
        toastId: "create-order",
      });
    } else {
      toast.dismiss("create-order");
    }
  }, [isApproving, isSigningOrderData, isCreatingOrder]);

  useEffect(() => {
    if (!nft) return;
    // const getIfApprovedForAll = async () => {
    //   const isApproved = await checkIfApprovedForAll()
    //   setApprovedForAll(isApproved ? true : false)
    // }
    // getIfApprovedForAll()
  }, [nft]);

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body className="py-10 px-[30px]">
        <div className="flex flex-col justify-center items-center gap-4">
          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="font-bold">
              <Text className="mb-3" variant="heading-xs">
                Sell NFT
              </Text>
              <Text className="text-secondary" variant="body-16">
                Creating sell order for{" "}
                <span className="text-primary font-bold">{nft.name}</span> from{" "}
                <span className="text-primary font-bold">
                  {nft.collection.name}
                </span>{" "}
                collection
              </Text>
            </div>

            <div className="w-full flex flex-col">
              <label className="text-body-14 text-secondary font-semibold mb-1">
                Price
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
                            placeholder="Enter price"
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
                  {Object.keys(tokens).map((key) => (
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
                <Text className="text-secondary font-semibold mb-1">
                  Quantity
                </Text>
                <Input
                  maxLength={3}
                  size={3}
                  error={!!errors.quantity}
                  register={register("quantity", formRules.quantity)}
                  containerClass="mb-4"
                  appendIcon={
                    <Text className="mr-5">Owned: {ownerData?.quantity}</Text>
                  }
                />
                <FeeCalculator
                  mode="seller"
                  nft={nft}
                  price={parseUnits(
                    String(Number(price || 0) * Number(quantity || 0)),
                    token?.decimal
                  )}
                  quoteToken={token?.address}
                  sellerFee={sellerFee}
                  buyerFee={buyerFee}
                  sellerFeeRatio={sellerFeeRatio}
                  buyerFeeRatio={buyerFeeRatio}
                  netReceived={netReceived}
                  tokenBalance={tokenBalance ?? BigInt(0)}
                  royaltiesFee={royaltiesFee}
                />
              </div>
            ) : (
              <FeeCalculator
                mode="seller"
                nft={nft}
                quoteToken={token?.address}
                price={parseUnits(String(price || 0), token?.decimal)}
                sellerFee={sellerFee}
                buyerFee={buyerFee}
                sellerFeeRatio={sellerFeeRatio}
                buyerFeeRatio={buyerFeeRatio}
                netReceived={netReceived}
                royaltiesFee={royaltiesFee}
                tokenBalance={tokenBalance ?? BigInt(0)}
              />
            )}
            <div className="w-full flex flex-col">
              <label className="text-body-14 text-secondary font-semibold mb-1">
                Expiration date
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

            <FormValidationMessages errors={errors} />
            {/* {isApprovedForAll ? (
              <Button type={"submit"} className="w-full" loading={loading}>
                Put on sale
              </Button>
            ) : (
              <NFTApproval
                loading={loading}
                nft={nft}
                isMarketContractApprovedToken={isApprovedForAll}
                handleApproveTokenForAll={handleApproveTokenForAll}
                handleApproveTokenForSingle={handleApproveTokenForSingle}
              />
            )} */}
            <Button
              type={"submit"}
              className="w-full"
              loading={isCreatingOrder || isApproving || isSigningOrderData}
            >
              Put on sale
            </Button>
          </form>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
