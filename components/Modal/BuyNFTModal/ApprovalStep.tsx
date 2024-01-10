import Text from '@/components/Text'
import { Spinner } from 'flowbite-react'
import { useMarketTokenApproval, useNFTMarketStatus } from '@/hooks/useMarket'
import { useEffect, useMemo } from 'react'
import { Address } from 'wagmi'
import Button from '@/components/Button'
import { NFT } from '@/types'
import { APIResponse } from '@/services/api/types'
import NFTMarketData = APIResponse.NFTMarketData

interface Props {
  onNext: () => void
  onError: (error: Error) => void
  nft: NFT
  marketData: NFTMarketData
}

export default function ApprovalStep({ nft, onNext, onError, marketData }: Props) {
  const { saleData } = useNFTMarketStatus(nft.collection.type, marketData)

  const {
    isTokenApproved,
    isFetchingApproval,
    onApproveToken,
    isLoading,
    isSuccess,
    error,
    writeError
  } = useMarketTokenApproval(saleData?.quoteToken as Address, nft.collection.type)

  const handleApproveMarketToken = async () => {
    try {
      await onApproveToken()
    } catch (e) {
      console.error(e)
    }
  }

  const renderContent = useMemo(() => {
    switch (true) {
      case !isFetchingApproval && !isTokenApproved:
        return (
          <>
            <Text className="text-secondary text-center" variant="body-18">
              {
                isLoading ? 'Contract not approved. Please approve before proceeding!' : 'Approving token contract'
              }
            </Text>
            <Button loading={isLoading} className="w-full" onClick={handleApproveMarketToken}>Approve</Button>
          </>
        )
      case isTokenApproved:
        return (
          <>
            <Text className="text-secondary text-center" variant="body-18">
              Token approved. Proceeding ...
            </Text>
            <Spinner size="xl" />
          </>
        )
      default:
        return (
          <>
            <Text className="text-secondary text-center" variant="body-18">
              Verifying token approval ...
            </Text>
            <Spinner size="xl" />
          </>
        )
    }
  }, [isLoading, isTokenApproved])

  useEffect(() => {
    if (isTokenApproved || isSuccess) onNext()
  }, [isTokenApproved, isSuccess]);

  useEffect(() => {
    if (error) onError(error)
  }, [error]);

  useEffect(() => {
    if (writeError) onError(writeError)
  }, [writeError]);

  return (
    <>
      <Text className="font-semibold text-primary text-center" variant="heading-xs">
        Approve Token contract
      </Text>
      {renderContent}
    </>
  )
}