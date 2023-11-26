import Text from '@/components/Text'
import { Spinner } from 'flowbite-react'
import { useMarketTokenApproval, useNFTMarketStatus } from '@/hooks/useMarket'
import { APIResponse } from '@/services/api/types'
import { useEffect, useMemo } from 'react'
import { Address } from 'wagmi'
import Button from '@/components/Button'

interface Props {
  onNext: () => void
  onError: (error: Error) => void
  nft: APIResponse.NFT
}

export default function ApprovalStep({ nft, onNext, onError }: Props) {
  const { quoteToken } = useNFTMarketStatus(nft)
  const { isTokenApproved, isFetchingApproval, onApproveToken, isLoading, isSuccess, error, writeError } = useMarketTokenApproval(quoteToken as Address, nft.collection.type)

  const handleApproveMarketToken = async () => {
    try {
      await onApproveToken()
    } catch (e) {

    }
  }

  const renderContent = useMemo(() => {
    switch (true) {
      case !isFetchingApproval && !isTokenApproved:
        return (
          <>
            <Text className="text-secondary text-center" variant="body-18">
              Contract not approved. Please approve before proceed ...
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