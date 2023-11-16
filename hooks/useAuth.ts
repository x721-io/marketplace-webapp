import { useAccount } from "wagmi";
import MarketplaceAPI from '@/services/api/marketplace'
import { sleep } from '@/utils'
import useAuthStore from '@/store/auth/store'
import { useCallback } from 'react'
import { APIParams } from '@/services/api/types'

export const useAuth = () => {
  const { address, isConnected } = useAccount()
  const { setCredentials, setProfile, credentials } = useAuthStore()
  const bearerToken = credentials?.accessToken

  const onAuth = useCallback(async (date: string, message: `0x${string}`) => {
    if (!address) return

    const credentials = await MarketplaceAPI.connect({
      date,
      publicKey: address,
      signature: message,
      signer: address
    })
    setCredentials(credentials)

    await sleep(1000)
  }, [address])

  const onUpdateProfile = useCallback(async (params: APIParams.UpdateProfile) => {
    if (!bearerToken) return

    await MarketplaceAPI.updateProfile({
      ...params, config: { headers: { 'Authorization': `Bearer ${bearerToken}` } }
    })

    if (address) {
      const profile = await MarketplaceAPI.viewProfile(address)
      setProfile(profile)
    }
  }, [bearerToken, address])

  return {
    onAuth,
    onUpdateProfile,
    bearerToken
  }
}