"use client";

import { Element, ElementType } from "../types";
import ButtonLinkElement from "./Elements/button-link-element";
import ContainerElement from "./Elements/container-element";
import TextElement from "./Elements/text-element";
import VideoElement from "./Elements/video-element";

export const generateElement = (element: Element, index: number) => {
  switch (element.type) {
    case ElementType.CONTAINER:
      return ContainerElement(element, index);
    case ElementType.BUTTON_LINK:
      return ButtonLinkElement(element, index);
    case ElementType.TEXT:
      return TextElement(element, index);
    case ElementType.VIDEO:
      return VideoElement(element, index);
  }
};

export default function Section({
  element,
  index,
  onEdit,
  onMoveDown,
  onMoveUp,
  onDelete,
}: {
  element: Element;
  index: number;
  onEdit: (index: number) => void;
  onMoveDown: (index: number) => void;
  onMoveUp: (index: number) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div className="relative">
      <div className="w-full absolute z-10 h-[50px] bg-[rgba(0,0,0,0.25)] flex gap-5 items-center justify-end px-8 text-[white] !font-bold">
        <button onClick={() => onEdit(index)}>Edit</button>
        <button onClick={() => onMoveUp(index)}>Up</button>
        <button onClick={() => onMoveDown(index)}>Down</button>
        <button onClick={() => onDelete(index)}>Delete</button>
      </div>
      {generateElement(element, index)}
    </div>
  );
}
