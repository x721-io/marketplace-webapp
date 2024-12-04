"use client";

import CloseIcon from "@/components/Icon/Close";
import { Element, ElementType } from "../types";

export default function AddOverviewSectionModal({
  isShow,
  onAddNewElement,
  onClose,
}: {
  isShow: boolean;
  onAddNewElement: (element: Element) => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        right: isShow ? "20px" : "-400px",
        transition: "all 0.25s ease",
      }}
      className="fixed z-50 top-[50%] -translate-y-[50%] bg-[#212121] text-white rounded-md shadow-md h-[700px] w-[400px] flex flex-col pl-7 pr-2 pb-5"
    >
      <div className="w-full h-[80px] font-bold text-heading-xs !text-[20px] tracking-wide flex items-center justify-between pr-5">
        <div>Add section</div>
        <div onClick={() => onClose()} className="cursor-pointer">
          <CloseIcon height={20} color="white" />
        </div>
      </div>
      <div className="w-full flex flex-col flex-1 overflow-y-auto pr-5">
        <div
          onClick={() => {
            const element: Element = {
              type: ElementType.CONTAINER,
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              height: "500px",
              styles: {
                position: "relative",
              },
              children: [
                {
                  type: ElementType.CONTAINER,
                  width: "100%",
                  height: "600px",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  children: [
                    {
                      type: ElementType.IMAGE,
                      src: "https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid",
                      height: "500px",
                    },
                  ],
                },
                {
                  type: ElementType.CONTAINER,
                  width: "100%",
                  height: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  styles: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  children: [
                    {
                      type: ElementType.TEXT,
                      contentType: "TITLE",
                      text: {
                        content: "This is a title",
                        color: "#ffffff",
                        fontSize: "26px",
                        fontWeight: 700,
                        textAlign: "center",
                      },
                    },
                    {
                      type: ElementType.TEXT,
                      contentType: "DESCRIPTION",
                      text: {
                        content: "This is a description.",
                        color: "#ffffff",
                        fontSize: "18px",
                        fontWeight: 300,
                        textAlign: "center",
                      },
                    },
                  ],
                },
              ],
            };
            onAddNewElement(element);
          }}
          className="w-full cursor-pointer"
        >
          Text over background media
        </div>
        <div
          onClick={() => {
            const element: Element = {
              type: ElementType.CONTAINER,
              width: "100%",
              background: "#ffffff",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              children: [
                {
                  type: ElementType.CONTAINER,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  background: "transparent",
                  styles: {
                    width: "50%",
                    paddingLeft: "100px",
                    paddingRight: "100px",
                    gap: "10px",
                    alignSelf: "stretch",
                  },
                  children: [
                    {
                      type: ElementType.TEXT,
                      contentType: "TITLE",
                      text: {
                        content: "At the Cornerstone of Digital Identity",
                        color: "#000000",
                        fontSize: "26px",
                        fontWeight: 700,
                        textAlign: "left",
                      },
                    },
                    {
                      type: ElementType.TEXT,
                      contentType: "DESCRIPTION",
                      text: {
                        content:
                          "Each Keeper is a fully-rigged and gameplay-ready 3D identity. Downloadable digital files make each avatar ready for use in 4K film and media, AAA gaming, and networked metaverse environments.",
                        color: "#000000",
                        fontSize: "18px",
                        fontWeight: 300,
                        textAlign: "left",
                      },
                    },
                  ],
                },
                {
                  type: ElementType.CONTAINER,
                  width: "50%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  children: [
                    {
                      type: ElementType.IMAGE,
                      src: "https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid",
                      width: "100%",
                      height: "500px",
                    },
                  ],
                },
              ],
            };
            onAddNewElement(element);
          }}
          className="w-full cursor-pointer"
        >
          Text left, media right
        </div>
        <div
          onClick={() => {
            const element: Element = {
              type: ElementType.CONTAINER,
              width: "100%",
              background: "#ffffff",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              children: [
                {
                  type: ElementType.CONTAINER,
                  width: "50%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  children: [
                    {
                      type: ElementType.IMAGE,
                      src: "https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid",
                      width: "100%",
                      height: "500px",
                    },
                  ],
                },
                {
                  type: ElementType.CONTAINER,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  background: "transparent",
                  styles: {
                    width: "50%",
                    paddingLeft: "100px",
                    paddingRight: "100px",
                    gap: "10px",
                    alignSelf: "stretch",
                  },
                  children: [
                    {
                      type: ElementType.TEXT,
                      contentType: "TITLE",
                      text: {
                        content: "At the Cornerstone of Digital Identity",
                        color: "#000000",
                        fontSize: "26px",
                        fontWeight: 700,
                        textAlign: "left",
                      },
                    },
                    {
                      type: ElementType.TEXT,
                      contentType: "DESCRIPTION",
                      text: {
                        content:
                          "Each Keeper is a fully-rigged and gameplay-ready 3D identity. Downloadable digital files make each avatar ready for use in 4K film and media, AAA gaming, and networked metaverse environments.",
                        color: "#000000",
                        fontSize: "18px",
                        fontWeight: 300,
                        textAlign: "left",
                      },
                    },
                  ],
                },
              ],
            };
            onAddNewElement(element);
          }}
          className="w-full cursor-pointer"
        >
          Text right, media left
        </div>
        <div
          onClick={() => {
            const element: Element = {
              type: ElementType.CONTAINER,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              children: [
                {
                  type: ElementType.IMAGE,
                  src: "https://img.freepik.com/premium-photo/seamless-geometric-pattern-fabric-wallpaper-background-design_955379-17743.jpg?semt=ais_hybrid",
                  width: "100%",
                  height: "500px",
                },
              ],
            };
            onAddNewElement(element);
          }}
          className="w-full cursor-pointer"
        >
          Media only
        </div>
        <div
          onClick={() => {
            const element: Element = {
              type: ElementType.CONTAINER,
              width: "100%",
              height: "400px",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              children: [
                {
                  type: ElementType.CONTAINER,
                  width: "100%",
                  height: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  styles: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                  },
                  children: [
                    {
                      type: ElementType.TEXT,
                      contentType: "TITLE",
                      text: {
                        content: "This is a title",
                        color: "#000000",
                        fontSize: "26px",
                        fontWeight: 700,
                        textAlign: "center",
                      },
                    },
                    {
                      type: ElementType.TEXT,
                      contentType: "DESCRIPTION",
                      text: {
                        content: "This is a description.",
                        color: "#000000",
                        fontSize: "18px",
                        fontWeight: 300,
                        textAlign: "center",
                      },
                    },
                  ],
                },
              ],
            };
            onAddNewElement(element);
          }}
          className="w-full cursor-pointer"
        >
          Text block only
        </div>
      </div>
    </div>
  );
}
