import { useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { useCallback } from 'react'
import { APIParams } from '@/services/api/types'
import { AssetType } from '@/types'
import { Id } from 'react-toastify'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'

export const useCreateCollection = () => {
  const { writeAsync: write721 } = useContractWrite({
    ...contracts.erc721Factory,
    functionName: 'createToken'
  })
  const { writeAsync: write1155 } = useContractWrite({
    ...contracts.erc1155Factory,
    functionName: 'createToken'
  })

  const onCreateCollection = async (type: AssetType, args: any[], toastId?: Id) => {
    const { hash } = await (type === 'ERC721' ? write721({ args }) : write1155({ args }))
    if (type === 'ERC721') {
      return write721({ args })
    }
    return write1155({ args })
  }

  return { onCreateCollection }
}

export const useUpdateCollection = () => {
  const api = useMarketplaceApi()
  const { credentials } = useAuthStore()
  const bearerToken = credentials?.accessToken

  const onUpdateCollection = useCallback((params: APIParams.UpdateCollection) => {
    if (!bearerToken) return
    return api.updateCollection(params)
  }, [bearerToken])

  return { onUpdateCollection }
}
