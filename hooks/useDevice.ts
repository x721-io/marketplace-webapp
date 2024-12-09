import { useEffect, useState } from "react";

const useDevice = () => {
  const [isIphone, setIphone] = useState(false);
  const [isAndroid, setAndroid] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
      setAndroid(true);
      //   window.location.href =
      //     'http://play.google.com/store/apps/details?id=PACKAGEURL';
    }
    if (navigator.userAgent.toLowerCase().indexOf("iphone") > -1) {
      setIphone(true);
      //   window.location.href = 'http://itunes.apple.com/lb/app/PACKAGEURL';
    }
  }, []);

  return {
    isIphone,
    isAndroid,
  };
};

export default useDevice;

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
