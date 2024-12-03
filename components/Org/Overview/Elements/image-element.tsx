/* eslint-disable @next/next/no-img-element */
"use client";

import { Image as ImageType } from "../../types";

const ImageElement = (element: ImageType, index: number) => {
  return (
    <div
      key={index}
      style={{
        width: element.width ?? "100%",
        height: element.height ?? "auto",
        backgroundImage: `url(${element.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
};

export default ImageElement;
