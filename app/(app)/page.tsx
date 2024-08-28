"use client";

import HomePageBanner from "@/components/Pages/MarketplaceNFT/HomePage";
import Statistics from "@/components/Statistics";
import Text from "@/components/Text";

export default function Home() {
  return (
    <div className="">
      <HomePageBanner />
      <div className="flex mt-10 mb-5 desktop:gap-0 tablet:gap-0 flex-col-reverse tablet:flex-row desktop:flex-row w-full px-4 tablet:py-8 desktop:px-20">
        <span className="font-semibold text-[#252525] text-[32px]">
          Trending
        </span>
      </div>
      <Statistics disableFilters={true} />
    </div>
  );
}
