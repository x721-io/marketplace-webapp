import { Connector, useAccount, useConnect, useSignMessage } from "wagmi";
import { useCallback } from "react";
import { SIGN_MESSAGE } from '@/config/constants'
import API from '@/services/api/auth'

export const useAuth = () => {
  const { connector: activeConnector, isConnected } = useAccount()
  const { connect } = useConnect()
  const { data, isError, isLoading: isSigning, isSuccess, signMessage } = useSignMessage({
    message: SIGN_MESSAGE.LOGIN(new Date().toISOString())
  })

  const onConnect = useCallback(async (connector: Connector) => {
    if (isConnected) return
    connect({ connector })

    const date = new Date().toISOString()

    const res = await API.connect({
      proxy: true,
      date,
      publicKey: "publicKey",
      signature: "signature",
      signer: "signer"
    })

    console.log(res)
  }, [isConnected, connect])

  return {
    onConnect
  }
}