"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import SignConnectMessageModal from "@/components/Modal/SignConnectMessageModal";
import SignupModal from "@/components/Modal/SignupModal";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const router = useRouter();
  const [showSignMessage, setShowSignMessage] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      {/* <main className="flex">
        <div className="flex flex-1 items-center justify-center">
          <div className="px-20 py-40">
            <Text className="text-heading-md text-primary font-semibold mb-5">
              Connect wallet
            </Text>
            <Text className="text-body-18 text-secondary mb-10">
              Choose a wallet you want to connect. There are several wallet
              providers.
            </Text>

            <div className="flex flex-col gap-5">
              {connectors.map((connector) => {
                return (
                  <div
                    key={connector.id}
                    className="cursor-pointer px-6 py-4 border border-gray-200 rounded-[20px]
                      flex items-center gap-5 transition-all hover:bg-gray-100 hover:border-none"
                    onClick={() => handleConnect(connector)}
                  >
                    <Icon name={connector.id} width={40} height={40} />
                    <Text>{connector.name}</Text>
                    {isLoading && pendingConnector?.id === connector.id && (
                      <MySpinner />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main> */}

      <SignConnectMessageModal
        onSignup={() => setShowSignup(true)}
        show={showSignMessage}
        onClose={() => setShowSignMessage(false)}
      />
      <SignupModal
        show={showSignup}
        onSignupSuccess={() => router.push("/")}
        onClose={() => setShowSignup(false)}
      />
    </>
  );
}
