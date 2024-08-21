import { RpcError } from "viem";

export const getTransactionErrorMsg = (err: RpcError) => {
  return new Error(err.shortMessage);
};
