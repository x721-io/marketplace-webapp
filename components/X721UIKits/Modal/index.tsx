"use client";

import CloseIcon from "@/components/Icon/Close";
import { createContext, useContext } from "react";

export type MyModalProps = {
  show?: boolean;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
};

type MyModalContextType = {
  onClose?: () => void;
};

const MyModalContext = createContext<MyModalContextType>({});

const ModalRoot: React.FC<MyModalProps> = ({
  show = false,
  onClose,
  className,
  children,
}) => {
  if (!show) return null;
  return (
    <MyModalContext.Provider value={{ onClose }}>
      <div
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            onClose && onClose();
          }
        }}
        className={`fixed top-0 left-0 z-[500] w-screen h-screen bg-[rgba(0,0,0,0.25)] flex items-center justify-center ${className}`}
      >
        <div className="bg-[white] w-[450px] py-[25px] rounded-lg max-[450px]:w-[92%]">
          {children}
        </div>
      </div>
    </MyModalContext.Provider>
  );
};

const ModalHeader = ({ children }: { children: React.ReactNode }) => {
  const { onClose } = useContext(MyModalContext);

  return (
    <div className="w-full flex items-center justify-between px-[20px] pb-[20px] font-bold text-[1.2rem] border-solid border-b-[1px] border-[rbga(0,0,0,0.5)]">
      <div className="flex-1">{children}</div>
      <div onClick={onClose}>
        <CloseIcon color="black" width={20} />
      </div>
    </div>
  );
};

const ModalBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full  px-[20px] pt-[20px]">{children}</div>;
};

export const MyModal = {
  Root: ModalRoot,
  Header: ModalHeader,
  Body: ModalBody,
};
