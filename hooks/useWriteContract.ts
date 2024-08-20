"use client";

import { getTransactionErrorMsg } from "@/utils/transaction";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { contracts } from "@/config/contracts";

type Key = keyof typeof contracts & {};
type Keys = (keyof typeof contracts)[] & {};
// const typedKeys = Object.keys(contracts) as Keys;
// const a = typedKeys
//   .map((key) => {
//     for (let i = 0; i < contracts[key].abi.length; i++) {
//       if (contracts[key].abi[i].type === 'function') {
//         return contracts[key].abi[i].inputs;
//       }
//     }
//   })

export default function useContract() {
  const write = async (
    contractName: Key,
    functionName: string,
    ...args: any
  ) => {
    try {
      const tx = await writeContract({
        address: contracts[contractName].address,
        abi: contracts[contractName] as any,
        functionName,
        args,
      });
      const response = await waitForTransaction(tx);
      return response;
    } catch (err: any) {
      throw getTransactionErrorMsg(err);
    }
  };

  return { write };
}
