import { BASE_API_URL } from "@/config/api";
import { ALLOWED_DOMAIN_URL } from "@/config/constants";

export const defaultLayerGImage =
  "https://ug-assets-dev.s3.ap-southeast-1.amazonaws.com/80bd9c76-bf24-491f-9205-130e485c379e-LayerGDefaultImg.png";

export const parseImageUrl = (url?: string) => {
  if (!url) return "";
  return BASE_API_URL + "/common/ipfs-serve?ipfsPath=" + url;
};

export const convertImageUrl = (url?: string): string => {
  const baseURL = BASE_API_URL + "/common/ipfs-serve?ipfsPath=";
  if (!url) return "";

  const ipfsPrefix = ALLOWED_DOMAIN_URL.split(",");

  if (url.startsWith(ipfsPrefix[0])) {
    const ipfsPath = url.replace(ipfsPrefix[0], "ipfs://ipfs/");
    return baseURL + encodeURIComponent(ipfsPath);
  } else if (
    url.includes(baseURL) ||
    ipfsPrefix.some((prefix) => url.includes(prefix))
  ) {
    return url;
  } else if (url.startsWith("https://ipfs")) {
    return url;
  } else {
    return baseURL + encodeURIComponent(url);
  }
};
