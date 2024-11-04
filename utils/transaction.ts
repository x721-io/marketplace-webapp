import { getUserLocale } from "@/services/locale";
import { RpcError, UserRejectedRequestError } from "viem";

export const getWeb3ErrorMsg = async (
  err: {
    cause: { code: number };
  } & RpcError
) => {
  const locale = await getUserLocale();
  const messages = (await import(`../messages/${locale}.json`)).default;
  if (err.shortMessage.includes("rejected")) {
    return messages["web3"]["error"]["rejected"] as string;
  }
  return messages["web3"]["error"]["other"] as string;
};
