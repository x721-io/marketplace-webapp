import { useAccount } from 'wagmi'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { AssetType } from '@/types'
import { writeContract, waitForTransaction } from '@wagmi/core'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { APIParams } from '@/services/api/types'
import { parseImageUrl } from '@/utils/nft'

export const useCreateNFT = (type: AssetType) => {
  const api = useMarketplaceApi()
  const { address } = useAccount()
  const userId = useAuthStore(state => state.profile?.id)

  const proxyContract = type === 'ERC721' ? contracts.erc721Proxy : contracts.erc1155Proxy

  const onCreateNFT = async (params: Record<string, any>) => {
    if (!userId || !type) return

    const tokenId = await api.generateTokenId(params.collection)

    const metadata = {
      id: tokenId,
      name: params.name,
      description: params.description,
      collectionAddress: params.collection,
      image: parseImageUrl(params.image),
      creatorId: userId,
      attributes: params.traits,
      royalties: [{ account: address, value: params.royalties }]
    }

    const { metadataHash } = await api.uploadMetadata(metadata)

    const tokenURI = "ipfs://" + metadataHash

    const tokenArgs: Record<string, any> = type === 'ERC1155' ? {
      tokenId,
      tokenURI,
      supply: params.amount,
      creators: [{ account: address, value: 10000 }],
      royalties: [{ account: address, value: params.royalties }],
      signatures: ["0x"]
    } : {
      tokenId,
      tokenURI,
      creators: [{ account: address, value: 10000 }],
      royalties: [{ account: address, value: params.royalties }],
      signatures: ["0x"]
    }

    const args = [
      tokenArgs,
      address,
      type === 'ERC1155' && params.amount
    ].filter(Boolean)

    const tx = await writeContract({
      address: params.collection,
      abi: proxyContract.abi,
      functionName: 'mintAndTransfer',
      args
    })

    const createNFTParams = {
      id: tokenId,
      name: params.name,
      ipfsHash: metadataHash,
      tokenUri: tokenURI,
      collectionId: params.collection,
      txCreationHash: tx.hash,
      imageHash: params.image,
      creatorId: userId,
      traits: params.traits
    } as APIParams.CreateNFT

    await Promise.all([
      waitForTransaction({ hash: tx.hash }),
      api.createNFT(createNFTParams)
    ])
  }

  return { onCreateNFT }
}

