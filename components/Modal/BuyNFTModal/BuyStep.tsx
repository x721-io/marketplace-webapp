import { useBuyNFT, useCalculateFee, useMarketTokenApproval } from "@/hooks/useMarket";
import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { MaxUint256, formatEther, formatUnits, parseUnits } from "ethers";
import { findTokenByAddress } from "@/utils/token";
import { useEffect, useMemo, useState } from "react";
import { Address, useAccount, useBalance } from "wagmi";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { NFT, MarketEvent, FormState } from "@/types";
import FeeCalculator from "@/components/FeeCalculator";
import { formatDisplayedBalance } from "@/utils";
import { numberRegex } from "@/utils/regex";
import Select from "@/components/Form/Select";
import { tokenOptions, tokens } from "@/config/tokens";
import Erc20ApproveToken from "@/components/Erc20ApproveToken";
import { toast } from "react-toastify";

interface Props {
  onSuccess: () => void;
  onError: (error: Error) => void;
  nft: NFT;
  saleData?: MarketEvent;
}

export default function BuyStep({ onSuccess, onError, saleData, nft }: Props) {
  const { address } = useAccount();

  const { onBuyERC721, onBuyERC1155, isSuccess, isLoading, error } = useBuyNFT(nft);
  const {
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormState.BuyNFT>({
    defaultValues: {
      quoteToken: saleData?.quoteToken
    }
  });
  const [price, quantity, quoteToken, allowance] = watch(['price', 'quantity', 'quoteToken', 'allowance']);
  const token = useMemo(() => findTokenByAddress(saleData?.quoteToken), [saleData]);
  
  const [loading, setLoading] = useState(false);
  const {
    sellerFee,
    buyerFee,
    royaltiesFee,
    netReceived,
    sellerFeeRatio,
    buyerFeeRatio
  } = useCalculateFee({
    collectionAddress: nft.collection.address,
    tokenId: nft.id || nft.u2uId,
    price: nft.collection.type === 'ERC721' ? BigInt(saleData?.price || '0') : BigInt(saleData?.price || "0") * BigInt(quantity || '0'),
    onSuccess: (data) => {
      if (!saleData?.price || isNaN(Number(saleData?.price))) return;
      const priceBigint = nft.collection.type === 'ERC721' ? BigInt(saleData?.price || '0') : BigInt(saleData?.price || "0") * BigInt(quantity || '0')
      const { buyerFee } = data;
      const totalCostBigint = priceBigint + buyerFee;
      setValue('allowance', formatUnits(totalCostBigint, token?.decimal));
    }
  });

  const {
    allowance: allowanceBalance,
    isTokenApproved,
    onApproveToken
  } = useMarketTokenApproval(token?.address as Address, nft.collection.type, parseUnits(price || '0', token?.decimal) + buyerFee);
  
  const formRules = {
    allowance: {
      required: true
    }
  };

  const { data: tokenBalance } = useBalance({
    address: address,
    enabled: !!address && !!token?.address,
    token: token?.address === tokens.wu2u.address ? undefined : token?.address,
    watch: true
  });

  const totalPriceBN = useMemo(() => {
    if (!quantity) return BigInt(0);
    return BigInt(saleData?.price || "0") * BigInt(quantity);
  }, [quantity, saleData]);

  const onSubmit = async ({ quantity }: FormState.BuyNFT) => {
    if (!saleData) return;
    try {
      if (nft.collection.type === "ERC721") {
        await onBuyERC721( quoteToken, BigInt(saleData.price) + BigInt(buyerFee));
      } else {
        await onBuyERC1155(saleData.operationId, quantity);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (error) onError(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (isSuccess) onSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  
  const handleApproveMinAmount = () => {
    if (allowanceBalance === undefined) return;

    const priceBigint = parseUnits(price || '0', token?.decimal);
    const totalCostBigint = priceBigint + buyerFee;
    const remainingToApprove = BigInt(allowanceBalance as bigint) < totalCostBigint ? totalCostBigint - allowanceBalance : 0;
    setValue('allowance', formatUnits(remainingToApprove, token?.decimal));
  };

  const handleApproveMaxAmount = () => {
    setValue('allowance', 'UNLIMITED');
  };

  const handleAllowanceInput = (event: any) => {
    const value = event.target.value
    if (allowance === 'UNLIMITED') {
      setValue('allowance', value.slice(-1))
    } else {
      setValue('allowance', value)
    }
  }

  const handleApproveToken = async () => {
    const toastId = toast.loading("Preparing data...", { type: "info" });
    setLoading(true);
    try {
      toast.update(toastId, { render: "Sending token", type: "info" });
      const allowanceBigint = allowance === 'UNLIMITED' ? MaxUint256 : parseUnits(allowance, token?.decimal);
      await onApproveToken(allowanceBigint);

      toast.update(toastId, {
        render: "Approve token successfully",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    } catch (e) {
      toast.update(toastId, {
        render: "Failed to approve token",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
    }finally {
      setLoading(false);
    }
  };


  return (
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
          <span className="text-primary font-bold">{nft.collection.name}</span>{" "}
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
            Balance:{' '}
            {formatDisplayedBalance(
              formatUnits(tokenBalance?.value || 0, tokenBalance?.decimals)
            )}
          </Text>
        </div>
        <Input readOnly value={token?.symbol}/>
      </div>

      {nft.collection.type === "ERC721" && (
        <FeeCalculator
          mode="buyer"
          nft={nft}
          price={BigInt(saleData?.price || '0')}
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
            <Text className="text-secondary font-semibold mb-1">Quantity</Text>
            <Input
              maxLength={3}
              size={3}
              error={!!errors.quantity}
              register={register("quantity", {
                pattern: { value: numberRegex, message: "Wrong number format" },
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
                      totalPriceBN < tokenBalance.value || "Not enough balance"
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
              value={formatDisplayedBalance(formatEther(totalPriceBN))}
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
          />
        </>
      )}

      {isTokenApproved === true ? (
        <Button type={"submit"} className="w-full" loading={isLoading}>
          Purchase item
        </Button>
      ) : (
        <Erc20ApproveToken
          allowanceBalance={allowanceBalance}
          quoteToken={quoteToken}
          onApproveMinAmount={handleApproveMinAmount}
          onAllowanceInput={() => handleAllowanceInput}
          onApproveMaxAmount={handleApproveMaxAmount}
          onApproveToken={handleApproveToken}
          loading={loading}
          registerAllownceInput={register('allowance', formRules.allowance)}
        />
      )}
      <FormValidationMessages errors={errors} />

    </form>
  );
}
