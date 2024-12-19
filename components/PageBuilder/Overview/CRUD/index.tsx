import { Element, ElementType } from "../../types";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import ContainerElement from "@/components/PageBuilder/Overview/Elements/ContainerElement";
import ButtonLinkElement from "@/components/PageBuilder/Overview/Elements/ButtonLinkElement";
import ImageElement from "@/components/PageBuilder/Overview/Elements/ImageElement";
import VideoElement from "@/components/PageBuilder/Overview/Elements/VideoElement";
import TextElement from "@/components/PageBuilder/Overview/Elements/TextElement";

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
    case ElementType.IMAGE:
      return ImageElement(element, index);
  }
};

export default function CRUD({
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
    <div className="relative h-full w-full group">
      <div className="w-full max-w-[170px] absolute z-10 h-10 bg-white mx-20 border border-gray-400 rounded-lg right-0 gap-2 items-center justify-center text-[white] !font-bold tablet:group-hover:flex hidden transition">
        <button
          className="border hover:bg-[#E3E3E3] rounded-lg p-2"
          onClick={() => onEdit(index)}
        >
          <GrEdit color="black" />
        </button>
        <button
          className="border hover:bg-[#E3E3E3] rounded-lg p-2"
          onClick={() => onMoveUp(index)}
        >
          <FaArrowUp color="black" />
        </button>
        <button
          className="border hover:bg-[#E3E3E3] rounded-lg p-2"
          onClick={() => onMoveDown(index)}
        >
          <FaArrowDown color="black" />
        </button>
        <button
          className="border hover:bg-[#E3E3E3] rounded-lg p-2"
          onClick={() => onDelete(index)}
        >
          <RiDeleteBin6Line color="black" />
        </button>
      </div>
      {generateElement(element, index)}
    </div>
  );
}