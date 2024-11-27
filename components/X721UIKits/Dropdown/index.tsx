"use client";

import useOnScreen from "@/hooks/useOnScreen";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type DropdownRootContextType = {
  onDropdownFullyRendered?: () => void;
};

const DropdownRootContext = createContext<DropdownRootContextType>({});

function DropdownRoot({
  label,
  icon,
  children,
  dropdownContainerClassName = "",
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  dropdownContainerClassName?: string;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isFullyRendered, setFullyRendered] = useState(false);
  const [exceedRight, setExceedRight] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
    const handleOnResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleOnResize);
    return () => window.removeEventListener("resize", handleOnResize);
  }, []);

  useEffect(() => {
    if (isFullyRendered && dropdownRef && dropdownRef.current) {
      const right =
        dropdownRef.current.getBoundingClientRect().x +
        dropdownRef.current.offsetWidth;
      if (right > windowWidth) {
        setExceedRight(true);
      }
    }
  }, [isFullyRendered, windowWidth]);

  useEffect(() => {
    if (!isOpen) {
      setFullyRendered(false);
      setExceedRight(false);
    }
  }, [isOpen]);

  const onDropdownFullyRendered = () => {
    setFullyRendered(true);
  };

  return (
    <DropdownRootContext.Provider value={{ onDropdownFullyRendered }}>
      <div className="w-full h-full relative">
        <div
          onBlur={async (e) => {
            await new Promise((resolve) =>
              setTimeout(() => resolve(true), 150)
            );
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
          <div className="w-full">{icon}</div>
        </div>
        {isOpen && (
          <div
            style={
              exceedRight
                ? {
                    right: "0%",
                    transform: "translateY(5px)",
                  }
                : {
                    left: "50%",
                    transform: "translate(-50%, 5px)",
                  }
            }
            ref={dropdownRef}
            className={
              dropdownContainerClassName +
              ` flex flex-col absolute top-[100%] text-[0.9rem] bg-[white] z-[100] px-3 py-2
                shadow-xl rounded-2xl border-solid border-[1px] border-[#E0E0E0] animate-fade-in`
            }
          >
            {children}
          </div>
        )}
      </div>
    </DropdownRootContext.Provider>
  );
}

function DropDownItem({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(ref);
  const { onDropdownFullyRendered } = useContext(DropdownRootContext);

  useEffect(() => {
    if (isOnScreen && onDropdownFullyRendered) {
      onDropdownFullyRendered();
    }
  }, [isOnScreen, onDropdownFullyRendered]);

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
      className={`${className} w-[140px] px-[15px] py-[10px] cursor-pointer hover:bg-[#E0E0E0]`}
    >
      {children}
    </div>
  );
}

export const Dropdown = {
  Root: DropdownRoot,
  Item: DropDownItem,
};
