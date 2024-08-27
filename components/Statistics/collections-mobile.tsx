"use client";

import React from "react";
import CollectionStatisticItem from "./collection-statistic-item";

function CollectionsMobile({
  collections,
}: {
  collections: {
    concatenatedData: any[];
    currentHasNext: boolean;
  };
}) {
  return (
    <div className="py-2 w-full flex flex-col gap-5">
      {collections.concatenatedData.map((item) => (
        <CollectionStatisticItem c={item} link={`${item.id}`} key={item.id} />
      ))}
    </div>
  );
}

export default CollectionsMobile;
