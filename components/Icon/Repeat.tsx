import React from "react";
import { IconProps } from "@/components/Icon/index";
import { classNames } from "@/utils/string";

export default function RepeatIcon({
  color,
  className,
  width,
  height,
}: IconProps) {
  return (
    <svg
      className={classNames(`text-${color}`, className)}
      width={width}
      height={height}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="34" height="34" rx="12" fill="#F5F5F5" />
      <g clipPath="url(#clip0_361_13562)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.2197 8.21967C20.5126 7.92678 20.9874 7.92678 21.2803 8.21967L24.2803 11.2197C24.5732 11.5126 24.5732 11.9874 24.2803 12.2803L21.2803 15.2803C20.9874 15.5732 20.5126 15.5732 20.2197 15.2803C19.9268 14.9874 19.9268 14.5126 20.2197 14.2197L22.6893 11.75L20.2197 9.28033C19.9268 8.98744 19.9268 8.51256 20.2197 8.21967Z"
          fill="#252525"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.25 12.5C12.6533 12.5 12.081 12.7371 11.659 13.159C11.2371 13.581 11 14.1533 11 14.75V16.25C11 16.6642 10.6642 17 10.25 17C9.83579 17 9.5 16.6642 9.5 16.25V14.75C9.5 13.7554 9.89509 12.8016 10.5983 12.0983C11.3016 11.3951 12.2554 11 13.25 11H23.75C24.1642 11 24.5 11.3358 24.5 11.75C24.5 12.1642 24.1642 12.5 23.75 12.5H13.25Z"
          fill="#252525"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.7803 18.7197C14.0732 19.0126 14.0732 19.4874 13.7803 19.7803L11.3107 22.25L13.7803 24.7197C14.0732 25.0126 14.0732 25.4874 13.7803 25.7803C13.4874 26.0732 13.0126 26.0732 12.7197 25.7803L9.71967 22.7803C9.42678 22.4874 9.42678 22.0126 9.71967 21.7197L12.7197 18.7197C13.0126 18.4268 13.4874 18.4268 13.7803 18.7197Z"
          fill="#252525"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.75 17C24.1642 17 24.5 17.3358 24.5 17.75V19.25C24.5 20.2446 24.1049 21.1984 23.4017 21.9016C22.6984 22.6049 21.7446 23 20.75 23H10.25C9.83579 23 9.5 22.6642 9.5 22.25C9.5 21.8358 9.83579 21.5 10.25 21.5H20.75C21.3467 21.5 21.919 21.2629 22.341 20.841C22.7629 20.419 23 19.8467 23 19.25V17.75C23 17.3358 23.3358 17 23.75 17Z"
          fill="#252525"
        />
      </g>
      <defs>
        <clipPath id="clip0_361_13562">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(8 8)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
