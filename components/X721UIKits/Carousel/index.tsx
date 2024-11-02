"use client";

import ChevronDownIcon from "@/components/Icon/ChevronDown";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type CarouselRootProps = {
  autoPlay?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  initCurrentIndex?: number;
  slideIntervalInMs?: number;
};

type CarouselItemProps = {
  children: React.ReactNode;
};

type CarouselContextType = {
  isMouseUp: boolean;
};

const CarouselContext = createContext<CarouselContextType>({
  isMouseUp: false,
});

const CarouselRoot: React.FC<CarouselRootProps> = ({
  autoPlay = true,
  pauseOnHover = true,
  children,
  initCurrentIndex = 0,
  slideIntervalInMs = 5000,
}) => {
  const interval = useRef<any>(null);
  const [isMouseUp, setMouseUp] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [isAutoplay, setAutoplay] = useState(autoPlay);
  const [currentIndex, setCurrentIndex] = useState(initCurrentIndex);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAutoplay) {
      interval.current = setInterval(
        () => setCurrentIndex((prev) => prev + 1),
        slideIntervalInMs
      );
      return () => clearInterval(interval.current);
    } else {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    }
  }, [isAutoplay, slideIntervalInMs]);

  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      const children = scrollRef.current.children;
      setTotalItem(Array.from(children).length);
    }
  }, []);

  useEffect(() => {
    if (totalItem === 0) return;
    if (scrollRef && scrollRef.current) {
      if (currentIndex < totalItem) {
        const children = scrollRef.current.children;
        const childWidth =
          Array.from(children)[0].getBoundingClientRect().width;
        scrollRef.current.scrollTo({
          left: (childWidth + 5) * currentIndex,
          behavior: "smooth",
        });
      } else {
        setCurrentIndex(0);
      }
    }
  }, [currentIndex, totalItem]);

  const handlePrev = () => {
    if (scrollRef && scrollRef.current) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        setCurrentIndex(totalItem - 1);
      }
    }
  };

  const handleNext = () => {
    if (scrollRef && scrollRef.current) {
      if (currentIndex < totalItem - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        if (scrollRef && scrollRef.current) {
          setCurrentIndex(0);
        }
      }
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setMouseUp(false);
    const ele = scrollRef.current;
    if (!ele) {
      return;
    }
    const startPos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };

    const handleMouseMove = (e: any) => {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      ele.scrollTop = startPos.top - dy;
      ele.scrollLeft = startPos.left - dx;
      updateCursor(ele);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // if(scrollRef && scrollRef.current) {
      //   const children = scrollRef.current.children
      //   const nearest = Array.from(children).map((child, i) => {
      //     const currScrollLeft = scrollRef.current!.scrollLeft + 5
      //     const distanceToScrolLLeft = child.getBoundingClientRect().right - currScrollLeft
      //     const a = {
      //       distance: Math.abs(distanceToScrolLLeft),
      //       index: i
      //     }
      //     console.log(currScrollLeft)
      //     console.log()
      //     return a
      //   }).sort((a, b) => a.distance - b.distance)[0].index
      //   console.log({nearest})
      // }
      setMouseUp(true);
      resetCursor(ele);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const ele = scrollRef.current;
    if (!ele) {
      return;
    }
    const touch = e.touches[0];
    const startPos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      x: touch.clientX,
      y: touch.clientY,
    };

    const handleTouchMove = (e: any) => {
      const touch = e.touches[0];
      const dx = touch.clientX - startPos.x;
      const dy = touch.clientY - startPos.y;
      ele.scrollTop = startPos.top - dy;
      ele.scrollLeft = startPos.left - dx;
      updateCursor(ele);
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      resetCursor(ele);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  }, []);

  const updateCursor = (ele: any) => {
    ele.style.cursor = "grabbing";
    ele.style.userSelect = "none";
  };

  const resetCursor = (ele: any) => {
    ele.style.cursor = "grab";
    ele.style.removeProperty("user-select");
  };

  return (
    <CarouselContext.Provider value={{ isMouseUp }}>
      <div
        onMouseEnter={() => {
          if (pauseOnHover && autoPlay) {
            setAutoplay(false);
          }
        }}
        onMouseLeave={() => {
          if (autoPlay && autoPlay) {
            setAutoplay(true);
          }
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="w-full h-full relative cursor-grab"
      >
        <button
          onClick={handlePrev}
          className="-left-[20px] rotate-[90deg]  absolute w-[40px] h-[40px] bg-[rgba(255,255,255,0.6)] hover:bg-[white] rounded-full top-[50%] -translate-y-[25%] z-[10]"
        >
          <ChevronDownIcon className="scale-[0.6]" />
        </button>
        <div
          ref={scrollRef}
          className="h-full flex overflow-x-hidden gap-[5px] snap-x snap-mandatory"
        >
          {children}
        </div>
        <button
          onClick={handleNext}
          className="right-[0%] z-[10] translate-x-[20px] rotate-[-90deg] absolute w-[40px] h-[40px] bg-[rgba(255,255,255,0.6)] hover:bg-[white] rounded-full top-[50%] -translate-y-[25%]"
        >
          <ChevronDownIcon className="scale-[0.6]" />
        </button>
        <div className="absolute w-full bottom-0 h-[30px] flex items-center justify-center gap-3">
          {Array(totalItem)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                style={{
                  opacity: currentIndex === i ? 1 : 0.5,
                }}
                className="w-[22px] h-[4px] bg-[white] rounded-md"
              ></div>
            ))}
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselItem: React.FC<CarouselItemProps> = ({ children }) => {
  const { isMouseUp } = useContext(CarouselContext);
  return (
    <div
      style={
        isMouseUp
          ? {
              scrollSnapAlign: "start",
            }
          : {}
      }
      className="w-[100%] h-[100%] flex-shrink-0 flex items-center justify-center [&_img]:pointer-events-none [&_img]:select-none relative"
    >
      {children}
    </div>
  );
};

export const MyCarousel = {
  Root: CarouselRoot,
  Item: CarouselItem,
};
