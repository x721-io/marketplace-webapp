import { Address, useAccount } from "wagmi";
import { disconnect } from '@wagmi/core'
import { sleep } from '@/utils'
import useAuthStore, { clearProfile } from '@/store/auth/store'
import { useCallback, useMemo } from 'react'
import { APIParams } from '@/services/api/types'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'

export const useAuth = () => {
  const api = useMarketplaceApi()
  const { address } = useAccount()
  const { setCredentials, setProfile, credentials } = useAuthStore()
  const bearerToken = credentials?.accessToken

  const isLoggedIn = useMemo(() => !!bearerToken && credentials.accessTokenExpire > new Date().getTime(), [bearerToken, credentials])

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
    const profile = await api.updateProfile(params)
    setProfile(profile)
  }, [bearerToken, address])

  const onVerifyAccount = useCallback(async () => {
    if (!bearerToken) return
     const verify = await api.verifyAccount()
     return verify
  }, [bearerToken, address])

  const onResendEmail = useCallback(async (params: APIParams.ResendVerifyMail) => {
    if (!bearerToken) return

    console.log('params email', params)
    const email = await api.resendEmail(params)
    // setProfile(profile)
    
  }, [bearerToken, address])


  const onLogout = async () => {
    await disconnect()
    clearProfile()
  }

  return {
    isLoggedIn,
    onAuth,
    onUpdateProfile,
    bearerToken,
    onLogout,
    onResendEmail, 
    onVerifyAccount
  }
}