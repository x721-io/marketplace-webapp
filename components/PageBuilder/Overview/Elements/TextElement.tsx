"use client";

import { Text } from "../../types";
import { useScreen } from "@/hooks/useDevice";

const TextElement = (element: Text, index: number) => {
  const { screen } = useScreen();

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
        textAlign: element.text.textAlign,
        ...element.styles,
      }}
    >
      {element.text.content}
    </p>
  );
};

export default TextElement;
