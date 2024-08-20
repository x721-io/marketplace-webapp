"use client";

import React from "react";
import ProjectSlide from "./LaunchpadSlide";
import useSWR from "swr";
import { useLaunchpadApi } from "@/hooks/useLaunchpadApi";
import { MyCarousel } from "@/components/X721UIKits/Carousel";

export default function HomePageBanner() {
  const api = useLaunchpadApi();
  const { data } = useSWR("comingProjects", () => api.fetchProjects(), {
    revalidateOnFocus: false,
  });

  return (
    <div className="w-full h-[530px] desktop:h-[500px] tablet:h-[500px] mx-auto p-2">
      {Array.isArray(data) && (
        <MyCarousel.Root>
          {data.map((project) => (
            <MyCarousel.Item key={project.id}>
              <ProjectSlide project={project} />
            </MyCarousel.Item>
          ))}
        </MyCarousel.Root>
      )}
    </div>
  );
}
