'use client'

import Text from '@/components/Text'
import ImageUploader from '@/components/Form/ImageUploader'
import Input from '@/components/Form/Input'
import Textarea from '@/components/Form/Textarea'
import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import NFTTypeSelection from '@/components/NFTTypeSelection'
import { useErc1155Factory, useErc721Factory, useUpdateCollection } from '@/hooks/useCreateCollection'
import { randomWord } from '@rarible/types'
import useAuthStore from '@/store/auth/store'
import { BASE_API_URL } from '@/config/api'
import Icon from '@/components/Icon'
import MarketplaceAPI from '@/services/api/marketplace'
import { toast } from 'react-toastify'

export default function CreateNFTCollectionPage() {
  const creator = useAuthStore(state => state.profile?.id)
  const [type, setType] = useState<'ERC721' | 'ERC1155'>()
  const { writeAsync: create721 } = useErc721Factory()
  const { writeAsync: create1155 } = useErc1155Factory()
  const { onUpdateCollection } = useUpdateCollection()
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      shortUrl: ''
    }
  })

  const [image, setImage] = useState<Blob | undefined>()

  const resetForm = () => {
    reset()
    setType(undefined)
  }

  const handleUploadImage = async (_image: Blob) => {
    return MarketplaceAPI.uploadFile(_image)
  }

  const onSubmit = async (data: any) => {
    console.log(data)

    if (!type || !creator || !image) return
    const toastId = toast.loading('Uploading Image...', { type: 'info' })

    try {
      const salt = randomWord()
      const { name, symbol, description, shortUrl } = data
      const args = [name, symbol, 'ipfs:/', BASE_API_URL + '/collection/' + shortUrl, [], salt]

      const { fileHashes } = await handleUploadImage(image)

      toast.update(toastId, { render: 'Sending transaction', type: 'info' })

      const res = type === 'ERC721' ? await create721({ args }) : await create1155({ args })
      const res3 = await onUpdateCollection({
        name,
        symbol,
        description,
        type,
        shortUrl,
        txCreationHash: res.hash,
        creators: creator,
        metadata: JSON.stringify({
          image: fileHashes[0]
        })
      })
      console.log(res3)
      toast.update(toastId, { render: 'Collection created successfully', type: 'success', isLoading: false })
      resetForm()
    } catch (e) {
      toast.update(toastId, { render: `Error creating collection: ${e}`, type: 'error', isLoading: false })
      console.error(e)
    }
  }

  if (!type) {
    return (
      <NFTTypeSelection title="Choose collection type" onSelect={setType} />
    )
  }

  return (
    <div className="w-full flex justify-center py-10 tablet:py-20 desktop:py-20">
      <Button variant="text" onClick={resetForm}>
        <Icon name="arrowLeft" width={24} height={24} />
      </Button>
      <div className="flex flex-col tablet:w-[550px] w-full">
        <Text className="text-body-32 tablet:text-body-40 desktop:text-body font-semibold mb-6 tablet:mb-10 desktop:mb-10">
          Create New Collection
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-10">
            {/* Upload file */}
            <div>
              <Text className="text-base font-semibold mb-1">Collection image</Text>
              <ImageUploader
                image={image}
                onInput={setImage}
              />
            </div>
            {/* Name */}
            <div>
              <Text className="text-base font-semibold mb-1">Display name</Text>
              <Input register={register('name')}
              />
            </div>
            {/* Symbol */}
            <div>
              <Text className="text-base font-semibold mb-1">Symbol</Text>
              <Input
                register={register('symbol')}
              />
            </div>
            <div>
              <Text className="text-base font-semibold mb-1">Short URL</Text>
              <Input
                register={register('shortUrl')}
              />
            </div>
            {/* Description */}
            <div>
              <Text className="text-base font-semibold mb-1">Description (optional)</Text>
              <Textarea
                className="h-[160px] resize-none"
                register={register('description')}
              />
            </div>

            {/* Button finish */}
            <div className="justify-end flex">
              <Button type="submit" className="w-full tablet:w-auto desktop:w-auto">Finish</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}