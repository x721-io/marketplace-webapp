import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";

export const useGetBalance = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  const isBalance = useMemo(() => {
    return !!(balance && balance?.value > 0);
  }, [balance]);

  return {
    balance,
    isBalance,
  };
};
