"use client";

import { Video } from "../../types";
import { useScreen } from "@/hooks/useDevice";

const VideoElement = (element: Video, index: number) => {
  const { screen } = useScreen();

  return (
    <video
      key={index}
      loop
      muted
      autoPlay
      controls={element.showControls}
      src={element.src}
      width={element.width}
      height={element.height}
      style={{
        background: "transparent",
        aspectRatio: 3 / 4,
        maxWidth:
          screen === "desktop"
            ? "600px"
            : screen === "tablet"
            ? "420px"
            : "100%",
        ...element.styles,
      }}
    ></video>
  );
};

export default VideoElement;
