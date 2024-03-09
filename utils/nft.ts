import { BASE_API_URL } from "@/config/api";

export const parseImageUrl = (url?: string) => {
  if (!url) return "";
  return BASE_API_URL + "/common/ipfs-serve?ipfsPath=" + url;
};

export const convertImageUrl  =  (url?: string) : string => {
  const baseURL= BASE_API_URL + "/common/ipfs-serve?ipfsPath="
  if (!url) return "";
  if (url.includes(baseURL)) {
    return url
  }else {
    return baseURL + url;
  }
 };