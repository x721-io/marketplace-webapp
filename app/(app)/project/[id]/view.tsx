"use client";

import ProjectPageBanner from "components/Pages/Launchpad/ProjectDetails/LauchpadBanner";
import ProjectPageDescriptions from "@/components/Pages/Launchpad/ProjectDetails/LaunchpadDescriptions";
import ProjectMintSchedule from "@/components/Pages/Launchpad/ProjectDetails/MintSchedule";
import { Project } from "@/types";

export default function ProjectView({ data }: { data: Project }) {
  return (
    <div className="px-4 pb-4 tablet:pb-10 tablet:px-7 desktop:px-20">
      <div className="mb-20 mt-10">
        <ProjectPageBanner project={data} />
      </div>

      <div className="flex items-start gap-6 flex-col desktop:flex-row tablet:flex-row w-full">
        <div className="flex-1 w-full desktop:w-auto tablet:w-auto">
          <ProjectPageDescriptions project={data} />
        </div>
        <div className="flex-1 w-full desktop:w-auto tablet:w-auto">
          <ProjectMintSchedule
            rounds={data.rounds}
            collection={data.collection}
          />
        </div>
      </div>
    </div>
  );
}
