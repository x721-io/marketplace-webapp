import { launchpadAPi } from "@/services/api";
import { API_ENDPOINTS } from "@/config/api";
import { APIParams, APIResponse } from "@/services/api/types";
import { parseQueries } from "@/utils";

export const useLaunchpadApi = () => {
  return {
    checkIsSubscribed: (params: APIParams.SubscribeRoundZero) => {
      return launchpadAPi.get(
        API_ENDPOINTS.CHECK_IS_SUBSCRIBED + parseQueries(params)
      );
    },
    subscribeRoundZero: (params: APIParams.SubscribeRoundZero) => {
      return launchpadAPi.post(API_ENDPOINTS.SUBSCRIBE_ROUND_ZERO, params);
    },
    fetchSnapshot: (
      params: APIParams.FetchSnapshot
    ): Promise<APIResponse.Snapshot> => {
      return launchpadAPi.get(API_ENDPOINTS.SNAPSHOT + parseQueries(params));
    },
    crawlNFTInfo: (params: APIParams.CrawlNFTInfo) => {
      return launchpadAPi.get(
        API_ENDPOINTS.NFT_CRAWL_INFO + parseQueries(params)
      );
    },
  };
};
