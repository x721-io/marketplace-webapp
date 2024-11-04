import Text from "@/components/Text";
import Button from "@/components/Button";
import { useAccount, useSignMessage } from "wagmi";
import { SIGN_MESSAGE } from "@/config/constants";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useAuthStore from "@/store/auth/store";
import { signMessage } from "@wagmi/core";
import { Tooltip } from "react-tooltip";
import MySpinner from "../X721UIKits/Spinner";
import { MyModal, MyModalProps } from "../X721UIKits/Modal";
import "react-tooltip/dist/react-tooltip.css";
import { useGetProfileMutate } from "@/hooks/useMutate";
import { config } from "@/config/wagmi";

interface Props extends MyModalProps {
  onConnectSuccess?: (accessToken?: string) => void;
  onSignup: () => void;
}

export default function SignConnectMessageModal({
  show,
  onConnectSuccess,
  onClose,
  onSignup,
}: Props) {
  const { address } = useAccount();
  const { isError, signMessageAsync, error, isPending } = useSignMessage();
  const { setProfile } = useAuthStore();
  const { onAuth } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");
  const { trigger: getProfileMutate } = useGetProfileMutate();

  const handleSignMessage = useCallback(async () => {
    setAuthError("");

    if (!address) return;
    const date = new Date().toISOString();

    try {
      setIsAuthenticating(true);

      // @ts-ignore
      const signature = window.ReactNativeWebView
        ? await (window as any).ethereum.request({
            method: "personal_sign",
            params: [SIGN_MESSAGE.CONNECT(date), address],
          })
        : await signMessage(config, { message: SIGN_MESSAGE.CONNECT(date) });

      const credentials = await onAuth(date, signature);
      const profile = await getProfileMutate({ address });

      if (!profile?.acceptedTerms) {
        // Not registered
        onSignup();
      } else {
        setProfile(profile);
        onConnectSuccess?.(credentials?.accessToken);
        onClose?.();
      }
    } catch (e: any) {
      setAuthError(e.message);
      setIsAuthenticating(false);
      console.error("Error signing connect message:", e);
    } finally {
      setIsAuthenticating(false);
      onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const renderContent = () => {
    switch (true) {
      case isAuthenticating:
        return (
          <>
            <Text className="font-semibold text-primary text-center text-heading-sm">
              Authenticating...
            </Text>
            <Text className="text-secondary text-center" variant="body-18">
              Connecting your wallet to U2U NFT Market
            </Text>
            <MySpinner />
          </>
        );
      case isError || !!authError:
        return (
          <>
            <Text className="font-semibold text-error text-center text-heading-sm">
              Error report
            </Text>
            <a
              data-tooltip-id="error-report-msg"
              data-tooltip-content={error?.message || authError}
            >
              <Text
                className="max-w-full text-secondary text-center text-ellipsis"
                variant="body-18"
              >
                {error?.message || authError}
              </Text>
              <Tooltip id="error-report-msg" />
            </a>

            <div>
              <Button
                className="w-full mb-5"
                variant="primary"
                onClick={handleSignMessage}
              >
                Try again
              </Button>
              <Button className="w-full" variant="secondary" onClick={onClose}>
                Close and Continue
              </Button>
            </div>
          </>
        );
      // case isLoading:
      // default:
      //   return (
      //     <>
      //       <Text className="font-semibold text-primary text-center text-heading-sm">
      //         Loading...
      //       </Text>
      //       <Text className="text-secondary text-center" variant="body-18">
      //         Sign the message in your wallet MetaMask to sign in safely
      //       </Text>
      //       <MySpinner />
      //       <Button className="w-full" variant="secondary" onClick={onClose}>
      //         Cancel
      //       </Button>
      //     </>
      //   );
    }
  };

  useEffect(() => {
    if (show) {
      handleSignMessage();
    } else {
      setAuthError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <MyModal.Root show={show} onClose={onClose}>
      <MyModal.Body>
        <div className="mx-auto flex flex-col gap-8 p-8 items-center overflow-ellipsis">
          {renderContent()}
        </div>
      </MyModal.Body>
    </MyModal.Root>
  );
}
