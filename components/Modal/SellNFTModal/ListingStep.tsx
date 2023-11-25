import { APIResponse } from "@/services/api/types";
import Text from "@/components/Text";
import Input from "@/components/Form/Input";
import { useEffect, useState } from "react";
import { useSellNFT } from "@/hooks/useMarket";
import Button from "@/components/Button";

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: APIResponse.NFT
}

export default function ListingStep({ nft, onSuccess, onError }: Props) {
  const { onSellNFT, isLoading, isError, error, isSuccess } = useSellNFT(nft)
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  const handleSellNFT = async () => {
    onSellNFT(price, '0x3d3350A01Ad2a9AEef5A1E3e63840B6892Ba28c0', quantity)
  }

  useEffect(() => {
    if (error) {
      onError(error)
    }
  }, [error])

  useEffect(() => {
    if (isSuccess) {
      onSuccess()
    }
  }, [isSuccess])

  return (
    <div className="w-full flex flex-col gap-6">
      <Text className="text-center" variant="heading-sm">
        Create Sell Order
      </Text>
      <div>
        <Text className="text-secondary font-semibold mb-1">Price</Text>
        <Input
          value={price}
          onChange={event => setPrice(event.target.value)}
          type="number" />
      </div>

      {
        nft.collection.type === 'ERC1155' && (
          <div>
            <Text className="text-secondary font-semibold mb-1">Quantity</Text>
            <Input
              value={quantity}
              onChange={event => setQuantity(event.target.value)}
              type="number" />
          </div>
        )
      }

      <Button className="w-full" loading={isLoading} onClick={handleSellNFT}>
        Put on sale
      </Button>
    </div>
  )
}