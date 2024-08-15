"use client";

import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

type Props = {
  size?: number;
  color?: CSSProperties["color"];
  loading?: boolean;
  className?: string;
};

const MySpinner: React.FC<Props> = ({
  size = 43,
  color = "#42A5F5",
  loading = true,
  className = "",
}) => {
  return (
    <div className={className}>
      <ClipLoader
        color={color}
        loading={loading}
        size={size}
        cssOverride={{
          margin: "0 auto",
          display: "block",
          borderWidth: `${size / 10.75}px`,
        }}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default MySpinner;
