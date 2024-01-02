import Text from '@/components/Text'
import Icon from '@/components/Icon'
import Image from 'next/image'
import defaultAvatar from '@/assets/images/default-avatar.png'
import Link from 'next/link'
import useAuthStore from '@/store/auth/store'
import {useAuth} from '@/hooks/useAuth'
import {truncate} from "@/utils/string";
import {useAccount} from "wagmi";
import {useState} from "react";
import TokenBalances from "@/components/Modal/MobileMenuModal/TokenBalances";

interface Props {
  onClose?: () => void
  balance: string
}

export default function MobileMenuAccountInformation({onClose}: Props) {

  const userId = useAuthStore(state => state.profile?.id)
  const username = useAuthStore(state => state.profile?.username)
  const {onLogout} = useAuth()
  const {address, connector} = useAccount()
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(address || "")
       .then(() => {
         console.log('Address copied to clipboard');
         setIsCopied(true)
         setTimeout(() => {
           setIsCopied(false);
         }, 1500);
       })
       .catch((err) => {
         console.error('Unable to copy address to clipboard', err);
       });
  };

  return (
     <div className=" flex flex-col h-full justify-between">
       <div className="w-full flex flex-col gap-4 ">
         <div className="flex items-center gap-4">
           <div className="flex gap-3 items-center">
             <Image
                src={defaultAvatar}
                alt="Avatar"
                width={48}
                height={48}
             />
             <Link href={`/user/${userId}`} className="flex flex-col " onClick={onClose}>
               <Text className="text-primary font-semibold" variant="body-18">{username}</Text>
               <Text className="text-secondary">View profile</Text>
             </Link>
           </div>
         </div>

         <Link className="text-secondary hover:text-primary" href={"/explore/items"} onClick={onClose}>
           Explore
         </Link>
         <Link className="text-secondary hover:text-primary" href={"/create/collection"} onClick={onClose}>
           Create Collection
         </Link>
         <Link className="text-secondary hover:text-primary" href={"/create/nft"} onClick={onClose}>
           Create NFT
         </Link>
         <div className="border-b"/>
         <Link className="text-secondary hover:text-primary" href={"/profile"} onClick={onClose}>
           Settings
         </Link>
       </div>
       <div className=" flex flex-col gap-4">
         <div className="flex items-center justify-between px-3">
           <Text className="text-secondary font-semibold" variant="body-18">
             Connected Wallet
           </Text>
           <Text className="text-secondary font-semibold hidden" variant="body-18">
             Manage Wallet
           </Text>
         </div>
         <div className=" flex flex-col gap-3 border rounded-xl p-4">
           <div className="flex justify-between">
             <div className=" flex items-center gap-2">
               <div className="rounded-lg p-1  text-secondary">
                 <Icon name={connector ? connector.name : ''} width={33} height={33}/>
               </div>
               <div className="">
                 <Text>
                   U2U
                 </Text>
                 <Text>
                   {truncate({
                     str: address || ""
                   })}
                 </Text>
               </div>
             </div>
             <div className=" flex items-center gap-3">
               <button className="rounded-xl p-3 hover:bg-surface-medium bg-surface-soft text-secondary"
                       onClick={handleCopyClick}>
                 <Icon name="copy" width={15} height={15}/>
               </button>
               <button className="rounded-xl p-3 bg-surface-soft text-secondary" onClick={() => {
                 onLogout()
                 onClose?.()
               }}>
                 <Icon name="logout" width={15} height={15}/>
               </button>
               {isCopied ? <span className="absolute pt-16 ">Copied!</span> : ""}
             </div>
           </div>
           <TokenBalances/>
         </div>
       </div>
     </div>

  )
}