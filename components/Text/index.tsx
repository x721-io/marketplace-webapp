"use client";

import { classNames } from "@/utils/string";
import { typography } from "@/config/theme";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

type VariantType = keyof typeof typography;
interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: VariantType;
  showTooltip?: boolean;
  labelTooltip?: string | null;
}

export default function Text({
  className,
  variant,
  showTooltip,
  children,
  labelTooltip,
  ...rest
}: Props) {
  if (variant?.includes("heading")) {
    return (
      <h1 className={classNames(className, `text-${variant}`)} {...rest}>
        {children}
      </h1>
    );
  }

  if (showTooltip) {
    return (
      <a
        data-tooltip-id={labelTooltip ?? "label-tooltip"}
        data-tooltip-content={labelTooltip}
      >
        <p
          className={classNames(
            className,
            `text-${
              variant || "body-14"
            }, text-ellipsis break-all whitespace-nowrap overflow-hidden`
          )}
          {...rest}
        >
          {children}
        </p>
        <Tooltip id={labelTooltip ?? "label-tooltip"} />
      </a>
    );
  }

  return (
    <p
      className={classNames(className, `text-${variant || "body-14"}`)}
      {...rest}
    >
      {children}
    </p>
  );
}
