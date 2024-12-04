import React, { useState } from "react";
import CloseIcon from "@/components/Icon/Close";
import { Element } from "../types";
import {
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
  MdOutlinePermMedia,
} from "react-icons/md";
import {
  elementMediaOnly,
  elementTextBlockOnly,
  elementTextLeftMediaRight,
  elementTextOverBgMedia,
  elementTextRightMediaLeft,
} from "@/config/addOnSection";
import Image from "next/image";

import TextOverBg from "@/public/images/custom-page/TextBackground.png";
import TextRightMediaLeft from "@/public/images/custom-page/MediaLeftTextRight.png";
import TextLeftMediaRight from "@/public/images/custom-page/TextLeftMediaRight.png";
import MediaOnly from "@/public/images/custom-page/BackgroundMedia.png";
import TextBlockOnly from "@/public/images/custom-page/TextBlock.png";

export default function AddOverviewSectionModal({
  isShow,
  onAddNewElement,
  onClose,
}: {
  isShow: boolean;
  onAddNewElement: (element: Element) => void;
  onClose: () => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categorizedOptions = [
    {
      category: "Text and Media",
      options: [
        {
          option: "Text over background media",
          element: elementTextOverBgMedia,
          exampleImage: TextOverBg,
        },
        {
          option: "Media on the left and text on the right",
          element: elementTextRightMediaLeft,
          exampleImage: TextRightMediaLeft,
        },
        {
          option: "Text on the left and media on the right",
          element: elementTextLeftMediaRight,
          exampleImage: TextLeftMediaRight,
        },
        {
          option: "Background media",
          element: elementMediaOnly,
          exampleImage: MediaOnly,
        },
        {
          option: "Text block",
          element: elementTextBlockOnly,
          exampleImage: TextBlockOnly,
        },
      ],
    },
    // {
    //   category: "Media Only",
    //   options: [
    //     { option: "Image only", element: elementMediaOnly, exampleImage: MediaOnly },
    //     { option: "Video only", element: elementMediaOnly, exampleImage: MediaOnly },
    //   ],
    // },
  ];

  return (
    <div
      style={{
        right: isShow ? "20px" : "-400px",
        transition: "all 0.25s ease",
      }}
      className="fixed z-50 top-[50%] -translate-y-[50%] bg-[#212121] text-white rounded-md shadow-md h-[700px] w-[400px] flex flex-col p-6 gap-5"
    >
      <div className="w-full py-5 font-bold text-heading-xs !text-[20px] tracking-wide flex items-center justify-between ">
        <div>Add section</div>
        <div onClick={() => onClose()} className="cursor-pointer">
          <CloseIcon height={20} color="white" />
        </div>
      </div>

      <div className="w-full flex flex-col flex-1 overflow-y-auto">
        {categorizedOptions.map((category, index) => (
          <div key={index} className="mb-4 w-full">
            {/* Category Title */}
            <div
              className="flex flex-col items-center justify-between cursor-pointer py-2 px-3 bg-gray-800 hover:bg-gray-700 rounded-md w-full gap-2"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === category.category ? null : category.category
                )
              }
            >
              <div className="flex items-center justify-between rounded-md w-full">
                <div className="flex items-center gap-2">
                  <MdOutlinePermMedia size={20} />
                  <span className="font-bold">{category.category}</span>
                </div>
                {openDropdown === category.category ? (
                  <MdOutlineArrowDropUp size={24} />
                ) : (
                  <MdOutlineArrowDropDown size={24} />
                )}
              </div>

              <span className="text-sm text-gray-400">
                Inspire your community by telling them more about your items and
                collection via photos, video, and text...
              </span>
            </div>

            {/* Dropdown Options */}
            {openDropdown === category.category && (
              <div className="mt-2">
                {category.options.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => onAddNewElement(option.element)}
                    className="flex gap-4 p-3 text-[#6A6A6A] hover:bg-gray-700 text-body-16 rounded-md cursor-pointer flex-col"
                  >
                    <Image
                      src={option.exampleImage}
                      alt={option.option}
                      className="w-full h-full rounded-md object-cover"
                    />
                    <span>{option.option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
