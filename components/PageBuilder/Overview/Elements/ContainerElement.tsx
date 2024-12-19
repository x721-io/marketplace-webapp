"use client";

import { Container } from "../../types";
import { generateElement } from "@/components/PageBuilder/Overview/CRUD";
import { useScreen } from "@/hooks/useDevice";

const ContainerElement = (element: Container, index: number) => {
  const { screen } = useScreen();
  return (
    <div
      key={index}
      style={{
        width: element.width ?? "100%",
        height:
          element.height && screen === "desktop"
            ? `${element.textOnly ? `400px` : `${element.height}`}`
            : screen === "tablet"
            ? `${element.textOnly ? "420px" : "100%"}`
            : `${element.textOnly ? "179px" : "100%"}`,
        background: element.background,
        backgroundImage: element.backgroundImage
          ? `url("${element.backgroundImage}")`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        flexDirection:
          element.flexDirection && element.isFlexDirection
            ? screen === "desktop"
              ? "row"
              : screen === "tablet"
              ? "row"
              : "column"
            : element.flexDirection,
        alignItems: element.alignItems,
        justifyContent: element.justifyContent,
        display: "flex",
        flexWrap: "nowrap",
        gap: element.gap
          ? screen === "desktop"
            ? "80px"
            : screen === "tablet"
            ? "40px"
            : "24px"
          : "0",
        padding:
          element.responsive || element.textOverMedia || element.mediaOnly
            ? "0"
            : screen === "desktop"
            ? "40px 80px"
            : screen === "tablet"
            ? "40px 40px"
            : "24px 16px",
        ...element.styles,
      }}
    >
      {element.children &&
        element.children.map((e, i) => generateElement(e, i))}
    </div>
  );
};

export default ContainerElement;
