import { useAccount } from "wagmi";
import API from '@/services/api/auth'
import { sleep } from '@/utils'

export const useAuth = () => {
  const { address, isConnected } = useAccount()

  const onAuth = async (date: string, message: `0x${string}`) => {
    if (!address) return

    const res = await API.connect({
      proxy: true,
      date,
      publicKey: address,
      signature: message,
      signer: address.toLowerCase()
    })
    await sleep(1000)
  }

  return {
    onAuth
  }
}