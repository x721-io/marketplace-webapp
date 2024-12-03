"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Element, ElementType, Text, Video } from "../types";
import CloseIcon from "@/components/Icon/Close";

export default function EditOverviewSectionModal({
  isShow,
  element,
  index,
  onUpdateElement,
  onClose,
}: {
  isShow: boolean;
  element: Element | null;
  index: number;
  onUpdateElement: (path: string, updatedElement: Element) => void;
  onClose: () => void;
}) {
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [mediaElements, setMediaElements] = useState<
    Array<Video & { path: string }>
  >([]);
  const [textElements, setTextElements] = useState<
    Array<Text & { path: string }>
  >([]);
  const [containerElements, setContainerElements] = useState<
    Array<Container & { path: string }>
  >([]);
  const [textContainerElement, setTextContainerElement] = useState<
    (Container & { path: string }) | null
  >(null);
  const [justifyContent, setJustifyContent] = useState<
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
  >("flex-start");
  const [alignItems, setAlignItems] = useState<
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
  >("flex-start");

  useEffect(() => {
    const processData = (
      element: Element,
      path: string,
      mediaElements: Array<Video & { path: string }>,
      textElements: Array<Text & { path: string }>,
      containerElements: Array<Container & { path: string }>
    ) => {
      if (element.type !== ElementType.CONTAINER) return;
      if (!element.children) return;
      element.children.forEach((child, i) => {
        if (child.type === ElementType.CONTAINER) {
          containerElements.push({ ...child, path: path + "-" + i });
          processData(
            child,
            path + "-" + i,
            mediaElements,
            textElements,
            containerElements
          );
        } else {
          switch (child.type) {
            case ElementType.VIDEO:
              mediaElements.push({ ...child, path: path + "-" + i });
              break;
            case ElementType.TEXT:
              textElements.push({ ...child, path: path + "-" + i });
              break;
          }
        }
      });
    };
    if (element) {
      const mediaElements: Array<Video & { path: string }> = [];
      const textElements: Array<Text & { path: string }> = [];
      const containerElements: Array<Container & { path: string }> = [];
      processData(
        element,
        index.toString(),
        mediaElements,
        textElements,
        containerElements
      );
      setTextElements(textElements);
      setMediaElements(mediaElements);
      setContainerElements(containerElements);
    }
  }, [element, index]);

  useEffect(() => {
    if (textElements.length > 0 && containerElements.length > 0) {
      const path = textElements[0].path;
      const containerElement = containerElements.find((containerElement) =>
        path.startsWith(containerElement.path)
      );
      if (!containerElement) return;
      setTextContainerElement(containerElement);
      setJustifyContent(containerElement.justifyContent ?? "flex-start");
      setAlignItems(containerElement.alignItems ?? "flex-start");
    }
  }, [containerElements, textElements]);

  const getIndexByTextPos = (
    justifyContent:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly",
    alignItems:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly"
  ) => {
    if (justifyContent === "flex-start" && alignItems === "flex-start")
      return 0;
    if (justifyContent === "flex-start" && alignItems === "center") return 1;
    if (justifyContent === "flex-start" && alignItems === "flex-end") return 2;
    if (justifyContent === "center" && alignItems === "flex-start") return 3;
    if (justifyContent === "center" && alignItems === "center") return 4;
    if (justifyContent === "center" && alignItems === "flex-end") return 5;
    if (justifyContent === "flex-end" && alignItems === "flex-start") return 6;
    if (justifyContent === "flex-end" && alignItems === "center") return 7;
    if (justifyContent === "flex-end" && alignItems === "flex-end") return 8;
    return -1;
  };

  const getTextPosByIndex = (
    index: number
  ): {
    justifyContent:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
    alignItems:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
  } | null => {
    if (index === 0)
      return {
        justifyContent: "flex-start",
        alignItems: "flex-start",
      };
    if (index === 1)
      return {
        justifyContent: "flex-start",
        alignItems: "center",
      };
    if (index === 2)
      return {
        justifyContent: "flex-start",
        alignItems: "flex-end",
      };
    if (index === 3)
      return {
        justifyContent: "center",
        alignItems: "flex-start",
      };
    if (index === 4)
      return {
        justifyContent: "center",
        alignItems: "center",
      };
    if (index === 5)
      return {
        justifyContent: "center",
        alignItems: "flex-end",
      };
    if (index === 6)
      return {
        justifyContent: "flex-end",
        alignItems: "flex-start",
      };
    if (index === 7)
      return {
        justifyContent: "flex-end",
        alignItems: "center",
      };
    if (index === 8)
      return {
        justifyContent: "flex-end",
        alignItems: "flex-end",
      };
    return null;
  };

  return (
    <div
      style={{
        right: isShow ? "20px" : "-450px",
        transition: "all 0.25s ease",
      }}
      className="fixed z-50 top-[50%] -translate-y-[50%] bg-[#212121] text-white rounded-md shadow-md h-[700px] w-[450px] flex flex-col pl-7 pr-2 pb-5"
    >
      <div className="w-full h-[80px] font-bold text-heading-xs !text-[20px] tracking-wide flex items-center justify-between pr-5">
        <div>Edit section</div>
        <div onClick={() => onClose()} className="cursor-pointer">
          <CloseIcon height={20} color="white" />
        </div>
      </div>
      <div className="w-full flex flex-col flex-1 overflow-y-auto pr-5">
        {mediaElements.length > 0 && (
          <div className="w-full flex flex-col gap-5 mb-5">
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex items-center text-heading-sm !text-[19px]">
                Media
              </div>
              <div className="w-full">
                <video
                  onClick={(e) => {
                    e.stopPropagation();
                    mediaInputRef.current?.click();
                  }}
                  src={mediaElements[0].src}
                  width={"100%"}
                  className="object-cover rounded-md cursor-pointer"
                />
              </div>
              <input ref={mediaInputRef} type="file" className="hidden" />
            </div>
          </div>
        )}
        {textElements.length > 0 && (
          <div className="w-full flex flex-col gap-5">
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex items-center text-heading-sm !text-[19px]">
                Title
              </div>
              <div className="w-full">
                <input
                  type="text"
                  className="w-full rounded-md bg-transparent"
                  onChange={(e) => {
                    const index = textElements.findIndex(
                      (ele) => ele.contentType === "TITLE"
                    );
                    if (index === -1) return;
                    const updatedTextElements = structuredClone(textElements);
                    updatedTextElements[index].text.content = e.target.value;
                    setTextElements(updatedTextElements);
                    onUpdateElement(
                      textElements[index].path,
                      structuredClone(updatedTextElements[index])
                    );
                  }}
                  value={
                    textElements.find((ele) => ele.contentType === "TITLE")
                      ?.text.content
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex items-center text-heading-sm !text-[19px]">
                Description
              </div>
              <div className="w-full">
                <textarea
                  className="w-full h-[200px] rounded-md bg-transparent"
                  onChange={(e) => {
                    const index = textElements.findIndex(
                      (ele) => ele.contentType === "DESCRIPTION"
                    );
                    if (index === -1) return;
                    const updatedTextElements = structuredClone(textElements);
                    updatedTextElements[index].text.content = e.target.value;
                    setTextElements(updatedTextElements);
                    onUpdateElement(
                      textElements[index].path,
                      structuredClone(updatedTextElements[index])
                    );
                  }}
                  value={
                    textElements.find(
                      (ele) => ele.contentType === "DESCRIPTION"
                    )?.text.content
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex items-center text-heading-sm !text-[19px]">
                Text position
              </div>
              <div className="w-full flex flex-wrap justify-between rounded-xl border pt-2 pb-2 border-[rgba(0,0,0,0.07)]">
                {Array(9)
                  .fill("")
                  .map((_, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        const textAlign = getTextPosByIndex(i);
                        const updatedElement =
                          structuredClone(textContainerElement);
                        if (!textAlign) return;
                        if (!updatedElement) return;
                        setAlignItems(textAlign.alignItems);
                        setJustifyContent(textAlign.justifyContent);
                        updatedElement.alignItems = textAlign.alignItems;
                        updatedElement.justifyContent =
                          textAlign.justifyContent;
                        onUpdateElement(
                          updatedElement.path,
                          structuredClone(updatedElement)
                        );
                      }}
                      style={{
                        backgroundColor:
                          getIndexByTextPos(justifyContent, alignItems) === i
                            ? "rgba(255,255,255,0.8)"
                            : "rgba(255,255,255,0.2)",
                      }}
                      className="w-[30%] cursor-pointer transition-all mb-2 mt-2 h-[22px] flex items-center justify-center rounded-3xl"
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
