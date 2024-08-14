"use client";

import { useState } from "react";

function DropdownRoot({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="w-full h-full relative">
      <div
        onBlur={async (e) => {
          await new Promise((resolve) => setTimeout(() => resolve(true), 150));
          setOpen(false);
        }}
        tabIndex={0}
        autoFocus={isOpen}
        className="w-full h-full flex cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!isOpen);
        }}
      >
        <div>{label}</div>
        <div>{icon}</div>
      </div>
      {isOpen && (
        <div className="flex flex-col absolute top-[100%] text-[0.9rem] left-[50%] -translate-x-[50%] translate-y-[5px] bg-[white] z-[100] shadow-sm rounded-sm border-solid border-[1px] border-[#E0E0E0]">
          {children}
        </div>
      )}
    </div>
  );
}

function DropDownItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
      className="w-[140px] px-[15px] py-[10px] cursor-pointer hover:bg-[#E0E0E0]"
    >
      {children}
    </div>
  );
}

export const Dropdown = {
  Root: DropdownRoot,
  Item: DropDownItem,
};
