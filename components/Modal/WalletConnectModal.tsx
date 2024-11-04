import Text from "@/components/Text";
import Icon from "@/components/Icon";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import { connect } from "@wagmi/core";
import MySpinner from "../X721UIKits/Spinner";
import { MyModal, MyModalProps } from "../X721UIKits/Modal";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";

interface Props extends MyModalProps {
  onSignMessage: () => void;
}

export default function WalletConnectModal({
  show,
  onClose,
  onSignMessage,
}: Props) {
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
        <div className="mx-auto flex flex-col desktop:gap-8 tablet:gap-8 gap-4 p-2 desktop:p-8 items-center overflow-ellipsis">
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
                  onClick={() => handleConnect(connectors[0])}
                  className="flex justify-between items-center w-full"
                >
                  <p>{connectors[0].name}</p>
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
                        onClick={() =>
                          isMobile
                            ? handleConnect(connector, connect)
                            : handleConnect(connector)
                        }
                        className="flex justify-between items-center w-full"
                      >
                        <p>Bitget</p>
                      </button>
                    </div>
                  );
                }}
              </WalletButton.Custom>
            </div>
          </div>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
