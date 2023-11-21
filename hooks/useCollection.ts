import { useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { useCallback } from 'react'
import { APIParams } from '@/services/api/types'
import MarketplaceAPI from '@/services/api/marketplace'
import { AssetType } from '@/types'

export const useCreateCollection = () => {
  const { writeAsync: write721 } = useContractWrite({
    ...contracts.erc721Factory,
    functionName: 'createToken'
  })
  const { writeAsync: write1155 } = useContractWrite({
    ...contracts.erc1155Factory,
    functionName: 'createToken'
  })

  const onCreateCollection = (type: AssetType, args: any[]) => {
    if (type === 'ERC721') {
      return write721({ args })
    }
    return write1155({ args })
  }

  return { onCreateCollection }
}

export const useUpdateCollection = () => {
  const { credentials } = useAuthStore()
  const bearerToken = credentials?.accessToken

  const onUpdateCollection = useCallback((params: APIParams.UpdateCollection) => {
    if (!bearerToken) return
    return MarketplaceAPI.updateCollection({
      ...params,
      config: { headers: { 'Authorization': `Bearer ${bearerToken}` } }
    })
  }, [bearerToken])

  return { onUpdateCollection }
}
