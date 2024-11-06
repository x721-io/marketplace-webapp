"use client";

import Text from "@/components/Text";
import ImageUploader from "@/components/Form/ImageUploader";
import Input from "@/components/Form/Input";
import Textarea from "@/components/Form/Textarea";
import Button from "@/components/Button";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import useCollection from "@/hooks/useCollection";
import { randomWord } from "@rarible/types";
import useAuthStore from "@/store/auth/store";
import { BASE_API_URL } from "@/config/api";
import Icon from "@/components/Icon";
import { toast } from "react-toastify";
import { AssetType, FormState } from "@/types";
import ConnectWalletButton from "@/components/Button/ConnectWalletButton";
import FormValidationMessages from "@/components/Form/ValidationMessages";
import { parseImageUrl } from "@/utils/nft";
import { redirect, useParams, useRouter } from "next/navigation";
import { useAccount, useSwitchChain } from "wagmi";
import { ALLOWED_FILE_TYPES, CHAIN_ID } from "@/config/constants";
import { formRulesCreateCollection } from "@/config/form/rules";
import { useTranslations } from "next-intl";
import {
  useCreateCollection,
  useUploadFile,
  useValidateInput,
} from "@/hooks/useMutate";

export default function CreateNFTCollectionPage() {
  const validateTimeout = useRef<any>(null);
  const t = useTranslations("CreateCollection");
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const type = useParams().type.toString().toUpperCase() as AssetType;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const creator = useAuthStore((state) => state.profile?.id);
  const { createCollection } = useCollection();
  const { trigger: createCollectionMutate } = useCreateCollection();
  const { trigger: uploadFileMutate } = useUploadFile();
  const { trigger: validateInputMutate } = useValidateInput();
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setError,
    clearErrors,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormState.CreateCollection>({ reValidateMode: "onChange" });

  const handleUploadImage = async (file?: Blob) => {
    if (!file) {
      setValue("avatar", "");
      return;
    }
    setUploading(true);
    try {
      await toast.promise(uploadFileMutate({ files: file }), {
        pending: "Uploading image...",
        success: {
          render: (data) => {
            setValue(
              "avatar",
              parseImageUrl(data?.data?.fileHashes[0]) as string
            );
            clearErrors("avatar");
            return "Collection image uploaded successfully";
          },
        },
        error: {
          render: (error) => {
            setValue("avatar", "");
            return `Uploading error: ${(error.data as any).message}`;
          },
        },
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    reset();
    router.push("/create/collection");
  };

  const onSubmit = async (data: FormState.CreateCollection) => {
    if (!type || !creator) return;
    if (!!chain?.id && chain?.id !== Number(CHAIN_ID)) {
      switchChain({ chainId: Number(CHAIN_ID) });
      return;
    }
    const toastId = toast.loading("Preparing data...", { type: "info" });
    setLoading(true);
    try {
      const salt = randomWord();
      const fullShortUrl = BASE_API_URL + "/collection/" + data.shortUrl;
      const args = [data.name, data.symbol, `ipfs://`, fullShortUrl, [], salt];

      toast.update(toastId, { render: "Sending transaction", type: "info" });

      try {
        const hash = await createCollection(type, args);
        await createCollectionMutate({
          ...data,
          type,
          txCreationHash: hash,
          creator,
        });

        toast.update(toastId, {
          render: "Collection created successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        resetForm();
        router.push("/explore/collections");
      } catch (err: any) {
        toast.update(toastId, {
          render: `Error report: ${err.message}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        setLoading(false);
      }
    } catch (e: any) {
      toast.update(toastId, {
        render: `Error creating collection: ${e.message ?? e}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      console.error(e);
      setLoading(false);
    }
  };

  const handleValidateInput = async (
    name: string,
    value: Record<string, any>
  ) => {
    try {
      setValidating(true);
      if (name === "name" && !!value.name) {
        const existed = await validateInputMutate({
          key: "collectionName",
          value: value.name,
        });
        if (existed)
          setError("name", {
            type: "custom",
            message: "Collection name already existed",
          });
        else clearErrors("name");
      }

      if (name === "shortUrl" && !!value.shortUrl) {
        const existed = await validateInputMutate({
          key: "collectionShortUrl",
          value: value.shortUrl,
        });
        if (existed)
          setError("shortUrl", {
            type: "custom",
            message: "Short url already existed",
          });
        else clearErrors("shortUrl");
      }
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      if (!name) return;
      if (validateTimeout.current) {
        clearTimeout(validateTimeout.current);
      }
      validateTimeout.current = setTimeout(
        () => handleValidateInput(name, value),
        200
      );
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  useEffect(() => {
    if (type !== "ERC1155" && type !== "ERC721") {
      return redirect("/create/collection");
    }
  }, [type]);

  return (
    <div className="w-full flex justify-center py-10 tablet:py-20 desktop:py-20">
      <div className="flex flex-col tablet:w-[550px] w-full">
        <div className="flex items-center mb-6 tablet:mb-10 desktop:mb-10">
          <Button
            variant="text"
            onClick={resetForm}
            className="min-w-[60px] tablet:min-w-[120px] desktop:min-w-[120px]"
          >
            <Icon name="arrowLeft" width={24} height={24} />
          </Button>
          <Text className="text-body-32 tablet:text-body-40 desktop:text-body-40 font-semibold flex-1">
            {t("Title")} - {type}
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 p-4">
            {/* Upload file */}
            <div>
              <Text className="text-base font-semibold mb-1 flex items-center gap-1">
                {t("FormTitle.CollectionImage")}{" "}
                <p className="text-red-700">*</p>
              </Text>
              <Controller
                name="avatar"
                control={control}
                rules={formRulesCreateCollection.image}
                render={({ field: { value } }) => (
                  <ImageUploader
                    value={value}
                    onInput={handleUploadImage}
                    loading={uploading}
                    error={!!errors.avatar}
                    maxSize={4}
                    accept={ALLOWED_FILE_TYPES}
                  />
                )}
              />
            </div>
            {/* Name */}
            <div>
              <Text className="text-base font-semibold mb-1 flex items-center gap-1">
                {t("FormTitle.DisplayName")} <p className="text-red-700">*</p>
              </Text>
              <Input
                register={register("name", formRulesCreateCollection.name)}
                error={!!errors.name}
              />
            </div>
            {/* Symbol */}
            <div>
              <Text className="text-base font-semibold mb-1 flex items-center gap-1">
                {t("FormTitle.Symbol")} <p className="text-red-700">*</p>
              </Text>
              <Input
                register={register("symbol", formRulesCreateCollection.symbol)}
                error={!!errors.symbol}
              />
            </div>
            <div>
              <Text className="text-base font-semibold mb-1">
                {t("FormTitle.ShortURL")}
              </Text>
              <Input
                error={!!errors.shortUrl}
                register={register(
                  "shortUrl",
                  formRulesCreateCollection.shortUrl
                )}
              />
            </div>
            {/* Description */}
            <div>
              <Text className="text-base font-semibold mb-1">
                {t("FormTitle.Description")}
              </Text>
              <Textarea
                className="h-[160px] resize-none"
                register={register(
                  "description",
                  formRulesCreateCollection.description
                )}
                error={!!errors.description}
              />
            </div>

            <FormValidationMessages errors={errors} />

            {/* Button finish */}
            <ConnectWalletButton showConnectButton>
              <Button
                loading={loading}
                loadingText="Creating collection ..."
                disabled={
                  validating || uploading || Object.keys(errors).length > 0
                }
                type="submit"
                className="w-full tablet:w-auto desktop:w-auto"
              >
                Create collection
              </Button>
            </ConnectWalletButton>
          </div>
        </form>
      </div>
    </div>
  );
}
