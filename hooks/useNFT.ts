import { Address, useAccount, useContractRead, useContractWrite } from 'wagmi'
import { contracts } from '@/config/contracts'
import useAuthStore from '@/store/auth/store'
import { AssetType } from '@/types'
import { Id, toast } from 'react-toastify'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { APIParams } from '@/services/api/types'
import { useCallback, useState } from 'react'
import { sleep } from '@/utils'

export const useCreateNFT = (collection: Address | undefined) => {
  const api = useMarketplaceApi()
  const { address } = useAccount()
  const userId = useAuthStore(state => state.profile?.id)
  const [getApproved, setGetApproved] = useState(false)

  const { data: isApproved, isFetching, status } = useContractRead({
    address: collection,
    abi: contracts.erc721.abi,
    functionName: 'isApprovedForAll',
    args: [address, contracts.erc721Proxy.address],
    enabled: !!collection && getApproved,
  })

  const { writeAsync: onApproveTransfer } = useContractWrite({
    address: collection,
    abi: contracts.erc721.abi,
    functionName: 'setApprovalForAll',
  })

  const { writeAsync: write721 } = useContractWrite({
    ...contracts.erc721Proxy,
    functionName: 'mintAndTransfer'
  })
  const { writeAsync: write1155 } = useContractWrite({
    ...contracts.erc1155Proxy,
    functionName: 'mintAndTransfer'
  })

  const onCreateNFT = useCallback(async (type: AssetType, params: Record<string, any>, toastId?: Id) => {
    setGetApproved(true)

    if (!isApproved) {
      toast.update('Approving for transfer')
      await onApproveTransfer({ args: [contracts.erc721Proxy.address, true] })
      while (!isApproved) {
        await sleep(1000)
      }
      console.log('DONE')
    }


    // if (!userId || !collection) return
    //
    // if (toastId) toast.update(toastId, { render: 'Uploading Image', type: 'info' })
    // const { fileHashes } = await api.uploadFile(params.image)
    //
    // if (toastId) toast.update(toastId, { render: 'Generating config', type: 'info' })
    // const tokenId = await api.generateTokenId(collection)
    //
    // if (toastId) toast.update(toastId, { render: 'Sending Transaction', type: 'info' })
    // const tokenURI = "ipfs://" + fileHashes[0]
    // const args = [
    //   {
    //     tokenId,
    //     tokenURI,
    //     supply: 1,
    //     creators: [{ account: address, value: 10000 }],
    //     royalties: [],
    //     signatures: ["0x"]
    //   },
    //   address,
    //   type === 'ERC1155' && params.amount
    // ].filter(Boolean)
    // console.log(args)
    //
    // const { hash } = await (type === 'ERC721' ? write721({ args }) : write1155({ args }))
    //
    // const createNFTParams = {
    //   id: tokenId,
    //   name: params.name,
    //   ipfsHash: tokenId,
    //   tokenUri: tokenURI,
    //   collectionId: collection,
    //   txCreationHash: hash,
    //   creatorId: userId,
    //   traits: []
    // } as APIParams.CreateNFT
    // const res = await api.createNFT(createNFTParams)
    // if (toastId) toast.update(toastId, { render: 'Item created successfully', type: 'success', isLoading: false })
  }, [collection, address, isApproved])

  return { onCreateNFT }
}

