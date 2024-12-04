"use client";

import { Text } from "../../types";

const TextElement = (element: Text, index: number) => {
  return (
    <p
      key={index}
      style={{
        width: "100%",
        position: "relative",
        wordWrap: "break-word",
        color: element.text.color,
        fontSize: element.text.fontSize,
        fontWeight: element.text.fontWeight,
        padding: "10px",
        textAlign: element.text.textAlign,
        ...element.styles,
      }}
    >
      {element.text.content}
    </p>
  );
};

export default TextElement;
