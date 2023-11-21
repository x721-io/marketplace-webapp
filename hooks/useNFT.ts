import { useAccount, useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import MarketplaceAPI from '@/services/api/marketplace'
import { AssetType } from '@/types'
import { Id, toast } from 'react-toastify'

export const useCreateNFT = () => {
  const { address } = useAccount()
  const userId = useAuthStore(state => state.profile?.id)
  const bearerToken = useAuthStore(state => state.credentials?.accessToken)
  const { writeAsync: write721 } = useContractWrite({
    ...contracts.erc721,
    functionName: 'mintAndTransfer'
  })
  const { writeAsync: write1155 } = useContractWrite({
    ...contracts.erc1155,
    functionName: 'mintAndTransfer'
  })

  const generateTokenId = (collectionAddress: string) => MarketplaceAPI.generateTokenId({
    collectionAddress,
    config: { headers: { 'Authorization': `Bearer ${bearerToken}` } }
  })

  const onCreateNFT = async (type: AssetType, collection: string, params: Record<string, any>, toastId?: Id) => {
    if (!userId) return

    if (toastId) toast.update(toastId, { render: 'Uploading Image', type: 'info' })
    const { fileHashes } = await MarketplaceAPI.uploadFile(params.image)

    if (toastId) toast.update(toastId, { render: 'Generating config', type: 'info' })
    const { tokenId } = await generateTokenId(collection)

    if (toastId) toast.update(toastId, { render: 'Sending Transaction', type: 'info' })
    const tokenURI = "ipfs:/"
    const args = [
      {
        tokenId,
        tokenURI,
        creators: [{ account: address, value: 10000 }],
        royalties: [],
        signatures: ["0x"]
      },
      address
    ]
    const { hash } = await (type === 'ERC721' ? write721({ args }) : write1155({ args }))

    const createNFTParams = {
      id: tokenId,
      name: params.name,
      ipfsHash: tokenId,
      tokenUri: tokenURI,
      collectionId: collection,
      txCreationHash: hash,
      creatorId: userId
      // traits: []
    }
    const res = await MarketplaceAPI.createNFT({
      ...createNFTParams,
      config: { headers: { 'Authorization': `Bearer ${bearerToken}` } }
    })
    if (toastId) toast.update(toastId, { render: 'Item created successfully', type: 'success', isLoading: false })
  }

  return { onCreateNFT }
}

