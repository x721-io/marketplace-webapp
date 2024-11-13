import { useEffect, useState } from "react";

declare global {
  interface Window {
    okxwallet: any;
    isBitKeepChrome: any;
    isBitKeep: any;
  }
}

const useDetectWallets = () => {
  const [isClient, setClient] = useState(false);
  const [isMetamask, setIsMetamask] = useState(false);
  const [isBitget, setIsBitget] = useState(false);
  const [isOkxWallet, setIsOkxWallet] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!window.ethereum) {
        setIsMetamask(false);
        setIsBitget(false);
        setIsOkxWallet(false);
        return;
      }
      const isMetamask =
        window.ethereum.isMetaMask || window.ethereum.isMetamask;
      const isBitget =
        window.ethereum.isBitget ||
        window.ethereum.isBitKeepChrome ||
        window.isBitKeepChrome ||
        window.isBitKeep;
      const isOkxWallet = window.okxwallet;
      setIsMetamask(isMetamask);
      setIsBitget(isBitget);
      setIsOkxWallet(isOkxWallet);
    }
  }, [isClient]);

  return { isMetamask, isBitget, isOkxWallet };
};

export default useDetectWallets;
