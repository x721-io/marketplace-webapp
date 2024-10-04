import { Address } from "wagmi";
import { tokens } from "@/config/tokens";

export const findTokenByAddress = (address?: Address) => {
  const key = Object.keys(tokens).find(
    (key) => tokens[key].address === address
  );
  if (!key) return null;
  return tokens[key];
};
