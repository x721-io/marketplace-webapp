import React, { useMemo } from "react";
import { classNames } from "@/utils/string";
import "./styles.css";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: {
    label: string;
    value: any;
  }[];
  width?: string;
  containerClass?: string;
  scale?: "md" | "lg" | "sm";
  prependIcon?: React.ReactNode;
  prependIconContainerClass?: string;
  error?: boolean;
  success?: boolean;
  errorMessage?: string;
  register?: UseFormRegisterReturn;
}

export default function Select({
  options = [],
  prependIcon,
  prependIconContainerClass,
  containerClass,
  scale,
  success,
  error,
  errorMessage,
  className,
  register,
  ...rest
}: Props) {
  const baseClass =
    "bg-surface-soft outline-none placeholder:text-tertiary focus-visible:ring-[0.5px] w-full";

  const scaleClass = useMemo(() => {
    switch (scale) {
      case "lg":
        return classNames(
          "text-body-16 rounded-2xl min-w-72 h-14 p-4",
          !!prependIcon && "ps-10"
        );
      case "md":
      default:
        return classNames(
          "text-body-14 rounded-2xl min-w-72 h-12 p-3",
          !!prependIcon && "ps-10"
        );
      case "sm":
        return classNames(
          "text-body-14 rounded-xl min-w-60 h-10 px-3 py-1",
          !!prependIcon && "ps-9"
        );
    }
  }, [scale, prependIcon]);

  const colorClass = useMemo(() => {
    switch (true) {
      case success:
        return "text-success ring-success";
      case error:
        return "text-error border-error border-[0.5px]";
      default:
        return "text-primary focus-visible:ring-primary border-none";
    }
  }, [success, error]);

  return (
    <div
      className={classNames(
        "flex items-center relative w-auto",
        containerClass
      )}
    >
      {!!prependIcon && (
        <div
          className={classNames(
            "absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none",
            prependIconContainerClass
          )}
        >
          {prependIcon}
        </div>
      )}
      <select
        className={classNames(baseClass, scaleClass, colorClass)}
        {...register}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
