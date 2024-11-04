import useAuthStore from "@/store/auth/store";
import { useEffect, useState } from "react";
import { GetBalanceReturnType, getBalance } from "@wagmi/core";
import { formatEther } from "ethers";
import { Address } from "abitype";
import { config } from "@/config/wagmi";

export const useBalance = (token: Address) => {
  const address = useAuthStore((state) => state.profile?.publicKey);
  const [tokenBalance, setTokenBalance] = useState<GetBalanceReturnType>();

  useEffect(() => {
    (async () => {
      if (!address) return;
      const balance = await getBalance(config, {
        address,
        token,
      });
      setTokenBalance(balance);
    })();
  }, [address, token]);

  return {
    balance: tokenBalance,
    displayedBalance: formatEther(tokenBalance?.value || 0),
  };
};
