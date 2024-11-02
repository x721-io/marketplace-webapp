"use client";

import React from "react";
import ProjectSlide from "./LaunchpadSlide";
import { MyCarousel } from "@/components/X721UIKits/Carousel";
import { useGetLaunchpadProjects } from "@/hooks/useQuery";

export default function HomePageBanner() {
  const { data } = useGetLaunchpadProjects();
  return (
    <div className="w-full h-[530px] desktop:h-[500px] tablet:h-[500px] mx-auto p-2">
      {Array.isArray(data) && data.length ? (
        <MyCarousel.Root>
          {data.map((project) => (
            <MyCarousel.Item key={project.id}>
              <ProjectSlide project={project} />
            </MyCarousel.Item>
          ))}
        </MyCarousel.Root>
      ) : (
        <div className="w-full h-56 flex justify-center items-center p-7 rounded-2xl border border-disabled border-dashed mt-7">
          <p className="text-secondary font-semibold text-body-18">
            No Project
          </p>
        </div>
      )}
    </div>
  );
}
