'use client'

import Button from "@/components/Button";
import Input from "@/components/Form/Input";
import Textarea from "@/components/Form/Textarea";
import Text from "@/components/Text";
import ImageUploader from '@/components/Form/ImageUploader'
import { useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import NFTTypeSelection from '@/components/NFT/NFTTypeSelection'
import Icon from '@/components/Icon'
import { AssetType, Trait } from '@/types'
import CreateNFTButton from './components/CreateNFTButton'
import { CreateNFTForm } from '@/types/form'
import { classNames } from '@/utils/string'
import useAuthStore from '@/store/auth/store'
import useSWR from 'swr'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi'
import { Accordion } from 'flowbite-react'
import Link from 'next/link'

export default function CreateNftPage() {
  const api = useMarketplaceApi()
  const userId = useAuthStore(state => state.credentials?.userId)
  const { data, error, isLoading } = useSWR(
    !!userId ? 'my-collections' : null,
    () => api.fetchCollectionsByUser(userId as string),
    { refreshInterval: 3600 * 1000 }
  )
  const methods = useForm<CreateNFTForm>({
    defaultValues: { traits: [{ trait_type: '', value: '' }] }
  })
  const collection = methods.watch('collection')
  const [type, setType] = useState<AssetType>()

  const collectionOptions = useMemo(() => {
    const collections = data?.map(c => ({
      label: c.name ?? c.id, value: c.address, type: c.type
    })) || []
    return collections.filter(c => c.type === type)
  }, [data, type])

  const resetForm = () => {
    methods.reset()
    setType(undefined)
  }

  const handleTraitInput = (index: number, key: keyof Trait, value: any) => {
    const _traits = methods.getValues('traits')
    if (!_traits) return
    const _trait = { ..._traits[index] }
    if (!_trait) return
    _trait[key] = value
    _traits[index] = _trait
    methods.setValue('traits', _traits)

    const lastTrait = _traits[_traits.length - 1]
    if (!lastTrait) return
    if (!lastTrait.trait_type || !lastTrait.value) return
    _traits.push({ trait_type: '', value: '' }) // Add more trait when inputting
    methods.setValue('traits', _traits as Trait[])
  }
  //
  // useEffect(() => {
  //   const subscription = methods.watch((value, { name }) => {
  //     if (name === 'traits') {
  //       const { traits } = value
  //       if (!traits) return
  //       const lastTrait = traits[traits.length - 1]
  //
  //       if (!lastTrait) return
  //       if (!lastTrait.trait_type || !lastTrait.value) return
  //       const _traits = [...traits]
  //       _traits.push({ trait_type: '', value: '' }) // Add more trait when inputting
  //       methods.setValue('traits', _traits as Trait[])
  //     }
  //   })
  //   return () => subscription.unsubscribe()
  // }, [methods.watch, methods.setValue])

  if (!type) {
    return (
      <NFTTypeSelection title="Select NFT type" onSelect={setType} />
    )
  }

  return (
    <div className="w-full flex justify-center py-10 tablet:py-20 desktop:py-20">
      <div className="flex flex-col tablet:w-[550px] w-full">
        <div className="flex items-center mb-6 tablet:mb-10 desktop:mb-10">
          <Button variant="text" onClick={resetForm} className='min-w-[60px] tablet:min-w-[120px] desktop:min-w-[120px]'>
            <Icon name="arrowLeft" width={24} height={24} />
          </Button>
          <Text className="text-body-32 tablet:text-body-40 desktop:text-body-40 font-semibold">
            Create New NFT - {type}
          </Text>
        </div>
        <FormProvider {...methods}>
          <form>
            <div className="flex flex-col gap-10 p-4">
              {/* Upload file */}
              <div>
                <Text className="text-body-16 font-semibold mb-1">Upload file</Text>
                <Controller
                  name="image"
                  control={methods.control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <ImageUploader
                      image={value}
                      onInput={onChange} />
                  )}
                />
              </div>
              {/* Choose collection */}
              <div>
                <Text className="text-body-16 font-semibold mb-1">Choose collection</Text>
                <Controller
                  name="collection"
                  control={methods.control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex items-center gap-3 w-full max-h-56 overflow-y-auto flex-wrap">
                      {
                        collectionOptions.length ? collectionOptions.map(c => (
                          <div
                            key={c.value}
                            onClick={() => onChange(c.value)}
                            className={classNames(
                              'w-36 overflow-ellipsis flex flex-col justify-center items-center gap-2 cursor-pointer rounded-2xl p-8',
                              'hover:border-2 hover:border-primary hover:bg-white hover:text-primary',
                              c.value === value ? 'border-2 border-primary bg-white text-primary' : ' border text-tertiary bg-surface-soft'
                            )}>
                            <Text className="text-heading-sm font-bold text-primary text-ellipsis">{c.label}</Text>
                            <Text className="text-body-12 text-secondary text-ellipsis">{c.type}</Text>
                          </div>
                        )) : (
                          <Link className="text-center" href={`/create/collection`}>Create Collection</Link>
                        )
                      }
                    </div>
                  )}
                />
              </div>
              {/* Name */}
              <div>
                <Text className="text-body-16 font-semibold mb-1">Display name</Text>
                <Input
                  register={methods.register('name', { required: true })}
                />
              </div>
              {/* Description */}
              <div>
                <Text className="text-body-16 font-semibold mb-1">Description</Text>
                <Textarea
                  className="h-[160px] resize-none"
                  register={methods.register('description')}
                />
              </div>
              {/* Royalties */}
              <div>
                <Text className="text-body-16 font-semibold mb-1">Royalties</Text>
                <Input
                  register={methods.register('royalties', { required: true })}
                  appendIcon={(
                    <Text className="text-secondary">%</Text>
                  )}
                />
              </div>

              {
                type === 'ERC1155' && (
                  <div>
                    <Text className="text-body-16 font-semibold mb-1">Number of copies</Text>
                    <Input
                      register={methods.register('amount', { required: true })}
                    />
                  </div>
                )
              }

              <Accordion collapseAll>
                <Accordion.Panel>
                  <Accordion.Title>Advanced settings</Accordion.Title>
                  <Accordion.Content>
                    <Text className="text-primary font-semibold mb-4" variant="body-16">
                      Properties <span className="text-secondary">(Optional)</span>
                    </Text>

                    <div className="w-full flex flex-col gap-4">
                      <Controller
                        name="traits"
                        control={methods.control}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <>{Array.isArray(value) && value.map((trait, index) => (
                              <div key={index} className="w-full flex items-center gap-7">
                                <Input
                                  value={value[index].trait_type}
                                  containerClass="flex-1"
                                  placeholder="e.g. Size"
                                  onChange={event => handleTraitInput(index, 'trait_type', event.target.value)} />
                                <Input
                                  value={value[index].value}
                                  containerClass="flex-1"
                                  placeholder="e.g. M"
                                  onChange={event => handleTraitInput(index, 'value', event.target.value)} />
                              </div>
                            ))}</>
                          )
                        }} />
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>

              {
                !!collection ? collectionOptions.map(c => {
                  return c.value === collection ? (
                    <CreateNFTButton
                      assetType={type}
                      key={c.value}
                      collection={c.value}
                    />
                  ) : null
                }) : (
                  <Button disabled>
                    Create Item
                  </Button>
                )
              }
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}