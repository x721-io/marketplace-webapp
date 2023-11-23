import { Address, useAccount, useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { AssetType } from '@/types'
import { Id, toast } from 'react-toastify'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { APIParams } from '@/services/api/types'
import { useCallback } from 'react'

export const useCreateNFT = (collection: Address, type: AssetType) => {
  const api = useMarketplaceApi()
  const { address } = useAccount()
  const userId = useAuthStore(state => state.profile?.id)

  const proxyContract = type === 'ERC721' ? contracts.erc721Proxy : contracts.erc1155Proxy
  const { writeAsync } = useContractWrite({
    address: collection,
    abi: proxyContract.abi,
    functionName: 'mintAndTransfer'
  })

  const onCreateNFT = useCallback(async (type: AssetType, params: Record<string, any>, toastId?: Id) => {
    if (!userId || !collection) return

    if (toastId) toast.update(toastId, { render: 'Uploading Image', type: 'info' })
    const { fileHashes } = await api.uploadFile(params.image)

    if (toastId) toast.update(toastId, { render: 'Generating config', type: 'info' })
    const tokenId = await api.generateTokenId(collection)

    if (toastId) toast.update(toastId, { render: 'Sending Transaction', type: 'info' })
    const tokenURI = "ipfs://" + fileHashes[0]
    const args = [
      {
        tokenId,
        tokenURI,
        supply: 1,
        creators: [{ account: address, value: 10000 }],
        royalties: [],
        signatures: ["0x"]
      },
      address,
      type === 'ERC1155' && params.amount
    ].filter(Boolean)

    const { hash } = await writeAsync({ args })

    const createNFTParams = {
      id: tokenId,
      name: params.name,
      ipfsHash: tokenId,
      tokenUri: tokenURI,
      collectionId: collection,
      txCreationHash: hash,
      creatorId: userId,
      traits: []
    } as APIParams.CreateNFT
    const res = await api.createNFT(createNFTParams)

    if (toastId) toast.update(toastId, { render: 'Item created successfully', type: 'success', isLoading: false })
  }, [collection, address])

  return { onCreateNFT }
}

