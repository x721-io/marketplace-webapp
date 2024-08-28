"use client";

import React from "react";
import CollectionStatisticItemMobile from "./collection-statistic-item-mobile";
import { CollectionStatisticItem } from "@/types";

function CollectionsMobile({
  collections,
}: {
  collections: {
    concatenatedData: CollectionStatisticItem[];
    currentHasNext: boolean;
  };
}) {
  return (
    <div className="py-2 w-full flex flex-col gap-5">
      {collections.concatenatedData.map((item) => (
        <CollectionStatisticItemMobile
          c={item}
          link={`${item.collection.id}`}
          key={item.collection.id}
        />
      ))}
    </div>
  );
}

export default CollectionsMobile;
