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
