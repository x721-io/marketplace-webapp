"use client";

import { Container } from "../../types";
import { generateElement } from "../section";

const ContainerElement = (element: Container, index: number) => {
  return (
    <div
      key={index}
      style={{
        width: element.width ?? "100%",
        height: element.height ?? "auto",
        background: element.background,
        backgroundImage: element.backgroundImage
          ? `url("${element.backgroundImage}")`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        flexDirection: element.flexDirection,
        alignItems: element.alignItems,
        justifyContent: element.justifyContent,
        display: "flex",
        flexWrap: "nowrap",
        ...element.styles,
      }}
    >
      {element.children &&
        element.children.map((e, i) => generateElement(e, i))}
    </div>
  );
};

export default ContainerElement;
