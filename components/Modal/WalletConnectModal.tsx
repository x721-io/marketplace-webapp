import Text from "@/components/Text";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import { MyModal, MyModalProps } from "../X721UIKits/Modal";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import MetamaskImage from "@/assets/images/metamask.png";
import BitgetImage from "@/assets/images/bitget.png";
import U2UImage from "@/assets/images/u2u.png";
import Image from "next/image";
import useDetectWallets from "@/hooks/useDetectWallets";
import useDevice from "@/hooks/useDevice";
import useDetectDAppWallets from "@/hooks/useDetectDAppWallets";
import { MARKETPLACE_URL } from "@/config/constants";

interface Props extends MyModalProps {
  onSignMessage: () => void;
}

export default function WalletConnectModal({
  show,
  onClose,
  onSignMessage,
}: Props) {
  const { isIphone, isAndroid } = useDevice();
  const { isMetamask, isBitget } = useDetectWallets();
  const { isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [isMobile, setIsMobile] = useState(false);
  const { isBitgetDapp, isU2UDapp } = useDetectDAppWallets();

  const handleConnect = async (
    connector: Connector,
    connect?: () => Promise<void>
  ) => {
    try {
      if (isConnected) {
        await disconnectAsync();
      }
      if (connect) {
        await connect();
      } else {
        await connectAsync({ connector });
      }
      setTimeout(() => {
        onSignMessage();
        onClose && onClose();
      }, 100);
    } catch (e) {
      console.error("Error connecting wallet:", e);
    }
  };

  const getDappWalletInfo = () => {
    if (isBitgetDapp) {
      return {
        image: BitgetImage.src,
        name: "Bitget",
      };
    }
    if (navigator.userAgent.includes("MetaMaskMobile")) {
      return {
        image: MetamaskImage.src,
        name: "MetaMask",
      };
    }
    if (isU2UDapp) {
      return {
        image: U2UImage.src,
        name: "U2U",
      };
    }
    return {
      image: "",
      name: "Injected Wallet",
    };
  };

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body>
        <div className="mx-auto  flex flex-col desktop:gap-8 tablet:gap-8 gap-4 p-2 desktop:p-8 items-center overflow-ellipsis">
          <Text className="desktop:text-heading-md tablet:text-heading-md text-body-32 text-primary font-semibold text-center">
            Connect wallet
          </Text>
          <Text className="text-body-18 text-secondary text-center">
            Choose a wallet you want to connect. There are several wallet
            providers.
          </Text>

          <div className="w-full flex flex-col gap-5">
            <div className="w-full flex flex-col gap-5">
              {!isBitgetDapp &&
                !navigator.userAgent.includes("MetaMaskMobile") &&
                !isU2UDapp && (
                  <div
                    key={connectors[0].id}
                    className="cursor-pointer px-4 py-2 tablet:px-5 tablet:py-3 border border-gray-200 rounded-xl flex items-center  transition-all hover:bg-gray-300 hover:border-transparent hover:text-black"
                  >
                    <button
                      onClick={async () => {
                        if (!isMetamask && !isAndroid && !isIphone) {
                          window.open(
                            "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
                            "_blank"
                          );
                          return;
                        }
                        if (isAndroid || isIphone) {
                          window.location.href = `https://metamask.app.link/dapp/${MARKETPLACE_URL}`;
                          setTimeout(function () {
                            if (document.hasFocus()) {
                              window.location.href = isAndroid
                                ? "https://play.google.com/store/apps/details?id=io.metamask&hl=en"
                                : "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202";
                            }
                          }, 1000);
                          return;
                        }
                        handleConnect(connectors[0]);
                      }}
                      className="flex justify-between items-center w-full"
                    >
                      <div className="w-full flex items-center gap-5 font-bold text-lg">
                        <Image
                          src={MetamaskImage.src}
                          alt="bitget-ico"
                          width={35}
                          height={35}
                        />
                        Metamask{" "}
                        {!isMetamask &&
                          !isAndroid &&
                          !isIphone &&
                          `(Not Installed)`}
                      </div>
                    </button>
                  </div>
                )}
              {!isBitgetDapp &&
                !navigator.userAgent.includes("MetaMaskMobile") &&
                !isU2UDapp && (
                  <WalletButton.Custom wallet="bitget">
                    {({ ready, connect, connector }) => {
                      return (
                        <div className="cursor-pointer px-4 py-2 tablet:px-5 tablet:py-3 border border-gray-200 rounded-xl flex items-center  transition-all hover:bg-gray-300 hover:border-transparent hover:text-black">
                          <button
                            onClick={async () => {
                              if (!isBitget && !isAndroid && !isIphone) {
                                window.open(
                                  "https://chromewebstore.google.com/detail/bitget-wallet-formerly-bi/jiidiaalihmmhddjgbnbgdfflelocpak",
                                  "_blank"
                                );
                                return;
                              }
                              if (isAndroid || isIphone) {
                                window.location.href = `bitkeep://bkconnect?action=dapp&url=${MARKETPLACE_URL}`;
                                setTimeout(function () {
                                  if (document.hasFocus()) {
                                    window.location.href = isAndroid
                                      ? "https://play.google.com/store/apps/details?id=com.bitkeep.wallet&hl=en"
                                      : "https://apps.apple.com/us/app/bitget-wallet-crypto-bitcoin/id1395301115";
                                  }
                                }, 1000);
                                return;
                              }
                              handleConnect(connector);
                            }}
                            className="flex justify-between items-center w-full"
                          >
                            <div className="w-full flex items-center gap-5 font-bold text-lg">
                              <Image
                                src={BitgetImage.src}
                                alt="bitget-ico"
                                width={35}
                                height={35}
                              />
                              Bitget{" "}
                              {!isBitget &&
                                !isAndroid &&
                                !isIphone &&
                                `(Not Installed)`}
                            </div>
                          </button>
                        </div>
                      );
                    }}
                  </WalletButton.Custom>
                )}

              {(isBitgetDapp ||
                navigator.userAgent.includes("MetaMaskMobile") ||
                isU2UDapp) && (
                <WalletButton.Custom wallet="injected">
                  {({ ready, connect, connector }) => {
                    return (
                      <div className="cursor-pointer px-4 py-2 tablet:px-5 tablet:py-3 border border-gray-200 rounded-xl flex items-center  transition-all hover:bg-gray-300 hover:border-transparent hover:text-black">
                        <button
                          onClick={() => {
                            handleConnect(connector);
                          }}
                          className="flex justify-between items-center w-full"
                        >
                          <div className="w-full flex items-center gap-5 font-bold text-lg">
                            <Image
                              src={getDappWalletInfo().image}
                              alt="bitget-ico"
                              width={35}
                              height={35}
                            />
                            {getDappWalletInfo().name}
                          </div>
                        </button>
                      </div>
                    );
                  }}
                </WalletButton.Custom>
              )}
            </div>
          </div>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
