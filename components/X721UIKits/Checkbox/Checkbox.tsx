"use client";

import React from "react";
import { classNames } from "@/utils/string";
import { FaCheck } from "react-icons/fa";

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
};

const Checkbox: React.FC<Props> = ({ checked, onChange, label }) => {
  return (
    <div
      className={classNames(
        "flex group justify-between gap-1 w-full p-3",
        "cursor-pointer",
        checked && "active bg-surface-soft rounded-xl"
      )}
      onClick={() => {
        onChange();
      }}
    >
      <div className="font-medium-custom text-sm">{label}</div>
      <div
        className={classNames(
          "rounded-lg",
          "transition-all duration-300  p-1",
          !checked && "group-hover:bg-surface-medium"
        )}
      >
        <FaCheck className="size-4 text-transparent group-[.active]:text-primary" />
      </div>
    </div>
  );
};

export default Checkbox;
