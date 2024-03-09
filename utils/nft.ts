import { BASE_API_URL } from "@/config/api";

export const parseImageUrl = (url?: string) => {
  if (!url) return "";
  return BASE_API_URL + "/common/ipfs-serve?ipfsPath=" + url;
};

export const convertImageUrl = (url?: string): string => {
  const baseURL = BASE_API_URL + "/common/ipfs-serve?ipfsPath=";
  if (!url) return "";

  const ipfsPrefix = "https://ipfs.io/ipfs/";

  if (url.startsWith(ipfsPrefix)) {
    const ipfsPath = url.replace(ipfsPrefix, "ipfs://ipfs/");
    return baseURL + encodeURIComponent(ipfsPath);
  } else if (url.includes(baseURL)) {
    return url;
  } else {
    return baseURL + encodeURIComponent(url);
  }
};

