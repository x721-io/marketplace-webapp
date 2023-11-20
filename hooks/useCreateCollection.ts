import { useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { useCallback } from 'react'
import { APIParams } from '@/services/api/types'
import MarketplaceAPI from '@/services/api/marketplace'

export const useErc721Factory = () => {
  const { isLoading, isSuccess, error, writeAsync } = useContractWrite({
    ...contracts.erc721Factory,
    functionName: 'createToken'
  })

  return { isLoading, isSuccess, error, writeAsync }
}

export const useErc1155Factory = () => {
  const { isLoading, isSuccess, error, writeAsync } = useContractWrite({
    ...contracts.erc721Factory,
    functionName: 'createToken'
  })

  return { isLoading, isSuccess, error, writeAsync }
}

export const useUpdateCollection = () => {
  const { credentials } = useAuthStore()
  const bearerToken = credentials?.accessToken

  const onUpdateCollection = useCallback((params: APIParams.UpdateCollection) => {
    if (!bearerToken) return
    console.log(params)
    return MarketplaceAPI.updateCollection({
      ...params,
      config: { headers: { 'Authorization': `Bearer ${bearerToken}` } }
    })
  }, [bearerToken])

  return { onUpdateCollection }
}
