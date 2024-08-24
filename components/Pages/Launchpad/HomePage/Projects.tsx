"use client";

import Tabs from "@/components/Tabs";
import { useMemo, useState } from "react";
import HomePageProjectList from "./LaunchpadList";
import { useLaunchpadApi } from "@/hooks/useLaunchpadApi";
import { useGetLaunchpadProjects } from "@/hooks/useQuery";

export default function HomePageProjectTabs() {
  const api = useLaunchpadApi();
  const { data: mintingProjects } = useGetLaunchpadProjects("MINTING");

  const { data: comingProjects } = useGetLaunchpadProjects("UPCOMING");

  const { data: endedProjects } = useGetLaunchpadProjects("ENDED");

  const { data: claimableProjects } = useGetLaunchpadProjects("CLAIM");

  const [current, setCurrent] = useState(1);

  const tabs = useMemo(
    () => [
      { label: "Minting", value: 1, quantity: mintingProjects?.length || "0" },
      { label: "Upcoming", value: 2, quantity: comingProjects?.length || "0" },
      { label: "Ended", value: 3, quantity: endedProjects?.length || "0" },
      { label: "Claim", value: 4, quantity: claimableProjects?.length || "0" },
    ],
    [mintingProjects, comingProjects, endedProjects, claimableProjects]
  );

  return (
    <div className="desktop:mt-10">
      <Tabs current={current} tabs={tabs} onChangeTab={setCurrent} />

      {current === 1 && <HomePageProjectList projects={mintingProjects} />}
      {current === 2 && <HomePageProjectList projects={comingProjects} />}
      {current === 3 && <HomePageProjectList projects={endedProjects} />}
      {current === 4 && <HomePageProjectList projects={claimableProjects} />}
    </div>
  );
}
