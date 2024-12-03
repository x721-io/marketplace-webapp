"use client";

import Image from "next/image";
import { OrgProperties } from "./types";

export default function OrgHeader({
  orgProperties,
  editMode = true,
}: {
  orgProperties: OrgProperties;
  editMode?: boolean;
}) {
  const renderBanner = (banner: string) => {
    const extension = banner.split(".").pop();
    if (extension === "mp4" || extension === "webm") {
      return (
        <div className="w-full h-full">
          {editMode && (
            <button className="absolute top-0 right-0 z-10 m-2 py-2 px-5 text-[white] font-extrabold cursor-pointer">
              Edit banner
            </button>
          )}
          <video
            loop
            muted
            autoPlay
            src={banner}
            width="100%"
            height="100%"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return (
      <Image
        src={banner}
        alt="banner"
        fill
        objectFit="cover"
        objectPosition="center"
      />
    );
  };

  return (
    <div className="w-full aspect-[9/3] bg-black relative">
      <div className="w-full h-full absolute top-0 left-0 flex over">
        {renderBanner(orgProperties.banner)}
        <div className="absolute bottom-0 left-0 w-full flex flex-col px-20 gap-3 pb-[50px]">
          <div className="w-full flex">
            <div className="w-[100px] aspect-square relative">
              <Image
                src={orgProperties.avatar}
                fill
                alt="avatar"
                objectFit="cover"
                objectPosition="center"
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="w-full flex">
            <div className="w-[70%] flex flex-col">
              <div className="w-full text-[white] font-extrabold text-[28px] px-2">
                {orgProperties.title}
              </div>
              <div className="w-full text-[rgba(255,255,255,0.75)] font-medium text-[17px] px-2 pt-5">
                {orgProperties.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
