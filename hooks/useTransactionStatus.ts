import { useWaitForTransactionReceipt } from "wagmi";
import { useState } from "react";

export const useTransactionStatus = () => {
  const [txHash, setTxHash] = useState<`0x${string}`>();
  const data = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: !!txHash,
    },
  });

  return {
    updateHash: setTxHash,
    txStatus: data,
  };
};
