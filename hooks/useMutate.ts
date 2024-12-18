import { marketplaceApi, nextAPI } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import { User } from "@/types";
import { APIParams, APIResponse } from "@/services/api/types";
import useSWRMutation from "swr/mutation";
import { Address } from "viem";
import useSWR from "swr";

export const useGetProfileMutate = (address: Address) => {
  const fetcher = async (url: string) => {
    const response = await nextAPI.get(url);
    return response.data.data as User;
  };

  const {
    data,
    error,
    isLoading,
    mutate: revalidate,
  } = useSWR(address ? `${API_ENDPOINTS.PROFILE}/${address}` : null, fetcher, {
    refreshInterval: 0,
  });

  return {
    data,
    isLoading,
    error,
    revalidate,
  };
};
export const useUpdateProfile = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.PROFILE,
    async (_: string, { arg }: { arg: APIParams.UpdateProfile }) => {
      const response = await nextAPI.post(API_ENDPOINTS.PROFILE, arg);
      return response.data.data as User;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useCreateNFTAPI = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.NFT,
    async (_: string, { arg }: { arg: APIParams.CreateNFT }) => {
      const response = await nextAPI.post(API_ENDPOINTS.NFT, arg);
      return response.data.data;
    }
  );

  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useUploadMetadata = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.UPLOAD_IMAGE,
    async (_: string, { arg }: { arg: Record<string, any> }) => {
      const form = new FormData();
      form.append("metadata", JSON.stringify(arg));
      const response = await marketplaceApi.post(
        API_ENDPOINTS.UPLOAD_IMAGE,
        form
      );
      return response?.data as APIResponse.UploadMetadata;
    }
  );

  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useUploadFile = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.UPLOAD_IMAGE,
    async (
      _: string,
      { arg }: { arg: { files: Blob[] | Blob; metadata?: Record<string, any> } }
    ) => {
      const { files, metadata } = arg;
      const form = new FormData();
      if (Array.isArray(files)) {
        files.forEach((file) => {
          form.append("files", file);
        });
      } else {
        form.append("files", files, (files as any).name);
      }

      if (metadata) {
        form.append("metadata", JSON.stringify(metadata));
      }
      const response = await marketplaceApi.post(
        API_ENDPOINTS.UPLOAD_IMAGE,
        form
      );
      return response?.data as APIResponse.UploadImage;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useSearchNfts = (text: any) => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    text.nft ? [text.nft] : null,
    async (key: any) => {
      const response = await nextAPI.post(API_ENDPOINTS.SEARCH, {
        mode: "NFT",
        text: key[0],
      });
      return response.data.data;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useSearchCollections = (text: any) => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    text.collection ? [text.collection] : null,
    async (key: any) => {
      const response = await nextAPI.post(API_ENDPOINTS.SEARCH, {
        mode: "COLLECTION",
        text: key[0],
      });
      return response.data.data;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useSearchUsers = (text: any) => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    text.user ? [text.user] : null,
    async (key: any) => {
      const response = await nextAPI.post(API_ENDPOINTS.SEARCH, {
        mode: "USER",
        text: key[0],
      });
      return response.data.data;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useValidateInput = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.VALIDATE_INPUT,
    async (_: string, { arg }: { arg: APIParams.ValidateInput }) => {
      const response = await nextAPI.post(API_ENDPOINTS.VALIDATE_INPUT, arg);
      return response.data.data as boolean;
    }
  );

  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useCreateCollection = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.COLLECTIONS,
    async (
      _: string,
      {
        arg,
      }: {
        arg: APIParams.CreateCollection;
      }
    ) => {
      const response = await nextAPI.post(API_ENDPOINTS.COLLECTIONS, arg);
      return response.data.data;
    }
  );

  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useUpdateCollection = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.COLLECTIONS,
    async (
      _: string,
      {
        arg,
      }: {
        arg: APIParams.UpdateCollection;
      }
    ) => {
      const { id, coverImage } = arg;
      const response = await nextAPI.put(`${API_ENDPOINTS.COLLECTIONS}/${id}`, {
        coverImage,
      });
      return response.data.data;
    }
  );

  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useFollowUser = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.FOLLOW,
    async (
      _: string,
      {
        arg,
      }: {
        arg: { userId: string };
      }
    ) => {
      const { userId } = arg;
      const response = await nextAPI.post(
        `${API_ENDPOINTS.FOLLOW}/${userId}`,
        {}
      );
      return response.data.data as APIResponse.FollowUser;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useGenerateTokenId = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.TOKEN_ID,
    async (
      _: string,
      {
        arg,
      }: {
        arg: { collectionAddress: Address };
      }
    ) => {
      const { collectionAddress } = arg;
      const response = await nextAPI.get(
        API_ENDPOINTS.TOKEN_ID + `?collectionAddress=${collectionAddress}`
      );
      return response.data.data as APIResponse.GenerateTokenId;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useConnectAPI = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.CONNECT,
    async (
      _: string,
      {
        arg,
      }: {
        arg: APIParams.Connect;
      }
    ) => {
      const response = await nextAPI.post(API_ENDPOINTS.CONNECT, arg);
      return response.data.data as APIResponse.Connect;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};

export const useVerifyAccount = () => {
  const { trigger, data, isMutating, reset } = useSWRMutation(
    API_ENDPOINTS.CONNECT,
    async (
      _: string,
      {
        arg,
      }: {
        arg: any;
      }
    ) => {
      const response = await nextAPI.post(API_ENDPOINTS.LIST_VERIFY, arg);
      return response.data.data as APIResponse.VerifyAccount;
    }
  );
  return {
    trigger,
    data,
    isMutating,
    reset,
  };
};
