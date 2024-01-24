import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import {useAccount} from 'wagmi'
import {NFT} from '@/types'

interface Props {
  onSuccess: () => void
  onError: (error: Error) => void
  nft: NFT
}

export default function TransferStep({ onSuccess, onError, nft }: Props) {
  const { address } = useAccount()

  // useEffect(() => {
  //   if (error) onError(error)
  // }, [error])
  //
  // useEffect(() => {
  //   if (isSuccess) onSuccess()
  // }, [isSuccess])

  return (
    <form className="w-full flex flex-col gap-6">
      <div className="font-bold">
        <Text className="mb-3" variant="heading-xs">
          Transfer NFT
        </Text>
      </div>

      <div>
        <label className="text-body-14 text-secondary font-semibold mb-1">Receive address</label>
        <Input
          maxLength={18}
          size={18}
          readOnly
          appendIcon={nft.collection.type === 'ERC1155' &&
            <Text>
              Quantity: ???
            </Text>
          } />
      </div>
      {nft.collection.type === 'ERC1155' && (
        <>
          <div>
            <Text className="text-secondary font-semibold mb-1">Quantity</Text>
            <Input
              maxLength={3}
              size={3}
            />
          </div>
        </>
      )}

      {/*<FormValidationMessages errors={""} />*/}
      <Button type={'submit'} className="w-full" >
        Transfer item
      </Button>
    </form>
  )
}