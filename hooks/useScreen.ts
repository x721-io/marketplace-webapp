import { useEffect, useState } from "react";

export const useScreen = () => {
  const [screenSize, setScreenSize] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    setScreenSize(window.innerWidth); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const screen =
    screenSize >= 1080 ? "desktop" : screenSize >= 768 ? "tablet" : "mobile";

  return {
    screen,
  };
};
