"use client";

import { useState } from "react";
import { Text } from "../../types";

const TextElement = (element: Text, index: number) => {
  const [isSelected, setSelected] = useState(false);

  return (
    <p
      key={index}
      onClick={() => setSelected(!isSelected)}
      onBlur={() => setSelected(false)}
      tabIndex={0}
      style={{
        width: "100%",
        position: "relative",
        wordWrap: "break-word",
        color: element.text.color,
        fontSize: element.text.fontSize,
        fontWeight: element.text.fontWeight,
        padding: "10px",
        textAlign: element.text.textAlign,
        border: isSelected ? "1px solid rgba(255,255,255,0.7)" : "none",
        ...element.styles,
      }}
    >
      {element.text.content}
    </p>
  );
};

export default TextElement;
