import { contracts } from '@/config/contracts'
import { writeContract } from '@wagmi/core'
import { APIParams } from '@/services/api/types'
import { AssetType } from '@/types'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'

export const useCreateCollection = () => {
  const onCreateCollection = async (type: AssetType, args: any[]) => {
    if (type === 'ERC721') {
      return writeContract({
        ...contracts.erc721Factory,
        functionName: 'createToken',
        args
      })
    }
    return writeContract({
      ...contracts.erc1155Factory,
      functionName: 'createToken',
      args
    })
  }

  return { onCreateCollection }
}

export const useUpdateCollection = () => {
  const api = useMarketplaceApi()

  const onUpdateCollection = (params: APIParams.UpdateCollection) => api.updateCollection(params)

  return { onUpdateCollection }
}
