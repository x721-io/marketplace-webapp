"use client";

import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function UserItemSkeleton() {
  return (
    <div className="h-[220px] pt-[10px] px-[10px] rounded-xl border border-1 border-soft">
      <SkeletonTheme
        height={"42%"}
        width={"100%"}
        baseColor="rgba(0,0,0,0.05)"
        highlightColor="rgba(0,0,0,0.000001)"
      >
        <Skeleton />
      </SkeletonTheme>
      <SkeletonTheme
        height={"50%"}
        width={"100%"}
        baseColor="rgba(0,0,0,0.05)"
        highlightColor="rgba(0,0,0,0.000001)"
      >
        <Skeleton />
      </SkeletonTheme>
    </div>
  );
}
