'use client'

import Text from '@/components/Text'
import ImageUploader from '@/components/Form/ImageUploader'
import Input from '@/components/Form/Input'
import Textarea from '@/components/Form/Textarea'
import Button from '@/components/Button'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import NFTTypeSelection from '@/components/NFT/NFTTypeSelection'
import {
  useCreateCollection,
  useUpdateCollection
} from '@/hooks/useCollection'
import { randomWord } from '@rarible/types'
import useAuthStore from '@/store/auth/store'
import { BASE_API_URL } from '@/config/api'
import Icon from '@/components/Icon'
import { toast } from 'react-toastify'
import { AssetType } from '@/types'
import ConnectWalletButton from '@/components/Button/ConnectWalletButton'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import FormValidationMessages from '@/components/Form/ValidationMessages'
import { alphabetOnlyRegex } from '@/utils/regex'
import { parseImageUrl } from '@/utils/nft'
import { waitForTransaction } from '@wagmi/core'

interface CollectionFormState {
  image: string
  name: string,
  symbol: string,
  description: string,
  shortUrl: string
}

export default function CreateNFTCollectionPage() {
  const [validating, setValidating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const api = useMarketplaceApi()
  const creator = useAuthStore(state => state.profile?.id)
  const [type, setType] = useState<AssetType>()
  const { onCreateCollectionContract } = useCreateCollection()
  const { onCreateCollection } = useUpdateCollection()
  const {
    handleSubmit,
    register,
    reset,
    watch,
    setError,
    clearErrors,
    control,
    setValue,
    formState: { errors }
  } = useForm<CollectionFormState>({ reValidateMode: 'onChange' })

  const formRules = {
    name: {
      required: 'Collection name is required!'
    },
    symbol: {
      required: 'Symbol is required!',
      pattern: { value: alphabetOnlyRegex, message: 'Collection symbol should contain only alphabet characters' }
    },
    shortUrl: {
      pattern: { value: alphabetOnlyRegex, message: 'Short url should contain only alphabet characters' }
    },
    description: {
      maxLength: { value: 256, message: 'Description cannot exceed 256 characters' }
    },
    image: {
      required: 'Collection image is required!'
    }
  }

  const handleUploadImage = async (file?: Blob) => {
    if (!file) {
      setValue('image', '')
      return
    }
    setUploading(true)
    try {
      await toast.promise(api.uploadFile(file), {
        pending: 'Uploading image...',
        success: {
          render: (data) => {
            setValue('image', data.data?.fileHashes[0] as string)
            return 'Collection image uploaded successfully'
          }
        },
        error: {
          render: (error) => {
            setValue('image', '')
            return `Uploading error: ${(error.data as any).message}`
          }
        }
      })
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    reset()
    setType(undefined)
  }

  const onSubmit = async (data: CollectionFormState) => {
    if (!type || !creator) return
    const toastId = toast.loading('Preparing data...', { type: 'info' })

    try {
      const salt = randomWord()
      const { name, symbol, description, shortUrl, image } = data

      const metadata = { name, symbol, description, type, shortUrl, image }

      const { metadataHash } = await api.uploadMetadata(metadata)
      const fullShortUrl = BASE_API_URL + '/collection/' + shortUrl
      const args = [name, symbol, `ipfs://${metadataHash}`, fullShortUrl, [], salt]

      toast.update(toastId, { render: 'Sending transaction', type: 'info' })

      const tx = await onCreateCollectionContract(type, args)
      await Promise.all([
        waitForTransaction({ hash: tx.hash }),
        onCreateCollection({
          ...metadata,
          txCreationHash: tx.hash,
          creators: creator,
          metadata: JSON.stringify(metadata)
        })
      ])

      toast.update(toastId, {
        render: 'Collection created successfully',
        type: 'success',
        isLoading: false,
        autoClose: 5000
      })
      resetForm()
    } catch (e: any) {
      toast.update(toastId, {
        render: `Error creating collection: ${e.message ?? e}`,
        type: 'error',
        isLoading: false,
        autoClose: 5000
      })
      console.error(e)
    }
  }

  const handleValidateInput = async (name: string, value: Record<string, any>) => {
    try {
      setValidating(true)
      if (name === 'name' && !!value.name) {
        const existed = await api.validateInput({ key: 'collectionName', value: value.name })
        if (existed) setError('name', { type: 'custom', message: 'Collection name already existed' })
        else clearErrors('name')
      }

      if (name === 'symbol' && !!value.symbol) {
        const existed = await api.validateInput({ key: 'collectionSymbol', value: value.symbol })
        if (existed) setError('symbol', { type: 'custom', message: 'Collection symbol already existed' })
        else clearErrors('symbol')
      }

      if (name === 'shortUrl' && !!value.shortUrl) {
        const existed = await api.validateInput({ key: 'collectionShortUrl', value: value.shortUrl })
        if (existed) setError('shortUrl', { type: 'custom', message: 'Short url already existed' })
        else clearErrors('shortUrl')
      }
    } finally {
      setValidating(false)
    }
  }

  useEffect(() => {
    const subscription = watch(async (value, { name, type }) => {
      if (!name) return
      handleValidateInput(name, value)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  if (!type) {
    return (
      <NFTTypeSelection title="Choose collection type" onSelect={setType} />
    )
  }

  return (
    <div className="w-full flex justify-center py-10 tablet:py-20 desktop:py-20">
      <div className="flex flex-col tablet:w-[550px] w-full">

        <div className="flex items-center mb-6 tablet:mb-10 desktop:mb-10">
          <Button
            variant="text"
            onClick={resetForm}
            className="min-w-[60px] tablet:min-w-[120px] desktop:min-w-[120px]">
            <Icon name="arrowLeft" width={24} height={24} />
          </Button>
          <Text className="text-body-32 tablet:text-body-40 desktop:text-body-40 font-semibold flex-1">
            Create New Collection - {type}
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 p-4">
            {/* Upload file */}
            <div>
              <Text className="text-base font-semibold mb-1">Collection image</Text>
              <Controller
                name="image"
                control={control}
                rules={formRules.image}
                render={({ field: { value } }) => (
                  <ImageUploader
                    image={!!value ? parseImageUrl(value) : undefined}
                    onInput={handleUploadImage}
                    loading={uploading}
                    error={!!errors.image}
                  />
                )}
              />
            </div>
            {/* Name */}
            <div>
              <Text className="text-base font-semibold mb-1">Display name</Text>
              <Input register={register('name', formRules.name)} error={!!errors.name} />
            </div>
            {/* Symbol */}
            <div>
              <Text className="text-base font-semibold mb-1">Symbol</Text>
              <Input register={register('symbol', formRules.symbol)} error={!!errors.symbol} />
            </div>
            <div>
              <Text className="text-base font-semibold mb-1">Short URL</Text>
              <Input
                error={!!errors.shortUrl}
                register={register('shortUrl', formRules.shortUrl)}
              />
            </div>
            {/* Description */}
            <div>
              <Text className="text-base font-semibold mb-1">Description (optional)</Text>
              <Textarea
                className="h-[160px] resize-none"
                register={register('description', formRules.description)}
                error={!!errors.description}
              />
            </div>

            <FormValidationMessages errors={errors} />

            {/* Button finish */}
            <div className="justify-end">
              <ConnectWalletButton>
                <Button
                  disabled={validating || uploading}
                  type="submit"
                  className="w-full tablet:w-auto desktop:w-auto">
                  Create collection
                </Button>
              </ConnectWalletButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}