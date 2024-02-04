import { Address } from "wagmi";
import { tokens } from "@/config/tokens";

export const findTokenByAddress = (address?: Address) => {
  if (address?.toLowerCase() === tokens.wu2u.address.toLowerCase()) {
    // Case này a viết để hiển thị cho activities. Nếu sử dụng  token ƯU2U thì ở activities sẽ display là U2U chứ không phải WU2U vì nó sử dụng hàm usingEth
    return {
      ...tokens.wu2u,
      name: "Unicorn Ultra Token",
      symbol: "U2U",
    };
  }

  // Cái này không cần thiết. Vì ở dưới nó có hàm find rồi, nên không cần update gì ở đây nữa
  // else if (address?.toLowerCase() === tokens.usdt.address.toLowerCase()) {
  //   return {
  //     ...tokens.usdt,
  //     name: "USDT",
  //     symbol: "USDT",
  //   };
  // }
  return Object.values(tokens).find((token) => {
    return token.address.toLowerCase() === address?.toLowerCase();
  });
};
