"use client";

import { ButtonLink } from "../../types";

const ButtonLinkElement = (element: ButtonLink, index: number) => {
  return (
    <button
      onClick={() => window.open(element.href, "_blank")}
      key={index}
      style={{
        color: element.text.color,
        fontSize: element.text.fontSize,
        fontWeight: element.text.fontWeight,
        width: element.width,
        height: element.height,
        background: element.background,
        ...element.styles,
      }}
    >
      {element.text.content}
    </button>
  );
};

export default ButtonLinkElement;
