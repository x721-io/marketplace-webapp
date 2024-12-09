/* eslint-disable @next/next/no-img-element */
"use client";

import { Image as ImageType } from "../../types";
import { useScreen } from "@/hooks/useDevice";

const ImageElement = (element: ImageType, index: number) => {
  const { screen } = useScreen();
  return (
    <div
      key={index}
      style={{
        width: element.width ?? "100%",
        height:
          element.height || element.textOverMedia
            ? screen === "desktop"
              ? `${element.height}`
              : screen === "tablet"
              ? "457px"
              : "179px"
            : "100%",
        backgroundImage: `url(${element.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
};

export default ImageElement;
