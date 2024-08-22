import { RpcError } from "viem";

export const getTransactionErrorMsg = (
  err: {
    cause: { code: number };
  } & RpcError
) => {
  switch (err.cause.code) {
    case 4001:
      return "User rejected the transaction";
    default:
      return err.shortMessage;
  }
};
