"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NFTCardSkeleton() {
  return (
    <div className="h-[295px] pt-[10px] px-[10px] rounded-xl border border-1 border-soft">
      <SkeletonTheme
        height={"75%"}
        width={"100%"}
        baseColor="rgba(0,0,0,0.05)"
        highlightColor="rgba(0,0,0,0.000001)"
      >
        <Skeleton />
      </SkeletonTheme>
      <SkeletonTheme
        height={"9%"}
        width={"100%"}
        baseColor="rgba(0,0,0,0.05)"
        highlightColor="rgba(0,0,0,0.000001)"
      >
        <Skeleton />
      </SkeletonTheme>
      <SkeletonTheme
        height={"9%"}
        width={"100%"}
        baseColor="rgba(0,0,0,0.05)"
        highlightColor="rgba(0,0,0,0.000001)"
      >
        <Skeleton />
      </SkeletonTheme>
    </div>
  );
}
