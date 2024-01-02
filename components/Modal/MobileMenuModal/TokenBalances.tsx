import {tokens} from "@/config/tokens";
import {useAccount, useBalance} from "wagmi";
import Image from "next/image";

export default function TokenBalances() {
  const {address} = useAccount()
  const {data: tokenBalance} = useBalance({
    address,
    token: tokens.wu2u.address,
    formatUnits: 'ether',
    watch: true
  })
  return (
     <div className="flex flex-col h-full justify-between">
       <div className="border rounded-xl p-2">
         <div className="flex gap-2 items-center p-1">
           <Image src={tokens.wu2u.logo} alt="" width={24} height={24} className="w-6 h-6 rounded-full"/>
           {tokenBalance?.formatted || '0'}
           <span>{tokens.wu2u.symbol}</span>
         </div>
       </div>
     </div>
  )
}