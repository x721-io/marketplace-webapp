"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import cn from "clsx";

function BlurImage(props: any) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...props}
      loading="lazy"
      unoptimized={props?.src?.split(".").pop() === "gif"}
      alt={props.alt}
      className={cn(
        props.className,
        "duration-300 ease",
        isLoading ? "bg-[rgba(0,0,0,0.3)] animate-pulse" : ""
      )}
      onLoadingComplete={() => setLoading(false)}
    />
  );
}

export default BlurImage;
