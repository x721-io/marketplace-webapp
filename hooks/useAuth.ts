import { Address, useAccount, useDisconnect } from "wagmi";
import { sleep } from '@/utils'
import useAuthStore, { clearProfile } from '@/store/auth/store'
import { useCallback } from 'react'
import { APIParams } from '@/services/api/types'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'

export const useAuth = () => {
  const api = useMarketplaceApi()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { setCredentials, setProfile, credentials } = useAuthStore()
  const bearerToken = credentials?.accessToken

  const onAuth = useCallback(async (date: string, message: Address) => {
    if (!address) return

    const credentials = await api.connect({
      date,
      publicKey: address,
      signature: message,
      signer: address.toLocaleLowerCase()
    })
    setCredentials(credentials)

    await sleep(1000)
  }, [address])

  const onUpdateProfile = useCallback(async (params: APIParams.UpdateProfile) => {
    if (!bearerToken) return

    await api.updateProfile(params)

    if (address) {
      const profile = await api.viewProfile(address)
      setProfile(profile)
    }
  }, [bearerToken, address])

  const onLogout = () => {
    disconnect()
    clearProfile()
  }

  return {
    onAuth,
    onUpdateProfile,
    bearerToken,
    onLogout
  }
}