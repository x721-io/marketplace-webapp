"use client";

import React from "react";
import { classNames, shortenAddress } from "@/utils/string";
import { FaCheck } from "react-icons/fa";
import Image from "next/image";

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
  imgSrc?: string;
  contractAddress?: string;
};

const ImgCheckbox: React.FC<Props> = ({
  checked,
  onChange,
  label,
  imgSrc,
  contractAddress,
}) => {
  console.log("imgSrc", imgSrc);
  return (
    <div
      className={classNames(
        "flex group items-center justify-between gap-1 w-full p-2",
        "cursor-pointer",
        checked && "active bg-surface-soft rounded-xl"
      )}
      onClick={() => {
        onChange();
      }}
    >
      <div className="flex w-full items-center gap-2  ">
        {imgSrc ? (
          <Image
            src={imgSrc || ""}
            alt={label || ""}
            width={48}
            height={48}
            className="w-full h-full max-w-12 max-h-12 rounded-lg"
          />
        ) : (
          <div className=" w-12 h-12 bg-surface-medium rounded-lg" />
        )}
        <div className="font-medium-custom text-sm flex flex-col gap-1">
          <p>{label}</p>
          <p className="">{shortenAddress(contractAddress)}</p>
        </div>
      </div>
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

export default ImgCheckbox;
