import { useMarketplaceApi } from "@/hooks/useMarketplaceApi";
import useSWR from "swr";
import React, { useState } from "react";
import { Address } from "wagmi";
import Text from "@/components/Text";
import UserMarketEvent from "@/components/Pages/MarketplaceNFT/UserDetails/Activities/MarketEvent";
import { useGetUserActivities } from "@/hooks/useQuery";

export default function Activities({
  wallet,
  isShow = true,
}: {
  wallet: Address;
  isShow?: boolean;
}) {
  const api = useMarketplaceApi();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);

  const { data, isLoading } = useGetUserActivities(
    !!wallet ? { page, limit, user: wallet.toLowerCase() as Address } : null
  );

  if (!data || !data?.length) {
    return (
      <div className="p-7 rounded-2xl border border-disabled border-dashed mt-7">
        <Text className="text-secondary text-center text-sm">
          Nothing to show
        </Text>
      </div>
    );
  }

  return (
    <div
      style={
        !isShow
          ? {
              display: "none",
            }
          : {}
      }
      className="w-full py-7 overflow-x-auto"
    >
      <div className="w-full py-4 overflow-x-auto">
        {!!data?.length ? (
          <div className="p-3 flex flex-col gap-4 rounded-2xl border border-disabled border-dashed whitespace-normal h-auto max-h-[400px] overflow-auto">
            {data.map((event) => (
              <UserMarketEvent key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="p-7 rounded-2xl border border-disabled border-dashed">
            <Text className="text-secondary text-center text-bo">
              Nothing to show
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
