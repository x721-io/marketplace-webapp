import Button, { ButtonProps } from '@/components/Button'
import ConnectWalletButton from '@/components/Button/ConnectWalletButton'
import { Address } from 'wagmi'
import { useCreateNFT } from '@/hooks/useNFT'
import { useFormContext } from 'react-hook-form'
import { CreateNFTForm } from '@/types/form'

interface Props extends ButtonProps{
  collection: Address,
}

export default function CreateNFTButton({ collection }:Props) {
  const { onCreateNFT } = useCreateNFT(collection)
  const { handleSubmit } = useFormContext<CreateNFTForm>()
  const onSubmit = (data: CreateNFTForm) => {
    console.log(data)
  }

  return (
    <ConnectWalletButton>
      <Button
        onClick={() => handleSubmit(onSubmit)}
        className="w-full tablet:w-auto desktop:w-auto">
        Create Item
      </Button>
    </ConnectWalletButton>
  )
}