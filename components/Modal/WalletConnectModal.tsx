import Text from "@/components/Text";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import { MyModal, MyModalProps } from "../X721UIKits/Modal";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import MetamaskImage from "@/assets/images/metamask.png";
import BitgetImage from "@/assets/images/bitget.png";
import U2UImage from "@/assets/images/u2u.png";
import Image from "next/image";
import useDetectWallets from "@/hooks/useDetectWallets";
import useDevice from "@/hooks/useDevice";

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

  const handleConnect = async (
    connector: Connector,
    connect?: () => Promise<void>
  ) => {
    try {
      if (!isConnected) {
        await disconnectAsync();
        if (connect) {
          await connect();
        } else {
          await connectAsync({ connector });
        }
      }
      onSignMessage();
      onClose && onClose();
    } catch (e) {
      console.error("Error connecting wallet:", e);
    }
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
              <div
                key={connectors[0].id}
                className="cursor-pointer px-4 py-2 tablet:px-5 tablet:py-3 border border-gray-200 rounded-xl flex items-center  transition-all hover:bg-gray-300 hover:border-transparent hover:text-black"
              >
                <button
                  onClick={() => {
                    if (!isMetamask) {
                      window.open(
                        "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
                        "_blank"
                      );
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
                    Metamask {!isMetamask && `(Not Installed)`}
                  </div>
                </button>
              </div>
              {/* <WalletButton.Custom wallet="okx">
              {({ ready, connect, connector }) => {
                return (
                  <div className="cursor-pointer px-4 py-2 tablet:px-5 tablet:py-3 border border-gray-200 rounded-xl flex items-center  transition-all hover:bg-gray-300 hover:border-transparent hover:text-black">
                    <button
                      onClick={() =>
                        isMobile
                          ? handleConnect(connector, connect)
                          : handleConnect(connector)
                      }
                      className="flex justify-between items-center w-full"
                    >
                      <p>{connector.name}</p>
                    </button>
                  </div>
                );
              }}
            </WalletButton.Custom> */}
              <WalletButton.Custom wallet="bitget">
                {({ ready, connect, connector }) => {
                  return (
                    <div className="cursor-pointer px-4 py-2 tablet:px-5 tablet:py-3 border border-gray-200 rounded-xl flex items-center  transition-all hover:bg-gray-300 hover:border-transparent hover:text-black">
                      <button
                        onClick={() => {
                          if (!isBitget) {
                            window.open(
                              "https://chromewebstore.google.com/detail/bitget-wallet-formerly-bi/jiidiaalihmmhddjgbnbgdfflelocpak",
                              "_blank"
                            );
                            return;
                          }
                          isMobile
                            ? handleConnect(connector, connect)
                            : handleConnect(connector);
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
                          Bitget {!isBitget && `(Not Installed)`}
                        </div>
                      </button>
                    </div>
                  );
                }}
              </WalletButton.Custom>
              {(isIphone || isAndroid) && (
                <WalletButton.Custom wallet="injected">
                  {({ ready, connect, connector }) => {
                    return (
                      <div className="cursor-pointer px-4 py-2 tablet:px-5 tablet:py-3 border border-gray-200 rounded-xl flex items-center  transition-all hover:bg-gray-300 hover:border-transparent hover:text-black">
                        <button
                          onClick={() => {
                            if (!isBitget) {
                              window.open(
                                "https://chromewebstore.google.com/detail/bitget-wallet-formerly-bi/jiidiaalihmmhddjgbnbgdfflelocpak",
                                "_blank"
                              );
                              return;
                            }
                            isMobile
                              ? handleConnect(connector, connect)
                              : handleConnect(connector);
                          }}
                          className="flex justify-between items-center w-full"
                        >
                          <div className="w-full flex items-center gap-5 font-bold text-lg">
                            <Image
                              src={U2UImage.src}
                              alt="bitget-ico"
                              width={35}
                              height={35}
                            />
                            U2U Wallet
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
