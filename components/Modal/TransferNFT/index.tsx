import { useMemo } from "react";
import Text from "@/components/Text";
import Button from "@/components/Button";
import { FormState, NFT } from "@/types";
import { APIResponse } from "@/services/api/types";
import NFTMarketData = APIResponse.NFTMarketData;
import Input from "@/components/Form/Input";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import useAuthStore from "@/store/auth/store";
import { useForm } from "react-hook-form";
import { numberRegex } from "@/utils/regex";
import { isAddress, ZeroAddress } from "ethers";
import { writeContract } from "@wagmi/core";
import ERC1155 from "@/abi/ERC1155";
import { toast } from "react-toastify";
import { MyModal, MyModalProps } from "@/components/X721UIKits/Modal";
import { Address } from "abitype";
import { erc721Abi } from "viem";
import { useWriteContract } from "wagmi";
import { Web3Functions } from "@/services/web3";

interface Props extends MyModalProps {
  nft: NFT;
  marketData?: NFTMarketData;
}

export default function TransferNFTModal({
  nft,
  show,
  onClose,
  marketData,
}: Props) {
  const { writeContractAsync } = useWriteContract();
  const type = nft.collection.type;
  const wallet = useAuthStore((state) => state.profile?.publicKey);
  const ownerData = useMemo(() => {
    if (!wallet || !marketData) return undefined;
    return marketData.owners.find(
      (owner) => owner.publicKey.toLowerCase() === wallet.toLowerCase()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormState.TransferToken>();

  const formRules = {
    quantity: {
      pattern: { value: numberRegex, message: "Wrong number format" },
      validate: {
        required: (v: number) => {
          if (type === "ERC721") return true;
          return (
            (!!v && !isNaN(v) && v > 0) ||
            "Please input quantity of item to transfer"
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
    address: {
      required: "Address is not allowed to be empty",
      validate: {
        valid: (v: string) =>
          (isAddress(v) && v !== ZeroAddress) || "Invalid address",
      },
    },
  };

  const onSubmit = async ({ quantity, recipient }: FormState.TransferToken) => {
    try {
      if (type === "ERC721") {
        await Web3Functions.writeContract({
          address: nft.collection.address,
          abi: erc721Abi,
          functionName: "safeTransferFrom",
          args: [wallet as Address, recipient, (nft.u2uId ?? nft.id) as any],
        });
      } else if (type === "ERC1155") {
        await Web3Functions.writeContract({
          address: nft.collection.address,
          abi: ERC1155,
          functionName: "safeTransferFrom",
          args: [
            wallet as `0x${string}`,
            recipient,
            (nft.u2uId ?? nft.id) as any,
            BigInt(quantity),
            "0x",
          ],
        });
      }

      toast.success("Transfer token successfully", {
        autoClose: 1000,
        closeButton: true,
      });
    } catch (e: any) {
      toast.error(`Error report: ${e.message || e}`);
    } finally {
      onClose?.();
      reset();
    }
  };

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body className="py-5 px-[30px]">
        <form
          className="w-full flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-4 flex-col">
            <Text className="font-semibold text-body-24">Transfer Token</Text>
            <Text className="text-body-16">
              You can transfer tokens from your address to another
            </Text>
          </div>
          {nft.collection.type === "ERC1155" && (
            <div className="flex gap-1 flex-col">
              <Text className="text-secondary font-semibold">Quantity</Text>
              <Input
                error={!!errors.quantity}
                register={register("quantity", formRules.quantity)}
                appendIcon={
                  nft.collection.type === "ERC1155" && (
                    <Text>Quantity: {ownerData?.quantity}</Text>
                  )
                }
              />
            </div>
          )}
          <div className="flex gap-1 flex-col">
            <label className="text-body-14 text-secondary font-semibold mb-1">
              Receive address
            </label>
            <Input
              error={!!errors.recipient}
              register={register("recipient", formRules.address)}
            />
          </div>

          <FormValidationMessages errors={errors} />

          <div className="flex gap-2 flex-col">
            <Button type={"submit"} className="w-full">
              Continue
            </Button>
            <Button variant="outlined" className="w-full" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </MyModal.Body>
    </MyModal.Root>
  );
}
