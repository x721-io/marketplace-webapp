"use client";

import { Video } from "../../types";

const VideoElement = (element: Video, index: number) => {
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
        background: "black",
        ...element.styles,
      }}
    ></video>
  );
};

export default VideoElement;
