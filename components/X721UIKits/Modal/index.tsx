"use client";

import CloseIcon from "@/components/Icon/Close";
import { createContext, CSSProperties, useContext, useEffect } from "react";

export type MyModalProps = {
  show?: boolean;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
  bodyContainerStyle?: React.CSSProperties;
  position?: "center" | "right" | "top-right" | "left" | "top-left";
};

type MyModalContextType = {
  onClose?: () => void;
};

const MyModalContext = createContext<MyModalContextType>({});

const ModalRoot: React.FC<MyModalProps> = ({
  show = false,
  position = "center",
  onClose,
  bodyContainerStyle,
  className,
  children,
}) => {
  if (!show) return null;

  const getStyleByPos = (): CSSProperties => {
    switch (position) {
      case "top-right":
        return {
          justifyContent: "flex-end",
          alignItems: "flex-start",
        };
      case "center":
      default:
        return {
          justifyContent: "center",
          alignItems: "center",
        };
    }
  };

  return (
    <MyModalContext.Provider value={{ onClose }}>
      <div
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            onClose && onClose();
          }
        }}
        style={getStyleByPos()}
        className={`fixed overflow-hidden top-0 left-0 z-[500] w-screen h-screen bg-[rgba(0,0,0,0.25)] flex ${className}`}
      >
        <div
          style={{
            borderRadius: position === "center" ? "8px" : 0,
            ...bodyContainerStyle,
          }}
          className="bg-[white] w-[450px] max-[450px]:w-[92%]"
        >
          {children}
        </div>
      </div>
    </MyModalContext.Provider>
  );
};

const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  const { onClose } = useContext(MyModalContext);

  return (
    <div className="w-full p-5 flex items-center justify-between font-bold text-[1.2rem] border-solid border-b-[1px] border-[#333333]">
      <div className="flex-1 ">{children}</div>
      <div onClick={onClose}>
        <CloseIcon color="white" width={20} />
      </div>
    </div>
  );
};

const ModalBody = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`w-full tablet:p-10 p-5 ${className}`}>{children}</div>
  );
};

export const MyModal = {
  Root: ModalRoot,
  Header: ModalHeader,
  Body: ModalBody,
};
