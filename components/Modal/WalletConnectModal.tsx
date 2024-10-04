import Text from "@/components/Text";
import Icon from "@/components/Icon";
import { Connector, useAccount, useConnect } from "wagmi";
import { connect } from "wagmi/actions";
import MySpinner from "../X721UIKits/Spinner";
import { MyModal, MyModalProps } from "../X721UIKits/Modal";

interface Props extends MyModalProps {
  onSignMessage: () => void;
}

export default function WalletConnectModal({
  show,
  onClose,
  onSignMessage,
}: Props) {
  const { isConnected } = useAccount();
  const { connectors, pendingConnector } = useConnect();

  const handleConnect = async (connector: Connector) => {
    try {
      if (!isConnected) {
        await connect({ connector });
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
            {connectors.map((connector) => {
              return (
                <div
                  key={connector.id}
                  className="cursor-pointer px-4 py-2 tablet:px-10 tablet:py-4 desktop:px-10 desktop:py-4 border border-gray-200 rounded-[20px]
                      flex items-center gap-5 transition-all hover:bg-gray-100 hover:border-transparent"
                  onClick={() => handleConnect(connector)}
                >
                  {connector.ready ? (
                    <Icon name={connector.id} width={40} height={40} />
                  ) : (
                    <MySpinner />
                  )}
                  <Text>{connector.name}</Text>
                </div>
              );
            })}
          </div>
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
