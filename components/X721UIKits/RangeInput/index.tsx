import React, { useEffect, useRef } from "react";
import "./style.css";

type Props = {
  max: number;
  min: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  width?: string;
  activeColor?: string;
};

const RangeInput: React.FC<Props> = ({
  max,
  min,
  step = 1,
  value,
  onChange,
  width = "200px",
  activeColor = "#040404",
}) => {
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inactiveColor = "#e3e3e3";
    if (!sliderRef.current) return;
    document.documentElement.style.setProperty("--activeColor", activeColor);
    const ratio = ((value - min) / (max - min)) * 100;
    sliderRef.current.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
    if (ratio < 100) {
      if (ratio === 0) {
        sliderRef.current.style.borderRadius = "10px 0px 0px 10px";
      } else {
        sliderRef.current.style.borderRadius = "0px";
      }
    } else {
      sliderRef.current.style.borderRadius = "0px 10px 10px 0px";
    }
  }, [min, max, value, activeColor]);

  return (
    <input
      ref={sliderRef}
      name="range"
      className={`inputRange w-[${width}]`}
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        onChange(Number(e.target.value));
      }}
    />
  );
};

export default RangeInput;
