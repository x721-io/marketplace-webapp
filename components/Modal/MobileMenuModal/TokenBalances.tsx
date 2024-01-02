import {tokens} from "@/config/tokens";
import {useAccount, useBalance} from "wagmi";
import Image from "next/image";
import {formatDisplayedBalance} from "@/utils";

export default function TokenBalances() {
  const {address} = useAccount()
  const {data: balance} = useBalance({address})

  return (
     <div className="flex flex-col h-full justify-between">
       <div className="border rounded-xl p-2">
         {Object.values(tokens).map(token => (
            <div className="flex gap-2 items-center p-1" key={token.address}>
              <Image src={token.logo} alt="" width={24} height={24} className="w-6 h-6 rounded-full"/>
              {formatDisplayedBalance(balance?.formatted || '', 2)}
              <span>{token.symbol}</span>
            </div>
         ))}
       </div>
     </div>
  )
}