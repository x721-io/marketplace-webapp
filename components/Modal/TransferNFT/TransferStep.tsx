import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'
import { APIResponse } from '@/services/api/types'
import NFTMarketData = APIResponse.NFTMarketData
import { FormState, NFT } from '@/types'
import useAuthStore from '@/store/auth/store'
import { useMemo } from 'react'
import { numberRegex } from '@/utils/regex'
import { useForm } from 'react-hook-form'
import FormValidationMessages from '@/components/Form/ValidationMessages'
import { toast } from 'react-toastify'
import { useAccount, erc721ABI, erc1155ABI} from 'wagmi';
import { writeContract } from '@wagmi/core'
interface Props {
  nft: NFT
  marketData?: NFTMarketData
  handleReset: () => void
}

export default function TransferStep({ nft, marketData, handleReset }: Props) {
  const type = nft.collection.type
  const wallet = useAuthStore(state => state.profile?.publicKey)
  const ownerData = useMemo(() => {
    if (!wallet || !marketData) return undefined
    return marketData.owners.find(owner => owner.publicKey.toLowerCase() === wallet.toLowerCase())
  }, [wallet, nft])
  const { register, handleSubmit, formState: { errors } } = useForm<FormState.TransferToken>()

  const { address } = useAccount();

  const formRules = {
    quantity: {
      pattern: { value: numberRegex, message: 'Wrong number format' },
      validate: {
        required: (v: number) => {
          if (type === 'ERC721') return true
          return (!!v && !isNaN(v) && v > 0) || 'Please input quantity of item to transfer'
        },
        amount: (v: number) => {
          if (type === 'ERC721') return true
          if (!ownerData) return 'Quantity exceeds owned amount'
          return v <= Number(ownerData.quantity) || 'Quantity exceeds owned amount'
        }
      }
    },
    address: {
      required: 'Address is not allowed to be empty'
    }
  }


const onSubmit = async ({ quantity, address }: FormState.TransferToken) => {
  try {
    if (type === 'ERC721') {
      await writeContract({
        address: nft.collection.address,
        abi: erc721ABI,
        functionName: 'safeTransferFrom',
        args: [wallet, address, (nft.u2uId ?? nft.id) as any], 
      });
    } else if (type === 'ERC1155') {
      await writeContract({
        address: nft.collection.address,
        abi: erc1155ABI,
        functionName: 'safeTransferFrom',
        args: [wallet, address,(nft.u2uId ?? nft.id) as any, quantity, '0x'], 
      });
    }

    toast.success('Transfer token successfully', { autoClose: 1000, closeButton: true });
  } catch (e) {
    toast.error(`Error report: ${e.message || e}`);
  } finally {
    handleReset();
  }
};


    return (
    <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className='flex gap-4 flex-col'>
        <Text className="font-semibold text-body-24">Transfer Token</Text>
        <Text className='text-body-16'>You can transfer tokens from your address to another</Text>
      </div>
      {nft.collection.type === 'ERC1155' && (
        <div className='flex gap-1 flex-col'>
          <Text className="text-secondary font-semibold">Quantity</Text>
          <Input
            error={!!errors.quantity}
            register={register('quantity', formRules.quantity)}
            appendIcon={nft.collection.type === 'ERC1155' &&
              <Text>
                Quantity: {ownerData?.quantity}
              </Text>
            }
          />
        </div>
      )}
      <div className='flex gap-1 flex-col'>
        <label className="text-body-14 text-secondary font-semibold mb-1">Receive address</label>
        <Input
          error={!!errors.address}
          register={register('address', formRules.address)}
        />
      </div>

      <FormValidationMessages errors={errors} />

      <div className='flex gap-2 flex-col'>
        <Button type={'submit'} className="w-full" >
          Continue
        </Button>
        <Button variant='outlined' className="w-full" onClick={handleReset}>
          Cancel
        </Button>
      </div>
    </form>
  )
}