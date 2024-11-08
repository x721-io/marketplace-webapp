import { useEffect, useState } from "react";
import useDevice from "./useDevice";

declare global {
  interface Window {
    okxwallet: any;
    isMetaMask: any;
  }
}

const useDetectDAppWallets = () => {
  const [isClient, setClient] = useState(false);
  const [isU2UDapp, setIsU2UDapp] = useState(false);
  const [isBitgetDapp, setIsBitgetDapp] = useState(false);
  const { isAndroid, isIphone } = useDevice();

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const isBitKeep = navigator.userAgent.indexOf("BitKeep") > 0;
      const isU2UDapp = window.ethereum && window.ethereum.isTrust;
      setIsBitgetDapp(isBitKeep);
      setIsU2UDapp(isU2UDapp);
    }
  }, [isClient, isAndroid, isIphone]);

  return { isBitgetDapp, isU2UDapp };
};

export default useDetectDAppWallets;
