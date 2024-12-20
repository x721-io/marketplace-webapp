import { MyTabs } from "@/components/X721UIKits/Tabs";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function OverView() {
  const router = useRouter();

  const storedTabIndex = useMemo(() => {
    const savedIndex = sessionStorage.getItem("profilePageTabIndex");
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  }, []);

  const [currTabIndex, setCurrTabIndex] = useState(storedTabIndex);

  useEffect(() => {
    sessionStorage.setItem("profilePageTabIndex", currTabIndex.toString());
  }, [currTabIndex]);

  useEffect(() => {
    if (currTabIndex === 1) {
      router.push("/layerg/overview");
    } else if (currTabIndex === 2) {
      router.push("/layerg/items");
    } else if (currTabIndex === 3) {
      router.push("/layerg/analytics");
    }
  }, [currTabIndex, router]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 tablet:px-10 laptop:px-20 laptop:py-10 tablet:py-6 tablet:w-full overflow-auto">
        <MyTabs.Group style="underline" onActiveTabChange={setCurrTabIndex}>
          <MyTabs.Item tabIndex={1} active={currTabIndex === 1}>
            <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
              Overview
            </div>
          </MyTabs.Item>
          <MyTabs.Item tabIndex={2} active={currTabIndex === 2}>
            <div className="min-w-fit whitespace-nowrap text-[0.925rem]">
              List Item
            </div>
          </MyTabs.Item>
          {/*<MyTabs.Item tabIndex={3} active={currTabIndex === 3}>*/}
          {/*  <div className="min-w-fit whitespace-nowrap text-[0.925rem]">*/}
          {/*    Analytics*/}
          {/*  </div>*/}
          {/*</MyTabs.Item>*/}
        </MyTabs.Group>
      </div>
    </div>
  );
}
