"use client";

import HomePageBanner from "@/components/Pages/MarketplaceNFT/HomePage";
import Statistics from "@/components/Statistics";

import LayerGBanner from "@/public/images/banner-lg.png";
import LayerGBannerTl from "@/public/images/banner-md.png";
import LayerGBannerMb from "@/public/images/banner-sm.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { useScreen } from "@/hooks/useDevice";
import { useMemo } from "react";

export default function Home() {
  const router = useRouter();
  const { screen } = useScreen();

  const Img = useMemo(() => {
    if (screen === "desktop") {
      return LayerGBanner;
    } else if (screen === "tablet") {
      return LayerGBannerTl;
    }
    return LayerGBannerMb;
  }, [screen]);
  return (
    <div className="">
      <HomePageBanner />
      <button
        onClick={() => router.push("/layerg/overview")}
        className="w-full p-4 tablet:px-10 laptop:px-20 tablet:py-6 tablet:mt-10"
      >
        <div className="w-full relative">
          {" "}
          {/* Relative positioning for the container */}
          <Image
            src={Img}
            alt="hero"
            className="w-full h-full max-h-[449px] tablet:max-h-[220px] rounded-2xl"
          />
          <div className="absolute text-center top-20 tablet:top-1/2 tablet:max-w-[375px] tablet:left-10 transform -translate-y-1/2 tablet:text-left">
            <p className="text-2xl laptop:text-[32px] uppercase text-white font-oscura">
              the layerg marketplace
            </p>
            <div className="mt-2 w-full  flex items-center justify-center tablet:justify-normal gap-2">
              <p className="text-center text-[#E7FF58]">LET’S EXPLORE</p>
              <Icon name="link" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </button>
      <div className="flex mt-10 mb-5 desktop:gap-0 tablet:gap-0 flex-col-reverse tablet:flex-row desktop:flex-row w-full px-4 tablet:py-8 desktop:px-20">
        <span className="font-semibold text-[#252525] text-[32px]">
          Trending
        </span>
      </div>
      <Statistics disableFilters={true} />
    </div>
  );
}
