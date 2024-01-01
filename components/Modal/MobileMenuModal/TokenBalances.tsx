import Icon from '@/components/Icon'
import {tokenOptions, tokens} from "@/config/tokens";
import {useAccount, useBalance} from "wagmi";

export default function TokenBalances() {
  const {address} = useAccount()
  const {data: balance} = useBalance({address})
  console.log(balance)


  return (
     <div className="flex flex-col h-full justify-between">
       {/*<div className="border rounded-2xl p-2">*/}
       {/*  {Object.values(tokens).map(token => (*/}
       {/*     <div className="flex gap-2 items-center p-2" key={token.address}>*/}
       {/*       <Icon name={token.logo} width={24} height={24} />*/}
       {/*       <span>{token.symbol}</span>*/}
       {/*       {balance.formatted}*/}
       {/*     </div>*/}
       {/*  ))}*/}
       {/*</div>*/}
     </div>
  )
}