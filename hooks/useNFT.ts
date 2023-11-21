import { Address, useAccount, useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { AssetType } from '@/types'
import { Id, toast } from 'react-toastify'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { APIParams } from '@/services/api/types'

export const useCreateNFT = () => {
  const api = useMarketplaceApi()
  const { address } = useAccount()
  const userId = useAuthStore(state => state.profile?.id)

  const { writeAsync: write721 } = useContractWrite({
    ...contracts.erc721,
    functionName: 'mintAndTransfer'
  })
  const { writeAsync: write1155 } = useContractWrite({
    ...contracts.erc1155,
    functionName: 'mintAndTransfer'
  })

  const onCreateNFT = async (type: AssetType, collection: Address, params: Record<string, any>, toastId?: Id) => {
    if (!userId) return

    if (toastId) toast.update(toastId, { render: 'Uploading Image', type: 'info' })
    const { fileHashes } = await api.uploadFile(params.image)

    if (toastId) toast.update(toastId, { render: 'Generating config', type: 'info' })
    const { tokenId } = await api.generateTokenId(collection)

    if (toastId) toast.update(toastId, { render: 'Sending Transaction', type: 'info' })
    const tokenURI = "ipfs://" + fileHashes[0]
    const args = [
      {
        tokenId,
        tokenURI,
        creators: [{ account: address, value: 10000 }],
        royalties: [],
        signatures: ["0x"]
      },
      address,
      type === 'ERC1155' && params.amount
    ].filter(Boolean)

    const { hash } = await (type === 'ERC721' ? write721({ args }) : write1155({ args }))

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
  }

  return { onCreateNFT }
}

