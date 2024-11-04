import { useAccount, useContractRead, useReadContract } from "wagmi";
import { useMemo, useState } from "react";
import { formatUnits } from "ethers";
import { useRoundStatus } from "@/hooks/useRoundStatus";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { useLaunchpadApi } from "@/hooks/useLaunchpadApi";
import { getRoundAbi } from "@/utils";
import RoundActionMinting from "./RoundActions/RoundActionMinting";
import RoundActionUpcoming from "./RoundActions/RoundActionUpcoming";
import RoundActionEnded from "./RoundActions/RoundActionEnded";
import { ZERO_COLLECTION } from "@/config/constants";
import useLaunchpadStore from "@/store/launchpad/store";
import { Address } from "abitype";
import { erc721Abi } from "viem";

export default function RoundAction() {
  const { round, collection } = useLaunchpadStore((state) => state);
  const api = useLaunchpadApi();
  const { address } = useAccount();
  const { id } = useParams();
  const status = useRoundStatus(round);

  const { data: snapshot } = useSWR(
    address &&
      id &&
      (round.type === "U2UMintRoundZero" ||
        round.type === "U2UPremintRoundZero")
      ? { userId: address, projectId: id }
      : null,
    (params) => api.fetchSnapshot(params),
    { refreshInterval: 3000 }
  );

  const { data: isWhitelisted } = useContractRead({
    address: round.address,
    abi: getRoundAbi(round),
    functionName: "checkIsUserWhitelisted",
    args: [address as Address],
    query: {
      enabled:
        !!address &&
        round.type !== "U2UPremintRoundFCFS" &&
        round.type !== "U2UMintRoundFCFS",
    },
  });
  const hasStaked = useMemo(() => {
    return (
      BigInt(snapshot?.stakingTotal || 0) >= BigInt(round.requiredStaking || 0)
    );
  }, [snapshot, round]);

  const { data: balanceNFT } = useReadContract({
    address: ZERO_COLLECTION as Address,
    abi: erc721Abi,
    functionName: "balanceOf",
    args: [address as Address],
    query: {
      enabled:
        !!address &&
        (round.type == "U2UMintRoundZero" ||
          round.type == "U2UPremintRoundZero"),
      select: (data) => formatUnits(String(data), 0),
    },
  });
  const isHolder = useMemo(() => {
    return Number(balanceNFT) > 0;
  }, [balanceNFT]);

  const eligibleStatus = useMemo(() => {
    if (
      round.type === "U2UPremintRoundZero" ||
      round.type === "U2UMintRoundZero"
    ) {
      return hasStaked || isHolder;
    }

    if (
      round.type === "U2UMintRoundFCFS" ||
      round.type === "U2UPremintRoundFCFS"
    ) {
      return true;
    }

    return isWhitelisted;
  }, [hasStaked, round, isHolder, isWhitelisted]);

  const [loading, setLoading] = useState(false);

  const renderRoundAction = () => {
    switch (status) {
      case "MINTING":
        return <RoundActionMinting eligibleStatus={!!eligibleStatus} />;
      case "UPCOMING":
        return (
          <RoundActionUpcoming
            setLoading={setLoading}
            loading={loading}
            eligibleStatus={!!eligibleStatus}
            hasStaked={hasStaked}
            snapshot={snapshot}
            balanceNFT={balanceNFT as string}
            isHolder={isHolder}
          />
        );
      case "ENDED":
        return <RoundActionEnded collection={collection} />;
      default:
        return null;
    }
  };

  return renderRoundAction();
}
